<template>
    <div class="container-center">
        <router-link to="/" class="close-page">
            <Icon icon="line-md:plus"/>
        </router-link>
        <div>
            <header class="page-header">
                <h1 class="page-title">Nieuwe flow toevoegen</h1>
            </header>
            
            <section class="page-content">
                <p class="new-flow-description">Door een nieuwe flow toe te voegen, kun je nieuwe interactie tussen klant en bedrijf ontwerpen. Binnen deze flow kun je contact momenten/acties specificeren om zo het proces inzichtelijk te maken, en waar nodig te optimaliseren</p>

                <form action="" @submit="addNewFlow">
                    <div class="new-flow-form">
                        <input v-model="userA" type="text" class="input large" placeholder="Gebruiker A">
                        <input v-model="interaction" type="text" class="input large" placeholder="belt">
                        <input v-model="userB" type="text" class="input large" placeholder="Gebruiker B">
                    </div>
                    <button type="submit" class="c-blue large">Voeg toe</button>
                </form>

            </section>

        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import Toggle from "../components/toggle.vue"
import { Icon } from '@iconify/vue';

export default defineComponent ({ 
    name: "homePage",
    components: {Toggle, Icon},
    props: [],
    setup() {
    
    },
    data() {
        return {
            userA: "",
            userB: "",
            interaction: "",
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        addNewFlow(event: Event) {
            event.preventDefault();

            console.log(this.userA, this.interaction, this.userB);
        }
    }
})

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
.page-title {
    font-weight: 400;
    font-size: 32px;
    color: #fff;
    background-color: $accentColor;
    border-radius: 8px;
    display: inline-block;
    padding: 16px 48px;
    margin: 0;
}
.container-center {
    width: 100%;
    display: flex;
    min-height:100%;
    align-items: center;
    justify-content: center;
}

.page-header {
    display: block;
    width: 100%;
    text-align: center;
}
.close-page {
    position: absolute;
    right: 30px;
    top: 30px;
    font-size: 48px;
    transform:rotate(45deg);
    color:$grey;
}
.new-flow-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 32px;
    input {
        width: calc(100% / 3 - 16px);
    }
    + button {
        float: right;
    }
}

.new-flow-description {
    text-align: center;
    width: 80%;
    margin: 48px auto;
}
</style>