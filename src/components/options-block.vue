    <template>
    <div class="option-block-container" :class="[type == 'add' ? '__isEdit' : '']">
        <!-- Add option block -->
        <div class="option-block-add" v-if="type == 'add' || type == 'edit'" :class="{ '__isRight': modelValue.position == 'userB' }">
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

                <div class="option-block-option-buttons" v-if="selectedOption >= 777">
                    <button class="button ghost small" @click="cancelChanges">Annuleren</button>
                    <button class="button ghost small c-blue" v-if="modelValue.options.length >=2" @click="addOptionsBlock">Opslaan</button>
                    <button class="button ghost small c-red" v-if="modelValue.editType == 'edit'" @click="removeOptionBlock">Verwijderen</button>
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

            <div class="option-block-buttons full-width" v-if="selectedOption < 777">
                
                <button class="button ghost" v-if="selectedSchemeItem" @click="cancelOptionChanges">Annuleren</button>
                <button class="button c-red" @click="removeOption">Keuze verwijderen</button>
                <button class="button c-blue" v-if="selectedSchemeItem" @click="updateSchemeItem">Keuze opslaan</button>
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
            originalOption: {} as flowSchemeCommunication | flowSchemeInfo,
            optionBlock: null as null | "options" | "communication" | "info",
            optionsConfirmed: [] as Array<string>,
            tempContentValue: "",
            existingChildren: [] as Array<flowSchemeCommunication | flowSchemeInfo>,
        }
    },
    watch: {
        type: {
            handler: function (newVal, oldVal) {
                
                if (oldVal == 'view' && newVal == 'edit') {
                    this.flow.selectedOptions = []
                }
            },
            deep: false
        },
        flow: {
            handler: function () {
                if (this.flow.selectedOptions.length == 0) {
                    this.selectedOption = 777
                }
            },
            deep: true
        },
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
        removeOptionBlock() {
            // remove option from options where this.selectedOption is the index
            const promises = []
            this.modelValue.options.forEach((option, index) => {
                promises.push(this.flow.removeSchemeItem(option.schemeId))
            })
            promises.push(this.flow.removeSchemeItem(this.modelValue.id))
            this.selectedOption = 777

            Promise.all(promises).then(() => {
                this.flow.update()
            })
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
            if (this.selectedOption == index) {
                this.selectedOption = 777
                return
            }
            this.selectedOption = index;
            this.optionBlock = null;

            
            if (this.modelValue.options[index]?.schemeId) {
                let schemeItem = this.flow.getSchemeItem(this.modelValue.options[index].schemeId)
                
                if (schemeItem) {
                    this.originalOption = schemeItem
                    this.optionBlock = schemeItem.type
                    this.tempContentValue = schemeItem.content
                }
            } else {
                this.tempContentValue = ""
            }
            
            if (this.type == 'view') {
                this.flow.selectOption({
                    schemeId: this.modelValue.id,
                    optionId: this.modelValue.options[index].schemeId
                })
            }
        },
        cancelOptionChanges() {
            this.selectedSchemeItem.content = this.originalOption.content
            this.selectedOption = 777
        },
        addOptionsBlock() {
            if (this.success) {
                this.success(this.modelValue)
            }
        },
        cancelChanges() {
            if (this.modelValue.editType == 'add') {
                this.removeOptionBlock();
                return
            }
            
            alert("Deze optie werkt nog niet, maar moet nog wel gemaakt worden")
            this.modelValue.editType = 'view'
        },
        async changeBlock(event: Event) {
            if (this.optionBlock) {
                if (this.modelValue.options[this.selectedOption].schemeId) {
                    await this.flow.removeSchemeItem(this.modelValue.options[this.selectedOption].schemeId)
                    this.modelValue.options[this.selectedOption].schemeId = undefined
                }
                
                this.flow.addSchemeItem(this.optionBlock, this.modelValue.id, {
                    editType: 'view',
                    position: this.modelValue.position
                }).then(schemeItem => {
                    this.modelValue.options[this.selectedOption].schemeId = schemeItem.id
                    this.flow.update()
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
    &.full-width {
        width: 100%;
        justify-content: flex-end;
    }
}

.option-block-add,
.option-block-view {
    display: flex;
    flex-flow: wrap;
    
    &.__isRight {
        .option-block-buttons {
            justify-content: flex-end;
            translate: 100% 0;
            &.full-width {
                translate: 0 0;
            }
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
