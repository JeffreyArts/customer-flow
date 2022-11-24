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


            <div class="flow-modify-buttons" v-if="mode == 'edit'">
                <span class="flow-modify-button">
                    <button class="button">
                        <Icon icon="material-symbols:add-rounded" />
                        Keuze toevoegen
                    </button>
                </span>
                <span class="flow-modify-button">
                    <button class="button" @click="editCommunicationBlock=true">
                        <Icon icon="material-symbols:add-rounded" />
                        Commmunicatie blok toevoegen
                    </button>
                </span>
                <span class="flow-modify-button">
                    <button class="button">
                        <Icon icon="material-symbols:add-rounded" />
                        Info blok toevoegen
                    </button>
                </span>
            </div>

            


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
            />

            
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
import { flowObject, ToggleOptions } from "../../types";
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
    },
    created() {
        this.loadFlow()
    },

    mounted() {
    },
    methods: {
        loadFlow() {
            // load flow from route parameter flowId
            this.flows.load(this.$route.params.flowId).then((flow) => {
                this.flow = flow;
            })
        },
        add() {
            console.log("ASDF")
        },
        addCommunicationBlock() {
            this.editCommunicationBlock = true
        },
        cancelEdit() {
            this.editCommunicationBlock = false
        }
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

</style>