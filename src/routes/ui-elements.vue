<template>
    <div class="" >
        <br/><br/>
        <button class="button large ghost ">{{buttonText}}</button> &nbsp; <button class="button large ">{{buttonText}}</button> &nbsp; <br/><br/>
        <button class="button ghost ">{{buttonText}}</button> &nbsp; <button class="button ">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button small ghost ">{{buttonText}}</button> &nbsp; <button class="button small ">{{buttonText}}</button>
        <br/><br/><br/><br/>
        
        <button class="button large ghost c-blue">{{buttonText}}</button> &nbsp; <button class="button large c-blue">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button ghost c-blue">{{buttonText}}</button> &nbsp; <button class="button c-blue">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button small ghost c-blue">{{buttonText}}</button> &nbsp; <button class="button small c-blue">{{buttonText}}</button><br/><br/>
        <br/><br/>
        <button class="button large ghost c-accent">{{buttonText}}</button> &nbsp; <button class="button large c-accent">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button ghost c-accent">{{buttonText}}</button> &nbsp; <button class="button c-accent">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button small ghost c-accent">{{buttonText}}</button> &nbsp; <button class="button small c-accent">{{buttonText}}</button><br/><br/>
        <br/><br/><br/><br/>
        <button class="button large ghost c-red">{{buttonText}}</button> &nbsp; <button class="button large c-red">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button ghost c-red">{{buttonText}}</button> &nbsp; <button class="button c-red">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button small ghost c-red">{{buttonText}}</button> &nbsp; <button class="button small c-red">{{buttonText}}</button> &nbsp;<br/><br/>
        <br/><br/><br/><br/>
        <button class="button large ghost c-green">{{buttonText}}</button> &nbsp; <button class="button large c-green">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button ghost c-green">{{buttonText}}</button> &nbsp; <button class="button c-green">{{buttonText}}</button> &nbsp;<br/><br/>
        <button class="button small ghost c-green">{{buttonText}}</button> &nbsp; <button class="button small c-green">{{buttonText}}</button> &nbsp;<br/><br/>
        <br/><br/>
        
        <toggle :options="[{
            id:'userA',
            name: 'Klant',
            selected: false,
            bgcolor: '#09f',
            color: '#fff',
        }, {
            id:'userB',
            name: 'Zomers',
            selected: true,
            color: '#fff',
            bgcolor: '#f09',
        }]" v-model="buttonText" />
        &nbsp;
        <toggle :options="[{
            id:'123',
            name: '👁️',
            selected: false,
            bgcolor: '#fff',
        }, {
            id:'asdf',
            name: '🖊️',
            selected: true,
            bgcolor: '#fff',
        }]" v-model="buttonText" />

        <br/><br/>


        <input type="text" placeholder="test" class="input"> &nbsp;
        <input type="text" placeholder="test" class="input large">
        <br/><br/>
        <textarea name="" id="" cols="30" rows="10" class="input"></textarea>
        <br/><br/>
        
        
        <select name="" class="input" id="">
            <option value="">Test</option>
            <option value="">Test 2</option>
        </select>
        
        <br/><br/>
        <div class="speech-bubble">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia maxime magni officia velit ratione similique assumenda excepturi, rerum quam quod eveniet, neque, eum in. Est vitae voluptatem incidunt eveniet provident!
        </div>
        <br/><br/>
        <div class="speech-bubble __isRight">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia maxime magni officia velit ratione similique assumenda excepturi, rerum quam quod eveniet, neque, eum in. Est vitae voluptatem incidunt eveniet provident!
        </div>
        <br/><br/>
        <div class="info-box">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quia maxime magni officia velit ratione similique assumenda excepturi, rerum quam quod eveniet, neque, eum in. Est vitae voluptatem incidunt eveniet provident!
        </div>
    </div>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import Toggle from "../components/toggle.vue"

export default defineComponent ({ 
    name: "homePage",
    components: {Toggle},
    props: [],
    setup() {
    
    },
    data() {
        return {
            test: {
                id:'aan',
                name: 'Aan',
                bgcolor: '#f09',
            },
            test2: {
                id:'aan',
                name: 'Aan',
                bgcolor: '#fff',
            },
            buttonText: "undefined"
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
    
    }
})

</script>

<style lang="scss">
@import "./../assets/scss/variables.scss";
</style>