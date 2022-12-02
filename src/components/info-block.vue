<template>
    <div class="info-block-container">
        
        <!-- Add / edit info block -->
        <div class="info-block-edit" v-if="type == 'add' || type == 'edit'">
            <header class="info-block-edit-header-container" v-if="type == 'add'">
                <h2 class="info-block-edit-header-title">Info block toevoegen</h2>
                <span class="info-block-edit-header-cancel" @click="cancelEdit">annuleren</span>
            </header>
            <div class="info-block-view" 
                :class="{ '__isRight': modelValue.position == 'userB', '__isLeft': modelValue.position == 'userA' }"
                v-if="type == 'edit'">

                <section class="info-box">
                    {{modelValue.content}}
                </section>
            </div>
            
            
            <section class="info-block-edit-section-container">
                <toggle :options="[{
                    id:'userA',
                    name: options?.userA,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#f6b0c1',
                }, {
                    id:'both',
                    name: 'Beide',
                    selected: modelValue.position == 'both',
                    bgcolor: '#ccc',
                }, {
                    id:'userB',
                    name: options?.userB,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#4dbb86',
                }]" v-model="modelValue.position" />
                
                <textarea class="input" id="" rows="4" ref="editContent" v-model="modelValue.content" />
            </section>
            
            <footer class="info-block-edit-footer-container">
                <button class="button ghost small" v-if="type == 'edit'" @click="cancelEdit">Annuleren</button>
                <button class="button c-blue" @click="submitSuccess()">Toevoegen</button>
            </footer>
        </div>
        
        <!-- View info block -->
        <div class="info-block-view" v-if="type == 'view'" :class="{ '__isRight': modelValue.position == 'userB', '__isLeft': modelValue.position == 'userA' }">
            <section class="info-box">
                {{modelValue.content}}
            </section>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import { flowSchemeInfo } from "../../types";
import Toggle from "../components/toggle.vue"
import _ from "lodash"

export default defineComponent({
    name: "info-block",
    props: {
        modelValue: {
            type: Object as PropType<flowSchemeInfo>,
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
        if (this.type != 'view') {
            let input = this.$refs['editContent'] as HTMLTextAreaElement;
            if (input) {
                input.focus();
                input.scrollIntoView({ behavior: 'smooth', block: "center" });
            }
        }
    },
    unmounted() {
        
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

.info-block-container {
    width: 100%;
    display: block;
    margin-bottom: 32px;
}

.info-block-edit-header-container {
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.info-block-edit-header-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 32px;
}

.info-block-edit-header-cancel {
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

.info-block-edit-section-container {
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

.info-block-edit-footer-container {
    width: 100%;
    text-align: right;
    margin-top: 24px;
    button  {
        width: 20%;
        + button {
            margin-left: 16px;
        }
    }
}


.info-block-view {
    display: flex;
    transition: $transitionDefault;
    
    &.__isRight {
        > .info-box {
            transform: translateX(calc(100% + 64px));
        }
    }
    &.__isLeft {
        > .info-box {
            transform: translateX(0%);
        }
    }
    
    > .info-box {
        transition: $transitionDefault;
        width: calc(50% - 32px);
        margin-left: 0;
        transform: translateX(calc(50% + 32px));
    }

    + .info-block-edit-section-container {
        margin-top: 16px;
    }
}
</style>
