<template>
    <div class="page" v-if="flow && flow.model" 
        :class="mode == 'edit' ? '__isEdit' : '__isView'">
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
            }]" v-model="mode" @click="resetSchemeView"/>
        </div>

        <header class="page-header">
            <h1 class="page-title">{{flow.model.userA}} {{flow.model.interaction}} {{flow.model.userB}}</h1>
        </header>
        <div class="flow-container" >
            <header class="flow-header">
                <div class="flow-header-left">
                    {{flow.model.userA}}
                </div>
                <div class="flow-header-right">
                    {{flow.model.userB}}
                </div>
            </header>

            <div class="flow-buttons" v-if="mode == 'edit' && flow.model.scheme.length < 1">
                <span class="flow-button">
                    <button class="button" @click="addBlock('options')">
                        <Icon icon="material-symbols:add-rounded" />
                        Keuze toevoegen
                    </button>
                </span>
                <span class="flow-button">
                    <button class="button" @click="addBlock('communication')">
                        <Icon icon="material-symbols:add-rounded" />
                        Commmunicatie blok toevoegen
                    </button>
                </span>
                <span class="flow-button">
                    <button class="button" @click="addBlock('info')">
                        <Icon icon="material-symbols:add-rounded" />
                        Info blok toevoegen
                    </button>
                </span>
            </div>

            
            <div v-for="(block, i) in scheme" class="block-container" :ref="block.id" :key="i">
                <InfoBlock
                    :options="{userA: flow.model.userA, userB: flow.model.userB}" 
                    v-model="scheme[i]"
                    :cancel="scheme[i].cancel"
                    :success="addNewBlock"
                    :type="scheme[i].editType"
                    v-if="block.type == 'info'"
                />

                <CommunicationBlock
                    :options="{userA: flow.model.userA, userB: flow.model.userB}" 
                    v-model="scheme[i]"
                    :cancel="scheme[i].cancel"
                    :success="addNewBlock"
                    :type="scheme[i].editType"
                    v-if="block.type == 'communication'"
                    />
                    
                    <!-- :options="{userA: flow.model.userA, userB: flow.model.userB}"  -->
                <OptionsBlock
                    :options="{userA: flow.model.userA, userB: flow.model.userB}" 
                    v-model="scheme[i]"
                    :scheme="flow.model.scheme"
                    :cancel="scheme[i].cancel"
                    :success="addNewBlock"
                    :type="scheme[i].editType"
                    v-if="block.type == 'options'"
                />
                
                <footer class="block-edit-footer" v-if="mode == 'edit' && scheme[i].editType == 'view'">
                    <button class="button ghost c-red" @click="removeBlock(scheme[i])">verwijder</button>
                    <button class="button ghost" @click="showFlowButtons(i)" v-if="scheme[i].type != 'options'"> <Icon icon="material-symbols:add-rounded" /></button>
                    <button class="button ghost c-blue" @click="scheme[i].editType = 'edit'">bewerk</button>
                </footer>

                <div class="flow-buttons" ref="flow-buttons" v-if="mode == 'edit' && addBlocks == i">
                    <span class="flow-button">
                        <button class="button" @click="addBlock('options', scheme[i].id)">
                            <Icon icon="material-symbols:add-rounded" />
                            Keuze toevoegen
                        </button>
                    </span>
                    <span class="flow-button">
                        <button class="button" @click="addBlock('communication', scheme[i].id)">
                            <Icon icon="material-symbols:add-rounded" />
                            Communicatie blok toevoegen
                        </button>
                    </span>
                    <span class="flow-button">
                        <button class="button" @click="addBlock('info', scheme[i].id)">
                            <Icon icon="material-symbols:add-rounded" />
                            Info blok toevoegen
                        </button>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent, triggerRef} from "vue"
import { flowObject, flowSchemeOption, flowSchemeCommunication, flowSchemeInfo } from "../../types";
import Toggle from "../components/toggle.vue"
import CommunicationBlock from "../components/communication-block.vue"
import OptionsBlock from "../components/options-block.vue"
import InfoBlock from "../components/info-block.vue"
import Flows from "../stores/flows";
import Flow from "../stores/flow";
import _ from "lodash";
import { Icon } from '@iconify/vue';

const findChildObject = (id: string | undefined, scheme: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>) : undefined | flowSchemeOption | flowSchemeCommunication | flowSchemeInfo => {
    for (let i = 0; i < scheme.length; i++) {
        if (scheme[i].parentId == id) {
            return scheme[i];
            break;
        }
    }
    return undefined;
}

