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

            <div v-for="(block, i) in flow.scheme" class="block-container">
                <InfoBlock
                    :options="{userA: flow.userA, userB: flow.userB}" 
                    v-model="flow.scheme[i]"
                    :cancel="cancelNewBlock"
                    :success="addNewBlock"
                    :type="flow.scheme[i].editType"
                    v-if="block.type == 'info'"
                />

                <CommunicationBlock
                    :options="{userA: flow.userA, userB: flow.userB}" 
                    v-model="flow.scheme[i]"
                    :cancel="cancelNewBlock"
                    :success="addNewBlock"
                    :type="flow.scheme[i].editType"
                    v-if="block.type == 'communication'"
                />
                
                <footer class="block-edit-footer" v-if="mode == 'edit' && flow.scheme[i].editType == 'view'">
                    <button class="button ghost c-red" @click="removeBlock(flow.scheme[i])">verwijder</button>
                    <button class="button ghost c-blue" @click="flow.scheme[i].editType = 'edit'">bewerk</button>
                </footer>
                
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
import { Icon } from '@iconify/vue';

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
            editCommunicationBlock: false,
            a: {
                id: 'string',
                parentId: '',
                position: 'userB',
                content: 'lorem ipsum',
            },
            b: {
                id: 'string',
                parentId: '',
                position: 'userB',
                content: 'lorem ipsum',
            },
            c: {
                id: 'string',
                parentId: '',
                position: 'userB',
                content: 'lorem ipsum',
            },
            viewA: "edit",
            view: {
                a: 'view',
                b: 'edit',
                c: 'add',
            }
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
            this.flows.load(this.$route.params.flowId).then((flow) => {
                this.flow = flow;
            })
        },
        addBlock(option: 'communication' | 'info', parentId = undefined as undefined | string) {
            if (!this.flow) {
                return
            }

            if (option == 'communication') {
                this.flow.scheme.push({
                    type: 'communication',
                    id: new Date().getTime().toString(16),
                    parentId: parentId,
                    position: 'userA',
                    content: '',
                    editType: 'add'
                })
            } else if (option == 'info') {
                this.flow.scheme.push({
                    type: 'info',
                    id: new Date().getTime().toString(16),
                    parentId: parentId,
                    position: 'userA',
                    content: '',
                    editType: 'add'
                })
            }
        },
        cancelNewBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            if (!this.flow) {
                return
            }
            
            if (scheme.editType == 'edit') {
                scheme.editType = 'view'
            }

            if (scheme.editType == 'add') {
                this.flow.scheme.pop()
            }
        },
        addNewBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            if (!this.flow) {
                return
            }
            
            scheme.editType = 'view'
            this.flows.update(this.flow)
        },
        removeBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            if (!this.flow) {
                return
            }
            
            this.flow.scheme = this.flow.scheme.filter((item) => item.id != scheme.id)
            console.log(this.flow)
            this.flows.update(this.flow).then(d => {
                console.log("D",d)
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
    margin: -24px auto 0;
    opacity: 0;
    width: 50%;
    .button {
        margin: 8px;
    }
}

</style>