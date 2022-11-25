import { defineStore } from "pinia";
import PouchDB from "pouchdb-browser"
import _ from "lodash";
import { flowObject } from "../../types";
const db = new PouchDB("flows")


export const flowsDataStore = defineStore({
    id: "projectData",
    state: () => ({
        flows: [] as Array<flowObject>,
        flowId: "",
    }),
    actions: {
        add(flow: flowObject):Promise<flowObject>  {
            return new Promise((resolve, reject) => {
                db.put(flow).then(() => {
                    this.flows.push(flow)
                    resolve(flow)
                }).catch(reject)
            })
        },  
        update(newFlow: flowObject):Promise<flowObject>  {
            return new Promise((resolve, reject) => {
                this.load(newFlow._id).then(oldFlow => {
                    const doc = _.merge({}, oldFlow,_.pick( newFlow, ["_id", "_rev", "userA", "userB", "interaction", "description", "scheme"]))
                    doc.scheme = _.map(newFlow.scheme, scheme => { return _.pick(scheme, ["id", "type", "parentId", "content", "position","options"])});

                    db.put(doc).then((res) => {
                        doc._rev = res.rev
                        resolve(_.pick(doc, ["_id", "_rev", "userA", "userB", "interaction", "description", "scheme"]) as flowObject)
                    }).catch(reject)
                }).catch(err => {
                    console.error(new Error(`No flow found with id ${newFlow._id}`))
                    reject()
                })
            })
        },
        load(flowId: string):Promise<flowObject>{
            return db.get(flowId)
        },
        getAll(filter?: {finished?: false}) :Promise<Array<flowObject>> {
            return new Promise((resolve,reject) => {
                db.allDocs({
                    include_docs: true,
                    attachments: true
                }).then((result) => {
                    let rows = _.map(result.rows, row => { return row.doc}) as Array<flowObject> 
                    
                    if (filter) {
                        rows = _.compact(_.map(rows, (row: flowObject) => {
                            return row
                        }))
                    }
                    this.flows = rows;
                    return resolve(rows)
                }).catch(reject)
            })
        },
    },
    getters: {
    }
});

export default flowsDataStore;