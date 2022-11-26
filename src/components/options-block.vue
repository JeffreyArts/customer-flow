    <template>
    <div class="option-block-container" :class="[type == 'add' ? '__isEdit' : '']">
        <!-- Add option block -->
        <div class="option-block-add" v-if="type == 'add'" :class="{ '__isRight': modelValue.position == 'userB' }">
            <form class="option-block-buttons" @submit="addOption">
                <span class="option-button" 
                        :class="[selectedOption == index ? '__isSelected' : '__notSelected']"
                        v-for="(option, index) in modelValue.options" 
                        :key="index" 
                        @click="selectOption(index)">
                    {{option.name}}
                </span>

                <div class="new-option-container"  v-if="modelValue.options.length < 6">
                    <input type="text" class="option-button" ref="newOption" v-model="newOption">
                    <button class="option-button" @click="addOption">
                        <Icon icon="material-symbols:add-rounded" />
                    </button>
                </div>
            </form>

            <div class="option-block-button-option-buttons-container">
                <div>
                    <toggle :options="[{
                        id:'userA',
                        name: options.userA,
                        selected: modelValue.position == 'userB',
                        bgcolor: '#f6b0c1',
                    }, {
                        id:'userB',
                        name: options.userB,
                        selected: modelValue.position == 'userB',
                        bgcolor: '#4dbb86',
                    }]" v-model="modelValue.position" />
                </div>
                <!-- {{selectedSchemeItem}} -->
                <div class="option-block-option-buttons" v-if="selectedOption < 777">
                    <button class="button ghost small" v-if="selectedSchemeItem" @click="removeSchemeItem">Annuleren</button>
                    <button class="button ghost small c-blue" @click="updateSchemeItem">Opslaan</button>
                    <button class="button ghost small c-red" @click="removeOption">Verwijderen</button>
                </div>
            </div>
            <div class="option-block-row" v-if="selectedOption < 777">
                Optie type
                <select class="input" @change="changeBlock" v-model="optionBlock">
                    <option value="communication">Communicatie blok</option>
                    <option value="info">Info blok</option>
                </select>
            </div>
            
            <div class="option-block-row">
                <textarea rows="3" class="input" v-model="tempContentValue" v-if="selectedOption < 777 && optionBlock" />
            </div>

            <div class="option-block-buttons">
                
                <button class="button ghost">Annuleren</button>
                <button class="button c-blue" @click="addOptionsBlock">Optie toevoegen</button>
            </div>
        </div>
        
        <!-- View option block -->
        <div class="option-block-view" v-if="type == 'view'" :class="{ '__isRight': modelValue.position == 'userB' }">
            <form class="option-block-buttons" @submit="addOption">
                <span class="option-button" 
                        :class="[selectedOption == index ? '__isSelected' : '__notSelected']"
                        v-for="(option, index) in modelValue.options" 
                        :key="index" 
                        @click="selectOption(index)">
                    {{option.name}}
                </span>
            </form>
        </div>
        
        <!-- Edit option block -->
        <div class="option-block-edit" v-if="type == 'edit'">
            <div class="option-block-view" :class="{ '__isRight': modelValue.position == 'userB' }">
                <section class="speech-bubble" :class="{ '__isRight': modelValue.position == 'userB' }">
                    {{modelValue.content}}
                </section>
            </div>
            
            <section class="option-block-add-section-container">
                <toggle :options="[{
                    id:'userA',
                    name: options.userA,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#f6b0c1',
                }, {
                    id:'userB',
                    name: options.userB,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#4dbb86',
                }]" v-model="modelValue.position" />
                
                <textarea class="input" id="" rows="4" v-model="modelValue.content" />
            </section>
            
            <footer class="option-block-add-footer-container">
                <button class="button ghost small" @click="cancelEdit">Annuleren</button>
                <button class="button c-blue small" @click="submitSuccess(modelValue)">Wijziging opslaan</button>
            </footer>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import { flowSchemeOption, flowSchemeCommunication, flowSchemeInfo } from "../../types";
import Toggle from "../components/toggle.vue"
import Flow from "../stores/flow";
import { Icon } from '@iconify/vue';
import _ from "lodash"

