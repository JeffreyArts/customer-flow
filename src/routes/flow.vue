<template>
    <div class="page" v-if="flow">

        <div to="/" class="page-top-right">
                
            <toggle :options="[{
                id:'edit',
                name: '🖊️',
                selected: true,
                bgcolor: '#fff',
            }, {
                id:'view',
                name: '👁️',
                selected: false,
                bgcolor: '#fff',
            }]" v-model="mode" />
        </div>

        <header class="page-header">
            <h1 class="page-title">{{flow.userA}} {{flow.interaction}} {{flow.userB}}</h1>
        </header>
        <div class="flow-container" >
            <header class="flow-header">
                <div class="flow-header-left">
                    {{flow.userA}}
                </div>
                <div class="flow-header-right">
                    {{flow.userB}}
                </div>
            </header>
            <div class="flow-content">
                <div class="flow-column-content"></div>
            </div>

            <div class="flow-modify-buttons" v-if="mode == 'edit' && flow.scheme.length == 0">
                <span class="flow-modify-button">
                    <button class="button">
                        <Icon icon="material-symbols:add-rounded" />
                        Keuze toevoegen
                    </button>
                </span>
                <span class="flow-modify-button">
                    <button class="button" @click="addBlock('communication')">
                        <Icon icon="material-symbols:add-rounded" />
                        Commmunicatie blok toevoegen
                    </button>
                </span>
                <span class="flow-modify-button">
                    <button class="button" @click="addBlock('info')">
                        <Icon icon="material-symbols:add-rounded" />
                        Info blok toevoegen
                    </button>
                </span>
            </div>

            
            <div v-for="(block, i) in scheme" class="block-container">
                <InfoBlock
                    :options="{userA: flow.userA, userB: flow.userB}" 
                    v-model="scheme[i]"
                    :cancel="scheme[i].cancel"
                    :success="addNewBlock"
                    :type="scheme[i].editType"
                    v-if="block.type == 'info'"
                />

                <CommunicationBlock
                    :options="{userA: flow.userA, userB: flow.userB}" 
                    v-model="scheme[i]"
                    :cancel="scheme[i].cancel"
                    :success="addNewBlock"
                    :type="scheme[i].editType"
                    v-if="block.type == 'communication'"
                />
                
                <footer class="block-edit-footer" v-if="mode == 'edit' && scheme[i].editType == 'view'">
                    <button class="button ghost c-red" @click="removeBlock(scheme[i])">verwijder</button>
                    <button class="button ghost" @click="addBlocks = i"> <Icon icon="material-symbols:add-rounded" /></button>
                    <button class="button ghost c-blue" @click="scheme[i].editType = 'edit'">bewerk</button>
                </footer>

                <div class="flow-modify-buttons" v-if="mode == 'edit' && addBlocks == i">
                    <span class="flow-modify-button">
                        <button class="button">
                            <Icon icon="material-symbols:add-rounded" />
                            Keuze toevoegen
                        </button>
                    </span>
                    <span class="flow-modify-button">
                        <button class="button" @click="addBlock('communication', scheme[i].id)">
                            <Icon icon="material-symbols:add-rounded" />
                            Communicatie blok toevoegen
                        </button>
                    </span>
                    <span class="flow-modify-button">
                        <button class="button" @click="addBlock('info', scheme[i].id)">
                            <Icon icon="material-symbols:add-rounded" />
                            Info blok toevoegen
                        </button>
                    </span>
                </div>
                
            </div>

            
<!-- 

            <InfoBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="a"
                :type="view.a"
            />
            <InfoBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="b"
                :cancel="() => {view.b = 'view';}"
                :success="() => {view.b = 'view';}"
                :type="view.b"
                />
            <InfoBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="c"
                :cancel="() => {view.c = '';}"
                :success="() => {view.c = 'view';}"
                :type="view.c"
            /> -->
<!-- 
            
            
            <CommunicationBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="a"
                :type="view.a"
            />
            <CommunicationBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="b"
                :cancel="() => {view.b = 'view';}"
                :success="() => {view.b = 'view';}"
                :type="view.b"
                />
            <CommunicationBlock
                :options="{userA: flow.userA, userB: flow.userB}" 
                v-model="c"
                :cancel="() => {view.c = '';}"
                :success="() => {view.c = 'view';}"
                :type="view.c"
            /> -->
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import { flowObject, flowSchemeOption, flowSchemeCommunication, flowSchemeInfo } from "../../types";
import Toggle from "../components/toggle.vue"
import CommunicationBlock from "../components/communication-block.vue"
import InfoBlock from "../components/info-block.vue"
import Flows from "../stores/flows";
import _ from "lodash";
import { Icon } from '@iconify/vue';

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

