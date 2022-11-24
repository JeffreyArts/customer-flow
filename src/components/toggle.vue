<template>
    <span class="toggle"> 
        <label class="toggle-option" :class="modelValue == option.id ? '__isActive' : ''" v-for="option in options" :key="option.id" :ref="option.name">
            <input type="text" :value="option" @focus="changeValue(option)"/>
            {{option.name}}
        </label>
        <!-- <input :value="modelValue" @input="changeValue"/> -->
        <div class="toggle-button" :style="`width: ${buttonWidth}px; left: ${buttonOffsetLeft}px; background-color: ${buttonBgColor};`"></div>
    </span>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { ToggleOptions } from "./../../types"

export default defineComponent({
    // type inference enabled
    props: {
        options: {
            type: Array as () => ToggleOptions[],
            required: true
        },
        modelValue: {
            type: String,
            required: true
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            id: "",
            name: "asdf",
            color: "#fff",
            buttonWidth: 0,
            buttonBgColor: "#fff",
            buttonOffsetLeft: 0,
        }
    },
    mounted() {
        let data = null as null | ToggleOptions

        if (!this.options) {
            console.error("Missing required parameter: options")
        }

        this.options.forEach((option: ToggleOptions) => {
            if (option.selected) {
                data = option
                this.$emit('update:modelValue', option.id)
            }
        })

        if (!data) {
            data = this.options[0]
        }

        setTimeout(() => {
            this.changeValue(data)
        })
    },
    unmounted() {
    },
    methods: {
        changeValue(data: ToggleOptions) {
            // let data = null
            // set alhpha from this.options where modelValue == id


            if (data && this.$refs[data.name]) {
                let domElement = this.$refs[data.name][0]
                this.buttonOffsetLeft = domElement.offsetLeft - 12;
                this.buttonWidth = domElement.offsetWidth + 12*2
                
                if (data.bgcolor) {
                    this.buttonBgColor = data.bgcolor
                }
            }
            // this.modelValue.set(data.id) 
            this.$emit('update:modelValue', data.id)
            
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
 
.toggle {
    background-color: transparent;
    border: 1px solid $grey;
    border-radius: 32px;
    background-color: $light-grey;
    height: 36px;
    display: inline-block;
    align-items: center;
    padding: 0;
    position: relative;
}

.toggle-button {
    height: calc(100%);
    border-radius: 34px;
    background-color: #fff;
    position: absolute;
    top: 0;
    right: 1px;
    transition: $transitionDefault;
}

.toggle-option {
    position: relative;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    margin-right: 12px;
    margin-left: 12px;
    transition: $transitionDefault;
    opacity: 0.2;

    input {
        width: 0;
        padding: 0;
        border:0 none transparent;
        height: 0;
        position: absolute;
        outline: 0 none transparent;
    }
    &.__isActive {
        color: #fff;
        opacity: 1;
    }
}
</style>
