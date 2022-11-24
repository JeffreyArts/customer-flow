<template>
    <figure class="generated-image">
        <span>
            {{code[0]}}
        </span>
        <span>
            {{code[1]}}
        </span>
        <span>
            {{code[2]}}
        </span>
    </figure>
</template>


<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: "generated-image",
    props: {
        seed: {
            type: String,
            required: true
        }
    },
    data: () => {
        return {
            code: ""
        }
    },
    components: {
        
    },
    mounted() {
        this.code = this.seed.toUpperCase()
    },
    unmounted() {
        
    },
    methods: {
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.generated-image {
    display: inline-block;
    margin: 0;
    padding: 0;

    span {
        font-style: normal;
        font-size: 36px;
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 40px;
        text-align: center;
    }
}
</style>
