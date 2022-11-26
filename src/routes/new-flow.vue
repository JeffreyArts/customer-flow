<template>
    <div class="container-center">
        <router-link to="/" class="close-page">
            <Icon icon="line-md:plus"/>
        </router-link>
        <div class="container-center-container">
            <header class="page-header">
                <h1 class="page-title">Nieuwe flow toevoegen</h1>
            </header>
            
            <section class="page-content">
                <p class="new-flow-description">Door een nieuwe flow toe te voegen, kun je nieuwe interactie tussen klant en bedrijf ontwerpen. Binnen deze flow kun je contact momenten/acties specificeren om zo het proces inzichtelijk te maken, en waar nodig te optimaliseren</p>

                <form action="" @submit="addNewFlow">
                    <div class="new-flow-form">
                        <div class="new-flow-form-column">
                            <input v-model="userA.value" type="text" class="input large" placeholder="Gebruiker A">
                            <span class="new-flow-form-error" v-if="userA.error">{{userA.error}}</span>
                        </div>
                        <div class="new-flow-form-column">
                            <input v-model="interaction.value" type="text" class="input large" placeholder="belt">
                            <span class="new-flow-form-error" v-if="interaction.error">{{interaction.error}}</span>
                        </div>
                        <div class="new-flow-form-column">
                            <input v-model="userB.value" type="text" class="input large" placeholder="Gebruiker B">
                            <span class="new-flow-form-error" v-if="userB.error">{{userB.error}}</span>
                        </div>
                    </div>
                    <button type="submit" class="button c-blue large">Voeg toe</button>
                </form>

            </section>

        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import Toggle from "../components/toggle.vue"
import Flows from "../stores/flows";
import { Icon } from '@iconify/vue';

export default defineComponent ({ 
    name: "homePage",
    components: {Toggle, Icon},
    props: [],
    setup() {
        const flows = Flows()
        return {
            flows,
        }
    },
    data() {
        return {
            userA: {
                value: "Klant",
                error: ""
            },
            userB: {
                value: "Zomers",
                error: ""
            },
            interaction: {
                value: "mailt",
                error: ""
            },
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
        addNewFlow(event: Event) {
            event.preventDefault();
            this.userA.error = "";
            this.userB.error = "";
            this.interaction.error = "";

            if (!this.userA.value) {
                this.userA.error = "Vul hier een naam/doelgroep in van de klant";
            }
            if (!this.userB.value) {
                this.userB.error = "Vul hier de naam van de organisatie of medewerker in";
            }
            if (!this.interaction.value) {
                this.interaction.error = "Vul hier de interactie in (belt, mailt, etc.)";
            }

            if (this.userA.error || this.userB.error || this.interaction.error) {
                return
            }

            this.flows.add({
                _id: new Date().getTime().toString(16),
                userA: this.userA.value,
                userB: this.userB.value,
                interaction: this.interaction.value,
                scheme: []
            }).then(() => {
                this.$router.push({path: "/"});
            })
        }
    }
})

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";

.new-flow-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 32px;
    + button {
        float: right;
    }
}

.new-flow-form-column {
    max-width: calc(100% / 3 - 16px);
}

.new-flow-description {
    text-align: center;
    width: 80%;
    margin: 48px auto;
}
.new-flow-form-error {
    font-size: 12px;
    padding: 16px 32px;
    color: $red;
    display: block;
}
</style>