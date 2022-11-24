<template>
    <div class="info-block-container">
        
        <!-- Add info block -->
        <div class="info-block-add" v-if="type == 'add'">
            <header class="info-block-add-header-container">
                <h2 class="info-block-add-header-title">Info block toevoegen</h2>
                <span class="info-block-add-header-cancel" @click="cancelEdit()">annuleren</span>
            </header>
            
            <section class="info-block-add-section-container">
                <toggle :options="[{
                    id:'userA',
                    name: options.userA,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#f6b0c1',
                }, {
                    id:'universal',
                    name: 'Universeel',
                    selected: modelValue.position == 'universal',
                    bgcolor: '#ccc',
                }, {
                    id:'userB',
                    name: options.userB,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#4dbb86',
                }]" v-model="modelValue.position" />
                
                <textarea class="input" id="" rows="4" v-model="modelValue.content" />
            </section>
            
            <footer class="info-block-add-footer-container">
                <button class="button c-blue" @click="submitSuccess()">Toevoegen</button>
            </footer>
        </div>
        
        <!-- View info block -->
        <div class="info-block-view" v-if="type == 'view'" :class="{ '__isRight': modelValue.position == 'userB' }">
            <section class="info-box" :class="{ '__isRight': modelValue.position == 'userB' }">
                {{modelValue.content}}
            </section>
        </div>
        
        <!-- Edit info block -->
        <div class="info-block-edit" v-if="type == 'edit'">
            <div class="info-block-view" :class="{ '__isRight': modelValue.position == 'userB', '__isLeft': modelValue.position == 'userA' }">
                <section class="info-box">
                    {{modelValue.content}}
                </section>
            </div>
            
            <section class="info-block-add-section-container">
                <toggle :options="[{
                    id:'userA',
                    name: options.userA,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#f6b0c1',
                }, {
                    id:'universal',
                    name: 'Universeel',
                    selected: modelValue.position == 'universal',
                    bgcolor: '#ccc',
                }, {
                    id:'userB',
                    name: options.userB,
                    selected: modelValue.position == 'userB',
                    bgcolor: '#4dbb86',
                }]" v-model="modelValue.position" />
                
                <textarea class="input" id="" rows="4" v-model="modelValue.content" />
            </section>
            
            <footer class="info-block-add-footer-container">
                <button class="button ghost small" @click="cancelEdit()">Annuleren</button>
                <button class="button c-blue small" @click="submitSuccess()">Toevoegen</button>
            </footer>
        </div>
        
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType } from "vue"
import { flowSchemeinfo } from "../../types";
import Toggle from "../components/toggle.vue"
import _ from "lodash"

export default defineComponent({
    name: "info-block",
    props: {
        modelValue: {
            type: Object as PropType<flowSchemeinfo>,
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
            this.$emit('update:type', 'view')
            if (this.cancel) {
                this.cancel(this.modelValue)
            }
        },
        submitSuccess() {
            this.$emit('update:type', 'view')
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

.info-block-add-header-container {
    // margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.info-block-add-header-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0 32px;
}

.info-block-add-header-cancel {
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

.info-block-add-section-container {
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

.info-block-add-footer-container {
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

    + .info-block-add-section-container {
        margin-top: 16px;
    }
}
</style>
