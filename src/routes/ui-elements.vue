<template>
    <div class="" >
        <br/><br/>
        <button class="large ghost ">{{test.name}}</button> &nbsp; <button class="large ">{{test.name}}</button> &nbsp; <br/><br/>
        <button class="ghost ">{{test.name}}</button> &nbsp; <button class="">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="small ghost ">{{test.name}}</button> &nbsp; <button class="small ">{{test.name}}</button>
        <br/><br/><br/><br/>
        
        <button class="large ghost c-blue">{{test.name}}</button> &nbsp; <button class="large c-blue">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="ghost c-blue">{{test.name}}</button> &nbsp; <button class="c-blue">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="small ghost c-blue">{{test.name}}</button> &nbsp; <button class="small c-blue">{{test.name}}</button><br/><br/>
        <br/><br/>
        <button class="large ghost c-accent">{{test.name}}</button> &nbsp; <button class="large c-accent">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="ghost c-accent">{{test.name}}</button> &nbsp; <button class="c-accent">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="small ghost c-accent">{{test.name}}</button> &nbsp; <button class="small c-accent">{{test.name}}</button><br/><br/>
        <br/><br/><br/><br/>
        <button class="large ghost c-red">{{test.name}}</button> &nbsp; <button class="large c-red">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="ghost c-red">{{test.name}}</button> &nbsp; <button class="c-red">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="small ghost c-red">{{test.name}}</button> &nbsp; <button class="small c-red">{{test.name}}</button> &nbsp;<br/><br/>
        <br/><br/><br/><br/>
        <button class="large ghost c-green">{{test.name}}</button> &nbsp; <button class="large c-green">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="ghost c-green">{{test.name}}</button> &nbsp; <button class="c-green">{{test.name}}</button> &nbsp;<br/><br/>
        <button class="small ghost c-green">{{test.name}}</button> &nbsp; <button class="small c-green">{{test.name}}</button> &nbsp;<br/><br/>
        <br/><br/>
        
        <toggle :options="[{
            id:'test',
            name: 'Klant',
            bgcolor: '#09f',
            color: '#fff',
        }, {
            id:'test2',
            name: 'Zomers',
            color: '#fff',
            bgcolor: '#f09',
        }]" :value="test" />
        
        <toggle :options="[{
            id:'123',
            name: '👁️',
            bgcolor: '#fff',
        }, {
            id:'asdf',
            name: '🖊️',
            bgcolor: '#fff',
        }]" :value="test2" />

        <br/><br/>


        <input type="text" placeholder="test" class="input">
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
            }
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