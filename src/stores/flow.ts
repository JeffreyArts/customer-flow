import { defineStore } from "pinia";
import PouchDB from "pouchdb-browser"
import _ from "lodash";
import { flowObject, flowSchemeOption, flowSchemeCommunication, flowSchemeInfo } from "../../types";
const db = new PouchDB("flows")

const findChildObject = (id: string | undefined, scheme: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>) => {
    let found = false;
    let foundObject = null;
    for (let i = 0; i < scheme.length; i++) {
        if (scheme[i].parentId == id) {
            return scheme[i];
            break;
        }
    }
    return foundObject;
}

const orderScheme = (
        array: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>, 
        scheme: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>
    ) => {
    let lastArrayItem = array[array.length - 1];
    let prevArrayItem = array[array.length - 2];
    if (!lastArrayItem) {
        return array;
    }

    let child = findChildObject(lastArrayItem.id, scheme)
    if (!child) {
        return array;
    }

    array.push(child);
    if (array.length < scheme.length) {
        orderScheme(array, scheme);
    }
    return array
}

export const flowDataStore = defineStore({
    id: "flow",
    state: () => ({
        model: null as flowObject | null,
        updateTrigger: 0,
        flowId: "",
        selectedOptions: [] as Array<{schemeId: string, optionId: string}>,
    }),
    actions: {
        docToFlowobject(doc: any): flowObject {
            return _.pick(doc, ["_id", "_rev", "userA", "userB", "interaction", "description", "scheme"]) as flowObject
        },
        cleanUpScheme(): void {
            if (!this.model) {
                return;
            }
            // Remove all scheme items that are not connected to a parent scheme item
            _.remove(this.model.scheme, schemeItem => {
                if (schemeItem.parentId == undefined) {
                    return false
                }
                
                if (schemeItem.type == "options" && schemeItem.options && schemeItem.options.length < 1) {
                    return true
                }
                
                return !_.find(this.model.scheme, {id: schemeItem.parentId})
            })
            
            if (this.model.scheme.length == 1) {
                this.model.scheme[0].parentId = undefined;
            }
        },
        set(flow: flowObject):flowObject  {
            this.model = flow;
            this.cleanUpScheme();
            return this.model
        },
        unset():null  {
            return this.model = null;
        },
        update():Promise<flowObject>  {
            return new Promise((resolve, reject) => {
                if (_.isNull(this.model)) {
                    reject(new Error("No model set"))
                }

                const doc = _.merge({}, this.model,_.pick( this.model, ["_id", "_rev", "userA", "userB", "interaction", "description", "scheme"]))
                doc.scheme = _.map(doc.scheme, schemeItem => { return _.pick(schemeItem, ["id", "type", "parentId", "content", "position","options"])});
                db.put(doc).then((res) => {
                    this.model._rev = res.rev
                    resolve(this.docToFlowobject(this.model))
                }).catch(reject)

            })
        },
        removeFlow(
            flowId: string
            ) : Promise<flowObject>{
            return db.get(flowId).then((doc) => {
                db.remove(doc);
                return this.docToFlowobject(doc)
            })
        },
        addSchemeItem(
            type: "communication" | "info" | "options", 
            parentId: string | undefined, 
            schemeOptions = {} as any
            ) : Promise<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>  {
            return new Promise((resolve, reject) => {
                if (_.isNull(this.model)) {
                    console.error(new Error("No model set"))
                    return Promise.reject()
                }
                
                let parent = undefined as undefined | flowSchemeOption | flowSchemeCommunication | flowSchemeInfo;
                let sibling = undefined as undefined | flowSchemeOption | flowSchemeCommunication | flowSchemeInfo;
                const id = new Date().getTime().toString(16);
                
                parent = _.find(this.model.scheme, (scheme:flowSchemeOption) : flowSchemeOption | flowSchemeCommunication | flowSchemeInfo => {
                    return scheme.id == parentId
                })
                
                if (parent && parent.type != "options") {
                    sibling = _.find(this.model.scheme, (schemeItem:flowSchemeOption) : flowSchemeOption | flowSchemeCommunication | flowSchemeInfo => {
                        return schemeItem.parentId == parentId
                    })
                }
                    
                if (sibling) {
                    sibling.parentId = id
                }
                
                let position = schemeOptions.position || parent?.position == 'userA' ? 'userB' : 'userA'
                schemeOptions.id = id
                schemeOptions.parentId = parentId
                schemeOptions.editType = schemeOptions.editType || "add"
                schemeOptions.type = type
                schemeOptions.position = position
                
                if (type == 'options') {
                    schemeOptions.options = [] as Array<string>
                }

                this.model.scheme.push(schemeOptions)
                
                this.update().then(() => {
                    return resolve(_.find(this.model.scheme, {id: id}) as flowSchemeOption | flowSchemeCommunication | flowSchemeInfo)
                }).catch(reject)
            })
        },
        getSchemeItem(schemeItemId: string): flowSchemeOption | flowSchemeCommunication | flowSchemeInfo | undefined {
            return _.find(this.model.scheme, {id: schemeItemId})
        },
        removeSchemeItem(removedSchemeItem: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo | string) : Promise<flowObject> {
            return new Promise((resolve, reject) => {
                
                if (_.isNull(this.model)) {
                    console.error(new Error("No model set"))
                    return reject()
                }
                
                if (_.isString(removedSchemeItem)) {
                    removedSchemeItem = _.find(this.model.scheme, {id: removedSchemeItem}) as flowSchemeOption | flowSchemeCommunication | flowSchemeInfo
                }
                // Update children by setting their parentId to the parentId of the removed item
                _.each(this.model.scheme, (item:flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) => {
                    if (item.parentId == removedSchemeItem.id) {
                        item.parentId = removedSchemeItem.parentId
                    }
                })
                
                // Remove removedSchemeItem
                this.model.scheme = _.filter(this.model.scheme, (item:flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) => {
                    return item.id != removedSchemeItem.id
                })
                resolve(this.model.scheme)
            })
        },
        selectOption(select: {schemeId: string, optionId: string}): void {
            var alreadyPicked = _.find(this.selectedOptions, (option) => {
                return option.schemeId == select.schemeId
            })
            
            if (alreadyPicked) { 
                alreadyPicked.optionId = select.optionId
            } else {
                this.selectedOptions.push(select)
            }
        }
    },
    getters: {
    }
});

export default flowDataStore;