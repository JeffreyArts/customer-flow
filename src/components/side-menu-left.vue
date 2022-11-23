<template>
    <aside class="side-menu-left"> 
        <router-link to="/test" class="flow-item">
            <i class="flow-item-icon"></i>
            <span class="flow-item-text">
                Klant belt Zomers
            </span>
        </router-link>
        <router-link to="/new-flow" class="flow-item">
            <Icon icon="line-md:plus" />
            <span class="flow-item-text">
                Voeg flow toe
            </span>
        </router-link>
    </aside>
</template>


<script lang="ts">
import { defineComponent } from "vue"
import { Icon } from '@iconify/vue';
import {useRoute} from "vue-router"

export default defineComponent({
    // type inference enabled
    name: "site-bg",
    data: () => {
        return {
            offset: 50,
            screenWidth:  0,
            screenHeight:  0
        }
    },
    components: {
        Icon
    },
    computed: {
    },
    mounted() {
        //
        window.addEventListener("resize",this.updateScreenSizes)
        window.dispatchEvent(new Event("resize"))
    },
    unmounted() {
        //
        window.removeEventListener("resize",this.updateScreenSizes)
    },
    methods: {
        updateScreenSizes() {
            this.screenWidth = window.innerWidth
            this.screenHeight = window.innerHeight
        }
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.side-menu-left {
    position: absolute;
    left: 30px;
    top: 30px;
}

.flow-item {
    text-decoration: none;
    color:$black;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    .flow-item-text {
        transition: $transitionDefault;
        opacity: 0;
    }
    
    > svg,
    > i {
        width: 40px;
        height: 40px;
        padding: 8px;
        background-color: $grey;
        border-radius:100%;
        margin-right: 16px;
        color: $white;
        
        &.flow-item-icon {
            background-color: $accentColor;
        }
        
        &:hover {
            + .flow-item-text {
                opacity: 1;
            }
        }
    }
}
</style>
