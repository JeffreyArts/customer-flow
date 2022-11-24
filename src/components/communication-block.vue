<template>
    <div class="communication-block-container">
        
        <!-- Add communication block -->
        <div class="communication-block-add" v-if="type == 'add'">
            <header class="communication-block-add-header-container">
                <h2 class="communication-block-add-header-title">Communicatie block toevoegen</h2>
                <span class="communication-block-add-header-cancel" @click="cancel()">annuleren</span>
            </header>
            
            <section class="communication-block-add-section-container">
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
            
            <footer class="communication-block-add-footer-container">
                <button class="button c-blue" @click="success()">Toevoegen</button>
            </footer>
        </div>
        
        <!-- View communication block -->
        <div class="communication-block-view" v-if="type == 'view'" :class="{ '__isRight': modelValue.position == 'userB' }">
            <section class="speech-bubble" :class="{ '__isRight': modelValue.position == 'userB' }">
                {{modelValue.content}}
            </section>
        </div>
        
        <!-- Edit communication block -->
        <div class="communication-block-edit" v-if="type == 'edit'">
            <div class="communication-block-view" :class="{ '__isRight': modelValue.position == 'userB' }">
                <section class="speech-bubble" :class="{ '__isRight': modelValue.position == 'userB' }">
                    {{modelValue.content}}
                </section>
            </div>
            
            <section class="communication-block-add-section-container">
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
            
            <footer class="communication-block-add-footer-container">
                <button class="button ghost small" @click="cancelEdit()">Annuleren</button>
                <button class="button c-blue small" @click="success()">Toevoegen</button>
            </footer>
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
    },
    unmounted() {
        
    },
    methods: {
        cancelEdit() {
            this.$emit('update:modelValue', this.original)
            // this.$emit('update:type', 'view')
            if (this.cancel) {
                this.cancel()
            }
        },
        updateEdit() {
            this.$emit('update:type', 'view')
            if (this.success) {
                this.success()
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

.communication-block-add-header-container {
    // margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.communication-block-add-header-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 32px;
}

.communication-block-add-header-cancel {
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

.communication-block-add-section-container {
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

.communication-block-add-footer-container {
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




.communication-block-view {
    display: flex;
    transition: $transitionDefault;
    
    &.__isRight {
        justify-content: flex-end;
    }
    
    > .speech-bubble {
        transition: $transitionDefault;
        width: calc(50% - 32px);
        &.__isRight {
            float: right;
        }
    }

    + .communication-block-add-section-container {
        margin-top: 16px;
    }
}
</style>
