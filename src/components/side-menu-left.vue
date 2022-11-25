<template>
    <aside class="side-menu-left"> 
        <router-link :to="`/flow/${flow._id}`" class="flow-item" v-for="flow in flowArray" :key="flow._id">
            <i class="flow-item-icon">
                <generated-image :seed="`${flow.userA[0]}${flow.interaction[0]}${flow.userB[0]}`"></generated-image>
            </i>
            
            <span class="flow-item-text">
                {{flow.userA}} {{flow.interaction}} {{flow.userB}}
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
import { flowObject } from "../../types";
import Flows from "../stores/flows";
import { defineComponent } from "vue"
import { Icon } from '@iconify/vue';
import GeneratedImage  from '../components/generated-image.vue';
import {useRoute} from "vue-router"

export default defineComponent({
    name: "side-menu-left",
    data: () => {
        return {
            flowArray: [] as Array<flowObject>
        }
    },
    components: {Icon, GeneratedImage},
    
    setup() {
        const flows = Flows()
        return {
            flows,
        }
    },
    created() {
        
    },
    mounted() {
        this.flows.getAll().then((flows) => {
            this.flowArray = this.flows.flows
        })
    },
    unmounted() {
        
    },
    methods: {
        
    }
})
</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.side-menu-left {
    position: absolute;
    left: 32px;
    top: 32px;
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
            position: relative;
        }
        
        &:hover {
            + .flow-item-text {
                opacity: 1;
            }
        }
    }
}
</style>