export default defineComponent ({ 
    name: "homePage",
    components: {Toggle, Icon, CommunicationBlock, InfoBlock},
    props: [],
    setup() {
        const flows = Flows()
        return {
            flows,
        }
    },
    data() {
        return {
            mode: "edit",
            flow: null as null | flowObject,
            addBlocks: 1024
        }
    },
    computed: {
        scheme() {
            if (!this.flow) {
                return []
            }
            var test = _.shuffle(this.flow.scheme) as Array<flowSchemeOption>
            var array = []
            var firstBlock = findChildObject(undefined, test);

            if (!firstBlock) {
                return []
            }

            array.push(firstBlock)
            orderScheme(array, test)
            
            var res = _.map(array, (scheme, index) => {
                if (!scheme.editType) {
                    scheme.cancel = this.cancelNewBlock
                    if (this.scheme && this.scheme[index]) {
                        scheme.editType = this.scheme[index].editType
                    } else {
                        scheme.editType = "view"
                    }
                }
                return scheme 
            })
            return res
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.loadFlow()
            }
        }
    },
    mounted() {
    },
    methods: {
        loadFlow() {
            this.flows.load(this.$route.params.flowId.toString()).then((flow) => {
                this.flow = flow;
            })
        },
        addBlock(option: 'communication' | 'info', parentId = undefined as undefined | string) {
            this.addBlocks = 1024
            let parent = undefined as undefined | flowSchemeOption;
            const id = new Date().getTime().toString(16);

            if (!this.flow) {
                return
            }

            let sibling = _.find(this.scheme, (scheme:flowSchemeOption) => {
                return scheme.parentId == parentId
            })

            if (sibling) {
                sibling.parentId = id
            }

            if (parentId) {
                parent = _.find(this.scheme, (scheme:flowSchemeOption) => {
                    return scheme.id == parentId
                })
            }

            if (option == 'communication') {
                this.flow.scheme.push({
                    type: 'communication',
                    id: id,
                    parentId: parentId,
                    position: parent?.position == 'userA' ? 'userB' : 'userA',
                    content: '',
                    cancel: this.cancelNewBlock,
                    editType: 'add'
                })
            } else if (option == 'info') {
                this.flow.scheme.push({
                    type: 'info',
                    id: id,
                    parentId: parentId,
                    position: parent?.position == 'userA' ? 'userB' : 'userA',
                    content: '',
                    cancel: this.cancelNewBlock,
                    editType: 'add'
                })
            }
            
            
            this.flows.update(this.flow).then(newFlow => {
                this.flow = newFlow
            })
        },
        updateParentId(item: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            if (!this.flow) {
                return
            }

            let parentItem = _.find(this.flow.scheme, (scheme:flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) => {
                return scheme.id == item.parentId
            })
            
            let childItem = _.find(this.flow.scheme, (scheme:flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) => {
                return scheme.parentId == item.id
            })
        
            if (!childItem) {
                return
            }

            childItem.parentId = parentItem?.id
        },
        removeBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            this.addBlocks = 1024
            if (!this.flow) {
                return
            }
            let parent = scheme
            this.updateParentId(parent)

            this.flow.scheme = _.omitBy(this.flow.scheme.filter((item) => { return item.id != scheme.id}), _.isEmpty)
            
            this.flows.update(this.flow).then(newFlow => {
                this.flow = newFlow
            })
        },
        cancelNewBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            this.addBlocks = 1024
            if (!this.flow) {
                return
            }
            
            if (scheme.editType == 'edit') {
                scheme.editType = 'view'
            }
            
            if (scheme.editType == 'add') {
                this.flow.scheme.pop()
            }
            
            this.flows.update(this.flow).then(newFlow => {
                this.flow = newFlow
            })
        },
        addNewBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            this.addBlocks = 1024
            if (!this.flow) {
                return
            }
            
            scheme.editType = 'view'
            this.flows.update(this.flow).then(newFlow => {
                this.flow = newFlow
            })
        },
    }
})

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.flow-header {
    width: 100%;
    margin: 32px 0;
    display: flex;

    > * {
        width: 50%;
        display: block;
        text-align: center;
        font-size: 24px;
        font-weight: 500;
    }
}

.flow-modify-buttons {
    display: flex;
    align-items: center;
    flex-flow: column;
    margin: 32px 0;
}
.flow-modify-button {
    margin-bottom: 8px;
    svg {
        transform: translate(-8px, 2px) scale(1.6);
    }
}

.block-container {
    &:hover {
        .block-edit-footer {
            opacity: 1;
        }
    }
}

.block-edit-footer {
    margin: -24px auto 8px;
    opacity: 0;
    width: 50%;
    display: flex;
    justify-content: space-between;
    transition: $transitionFast;
    .button {
        margin: 8px;
        svg {
            scale: 1.6;
            translate: 0 2px;
        }
    }
}

</style>