<template>
    <span class="toggle"> 
        <label class="toggle-option" :class="value.id == option.id ? '__isActive' : ''" v-for="option in options" :key="option.id" :ref="option.name">
            <input type="text" :value="option" @focus="changeValue(option)"/>
            {{option.name}}
        </label>
        <div class="toggle-button" :style="`width: ${buttonWidth}px; left: ${buttonOffsetLeft}px; background-color: ${buttonBgColor};`"></div>
    </span>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { ToggleOptions } from "./../../types"

export default defineComponent({
    // type inference enabled
    props: ['options', 'value'],
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
        this.changeValue(this.value)
    },
    unmounted() {
    },
    methods: {
        changeValue(data: ToggleOptions) {
            this.value.id = data.id
            this.value.name = data.name
            this.value.color = data.color

            if (this.$refs[data.name]) {
                let domElement = this.$refs[data.name][0]
                this.buttonOffsetLeft = domElement.offsetLeft - 7;
                this.buttonWidth = domElement.offsetWidth + 14
                this.buttonBgColor = data.bgcolor
            }
            console.log(this.buttonWidth)
            
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
 
.toggle {
    background-color: transparent;
    border: 0 none transparent;
    border-radius: 32px;
    background-color: $light-grey;
    height: 36px;
    display: inline-block;
    align-items: center;
    padding: 0;
    position: relative;
}

.toggle-button {
    height: calc(100% - 2px);
    border-radius: 34px;
    background-color: #fff;
    position: absolute;
    top: 1px;
    right: 1px;
    transition: $transitionDefault;
}

.toggle-option {
    position: relative;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
    transition: $transitionDefault;
    opacity: 0.2;

    input {
        width: 0;
        padding: 0;
        border:0 none transparent;
        height: 0;
        outline: 0 none transparent;
    }
    &.__isActive {
        color: #fff;
        opacity: 1;
    }
}
</style>