export default defineComponent({
    name: "option-block",
    props: {
        modelValue: {
            type: Object as PropType<flowSchemeOption>,
            required: true
        },
        type: {
            type: String, // edit | add | view
            required: true
        },
        options: {
            type: Object,
            required: false
        },
        cancel: {
            type: Function,
            required: false
        },
        success: {
            type: Function,
            required: false
        },
    },
    setup() {
        const flow = Flow()
        return {
            flow,
        }
    },
    data: () => {
        return {
            newOption: "",
            selectedOption: 777,
            original: {},
            optionBlock: null as null | "communication" | "info",
            optionsConfirmed: [] as Array<string>,
            tempContentValue: "",
        }
    },
    components: {
        Toggle, Icon
    },
    mounted() {
        this.original = _.cloneDeep(this.modelValue)
        if (this.type == 'add') {
            let input = this.$refs['newOption'] as HTMLInputElement;
            if (input) {
                input.focus();
            }
        }
    },
    computed: {
        selectedSchemeItem(): undefined | flowSchemeCommunication | flowSchemeInfo {
            if (this.modelValue.options[this.selectedOption]?.schemeId) {
                return this.flow.getSchemeItem(this.modelValue.options[this.selectedOption].schemeId) as flowSchemeCommunication | flowSchemeInfo
            }
            return undefined
        }
    },
    unmounted() {
        
    },
    methods: {
        addOption(event: Event) {
            event.preventDefault();
            if (!this.newOption) {
                this.selectedOption = 777;
                return
            }
            this.modelValue.options.push({
                name: this.newOption,
                schemeId: undefined
            })
            this.$emit('update:modelValue', this.original)
            
            let input = this.$refs['newOption'] as HTMLInputElement;
            if (input) {
                input.focus();
            }

            this.newOption = "";
        },
        removeSchemeItem() {
            if (this.modelValue.options[this.selectedOption]?.schemeId) {
                this.flow.removeSchemeItem(this.modelValue.options[this.selectedOption].schemeId)
            }
            this.modelValue.options[this.selectedOption].schemeId = undefined;
            this.optionBlock = null
        },
        removeOption() {
            // remove option from options where this.selectedOption is the index
            this.modelValue.options.splice(this.selectedOption, 1)
            this.selectedOption = 777
            this.flow.update()
        },
        updateSchemeItem() {
            if (this.selectedSchemeItem) {
                this.selectedSchemeItem.content = this.tempContentValue
                this.flow.update()
            }
            this.selectedOption = 777
        },
        selectOption(index:number) {
            this.selectedOption = index;
            this.optionBlock = null;
            
            if (this.modelValue.options[index]?.schemeId) {
                let schemeItem = this.flow.getSchemeItem(this.modelValue.options[index].schemeId)

                if (schemeItem) {
                    this.optionBlock = schemeItem.type
                    this.tempContentValue = schemeItem.content
                }
            } else {
                this.tempContentValue = ""
            }

            if (this.type == 'view') {
                this.flow.selectOption({
                    schemeId: this.modelValue.schemeId,
                    optionId: this.modelValue.options[index].schemeId
                })
            }
        },
        addOptionsBlock() {
            this.original = _.cloneDeep(this.modelValue)

            if (this.success) {
                this.success(this.modelValue)
            }
        },
        // confirmAddedOption() {
        //     this.optionsConfirmed[this.selectedOption] = true
        // },
        async changeBlock(event: Event) {
            if (this.optionBlock) {
                if (this.modelValue.options[this.selectedOption].schemeId) {
                    await this.flow.removeSchemeItem(this.modelValue.options[this.selectedOption].schemeId)
                    this.modelValue.options[this.selectedOption].schemeId = undefined
                }
                
                this.flow.addSchemeItem(this.optionBlock, this.modelValue.id, {
                    // success: this.confirmAddedOption
                }).then(schemeItem => {
                    this.modelValue.options[this.selectedOption].schemeId = schemeItem.id
                })
            }

        },
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.option-block-container {
    width: 100%;
    display: block;
    margin-bottom: 32px;
}

.option-block-buttons {
    display: flex;
    flex-direction: row;
    flex-flow:wrap;
    width: 50%;
    margin-bottom: 16px;
    gap: 8px;
    transition: $transitionDefault;
    justify-content: flex-start;
}

.option-block-add {
    display: flex;
    flex-flow: wrap;
    
    &.__isRight {
        .option-block-buttons {
            justify-content: flex-end;
            translate: 100% 0;
        }
    }
}

.option-button {
    height: 48px;
    display: flex;
    align-items: center;
    border: 1px solid $grey;
    color: $black;
    background-color: #fff;
    font-size: 16px;
    padding: 0 16px;
    border-radius: 16px;
    // margin-bottom: 8px;

    &:focus {
        outline: none;
        border-color: $primaryColor;
        color: $blue;
    }

    &.__notSelected {
        color: $blue;
        background-color: $light-grey;
        border-color: $blue;
        padding: 0 24px;
    }
    &.__isSelected {
        color: $white;
        background-color: $blue;
        border-color: $blue;
        padding: 0 24px;
        &:hover {
            color: $white;
        }
    }

    svg {
        display: inline-block;
        scale: 1.6;
    }
}

.option-block-row {
    width: 100%;
    margin-bottom: 16px;
    textarea {
        width: 100%;
    }
}

.new-option-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex-flow:nowrap;
}

.option-block-button-option-buttons-container { 
    display: flex;
    flex-flow: wrap;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 16px;
}
button.option-button {
    &:hover {
        color: $blue;
        border-color: $blue;
    }
    // margin-left: 8px;
}

.option-block-option-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

</style>
