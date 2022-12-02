<template>
    <div class="communication-block-container">
        
        <!-- Add / edit communication block -->
        <div class="communication-block-edit" v-if="type == 'add' || type=='edit'">
            <header class="communication-block-edit-header-container" v-if="type == 'add'">
                <h2 class="communication-block-edit-header-title">Communicatie block toevoegen</h2>
                <span class="communication-block-edit-header-cancel" @click="cancelEdit">annuleren</span>
            </header>
            
            <div class="communication-block-view" v-if="type == 'edit'" :class="{ '__isRight': modelValue.position == 'userB' }">
                <section class="speech-bubble" :class="{ '__isRight': modelValue.position == 'userB' }">
                    {{modelValue.content}}
                </section>
            </div>

            
            <section class="communication-block-edit-section-container">
                <toggle :options="[{
                    id:'userA',
                    name: options?.userA,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#f6b0c1',
                }, {
                    id:'userB',
                    name: options?.userB,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#4dbb86',
                }]" v-model="modelValue.position" />
                
                <textarea class="input" id="" rows="4" ref="editContent" v-on:keyup.enter="submitSuccess" v-model="modelValue.content" />
            </section>

            <footer class="communication-block-edit-footer-container">
                <button class="button ghost small" v-if="type == 'edit'" @click="cancelEdit">Annuleren</button>
                <button class="button c-blue small" @click="submitSuccess()">Wijziging opslaan</button>
            </footer>
        </div>
        
        <!-- View communication block -->
        <div class="communication-block-view" v-if="type == 'view'" :class="{ '__isRight': modelValue.position == 'userB' }">
            <section class="speech-bubble" :class="{ '__isRight': modelValue.position == 'userB' }">
                {{modelValue.content}}
            </section>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import { flowSchemeCommunication } from "../../types";
import Toggle from "../components/toggle.vue"
import _ from "lodash"

export default defineComponent({
    name: "communication-block",
    props: {
        modelValue: {
            type: Object as PropType<flowSchemeCommunication>,
            required: true
        },
        options: {
            type: Object,
            required: false
        },
        type: {
            type: String, // edit | add | view
            required: true
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
    watch: {
        type: {
            handler: function (val, oldVal) {
                if (this.type != 'view') {
                    setTimeout(() => {
                        let input = this.$refs['editContent'] as HTMLTextAreaElement;
                        if (input) {
                            input.focus();
                        }
                        input.scrollIntoView({ behavior: 'smooth', block: "center" });
                    })
                }
            },
        }
    },
    data: () => {
        return {
            original: {}
        }
    },
    components: {
        Toggle
    },
    mounted() {
        this.original = _.cloneDeep(this.modelValue)
        if (this.type == 'add' || this.type == 'edit') {
            let input = this.$refs['editContent'] as HTMLTextAreaElement;
            if (input) {
                input.focus();
            }
        }
    },
    methods: {
        cancelEdit() {
            this.modelValue.content = this.original.content
            this.$emit('update:modelValue', this.original)

            if (this.cancel) {
                this.cancel(this.modelValue)
            }
        },
        submitSuccess() {
            this.$emit('update:type', 'view')
            this.modelValue.content = this.modelValue.content.trim()
            this.original = _.cloneDeep(this.modelValue)

            if (this.success) {
                this.success(this.modelValue)
            }
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.communication-block-container {
    width: 100%;
    display: block;
    margin-bottom: 32px;
}

.communication-block-edit-header-container {
    // margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.communication-block-edit-header-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 32px;
}

.communication-block-edit-header-cancel {
    color: #777;
    font-size: 16px;
    transition: .16s all linear;
    border-bottom: 1px solid transparent;
    cursor: pointer;

    &:hover {
        border-bottom: 1px solid currentColor;
        color:$red;
    }
}

.communication-block-edit-section-container {
    border: 2px dashed $grey;
    border-radius:16px;
    width: 100%;
    padding: 32px;

    textarea {
        display: block;
        width: 100%;
        margin-top: 16px;
    }
}

.communication-block-edit-footer-container {
    width: 100%;
    text-align: right;
    margin-top: 24px;
    button  {
        width: 25%;
        + button {
            margin-left: 16px;
        }
    }
}




.communication-block-view {
    display: flex;
    transition: $transitionDefault;
    animation: slideInLeft .24s ease-in-out;
    
    &.__isRight {
        animation: slideInRight .24s ease-in-out;
        > .speech-bubble {
            transform: translateX(calc(100% + 64px));
        }
    }

    &.__isLeft {
        > .info-box {
            transform: translateX(0%);
        }
    }
    
    
    > .speech-bubble {
        transition: $transitionDefault;
        margin-left: 0;
        // transform: translateX(calc(50% + 32px));
        transform: translateX(0%);
        width: calc(50% - 32px);
    }

    + .communication-block-edit-section-container {
        margin-top: 16px;
    }
}


</style>