const orderScheme = (
        array: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>, 
        scheme: Array<flowSchemeOption | flowSchemeCommunication | flowSchemeInfo>,
        selectedOptions: Array<{schemeId: string, optionId: string}>
    ) => {
    let lastSchemeItem = array[array.length - 1];
    let parentSchemeItem = _.find(scheme, (schemeItem) => {
        return schemeItem.id == lastSchemeItem.parentId
    })
    let child = undefined as undefined | flowSchemeOption | flowSchemeCommunication | flowSchemeInfo;

    if (!lastSchemeItem) {
        return array;
    }

    let selectedOption = selectedOptions.find((option) => option.schemeId == lastSchemeItem.id);

    if (lastSchemeItem.type == 'options') {
        if (!selectedOption) {
            return array;
        }
        child = _.find(scheme, (item) => item.id == selectedOption.optionId);
    } else {
        child = findChildObject(lastSchemeItem.id, scheme)
    }

    if (!child) {
        return array;
    }
    
    // let a = !!_.find(scheme, (item) => { return item.parentId == child.id})
    // if (a) {
    // }

    array.push(child);
    orderScheme(array, scheme, selectedOptions);
    return array
}

export default defineComponent ({ 
    name: "homePage",
    components: {Toggle, Icon, CommunicationBlock, OptionsBlock, InfoBlock},
    props: [],
    setup() {
        const flows = Flows()
        const flow = Flow()
        return {
            flows,
            flow,
        }
    },
    data() {
        return {
            mode: "edit",
            addBlocks: 1024,
            refreshKey: 0
        }
    },
    computed: {
        scheme() {
            this.refreshKey;
            if (!this.flow || !this.flow.model) {
                return []
            }

            var array = []
            var firstBlock = findChildObject(undefined, this.flow.model.scheme);

            if (!firstBlock) {
                return []
            }
            array.push(firstBlock)
            orderScheme(array, this.flow.model.scheme, this.flow.selectedOptions)

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
        },
        flow: {
            deep: true,
            handler() {
                if (this.flow.selectedOptions.length >= 1) {
                    // Manually trigger computed scheme
                    this.refreshKey++;
                }
            }
        }
    },
    mounted() {
    },
    methods: {
        loadFlow() {
            this.flows.load(this.$route.params.flowId.toString()).then((flow) => {
                this.flow.set(flow);
            })
        },
        addBlock(option: 'communication' | 'info' | 'options', parentId = undefined as undefined | string) {
            this.addBlocks = 1024
            
            this.flow.addSchemeItem(option, parentId, {
                cancel: this.cancelNewBlock,
            }).then((schemeItem: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) => {

                setTimeout(() => {
                    let domArray = this.$refs[schemeItem.id] as Array<HTMLElement>
                    if (domArray) {
                        domArray[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
                    }
                })
            })
        },  
        resetSchemeView() {
            this.flow.selectedOptions = []
        },
        removeBlock(scheme: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            this.addBlocks = 1024

            this.flow.removeSchemeItem(scheme).then(() => {
                this.flow.update()
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
                this.flow.model.scheme.pop()
            }
            
            this.flow.update()
        },
        addNewBlock(schemeItem: flowSchemeOption | flowSchemeCommunication | flowSchemeInfo) {
            this.addBlocks = 1024
            if (!this.flow) {
                return
            }
            
            schemeItem.editType = 'view'
            this.flow.update()
        },
        showFlowButtons(index:number) {
            this.addBlocks = index;

            setTimeout(() => {
                let flowButtons = this.$refs['flow-buttons'] as Array<HTMLElement>;
                if (!flowButtons) {
                    return
                }
                flowButtons[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
            })

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

.flow-buttons {
    display: flex;
    align-items: center;
    flex-flow: column;
    margin: 32px 0;
}
.flow-button {
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
    transition: $transitionDefault;
    .button {
        margin: 8px;
        svg {
            scale: 1.6;
            translate: 0 2px;
        }
    }
}

.page {
    &.__isEdit {
        .block-edit-footer {
            .button {
                translate: 0 -8px;
                transition: $transitionDefault;
                &:nth-child(2) {
                    transition-delay: 0.04s;
                }
                &:nth-child(3) {
                    transition-delay: 0.08s;
                }
            }
        }   
        
        .block-container {
            &:hover {
                .block-edit-footer {
                    .button {
                        translate: 0 0px;
                    }
                }
            }
        }
    }
}
</style>