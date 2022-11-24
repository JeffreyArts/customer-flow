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
        add: async (flow: flowObject) => {
            db.put(flow)
        },  
        load(flowId: string):Promise<flowObject>{
            return db.get(flowId)
        },
        getAll(filter?: {finished?: false}) :Promise<Array<flowObject>> {
            return new Promise((resolve,reject) => {
                db.allDocs({
                    include_docs: true,
                    attachments: true
                }).then(function (result) {
                    let rows = _.map(result.rows, row => { return row.doc}) as Array<flowObject> 
                    
                    if (filter) {
                        rows = _.compact(_.map(rows, (row: flowObject) => {
                            return row
                        }))
                    }
                    // console.log("rows",rows, filter)
                    return resolve(rows)
                }).catch(reject)
            })
        },
    },
    getters: {
    }
});

export default flowsDataStore;