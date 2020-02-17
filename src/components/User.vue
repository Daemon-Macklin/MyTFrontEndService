<template>
    <div id="section">
        <div v-if="signedIn === false" class="ui raised centered segment">
            Sign in form goes here
        </div>
        <div v-if="signedIn === true" class="ui raised centered segment">
                User data goes here
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Cookies from 'vue-cookies'

    Vue.use(Cookies)


    export default {
        name: "User",
        data () {
            return {
                signedIn: false,
                userName: null,
                email: null,
                id: null
            }
        }


    }
</script>

<style scoped>
    #section {
        margin-left: 10%;
        margin-right: 10%;
    }
</style>