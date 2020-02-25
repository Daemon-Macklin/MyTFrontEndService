<template>
    <div id="app">
        <div id="section" class="ui tertiary raised centered segment">
        <b-navbar type="dark" variant="dark">
            <b-navbar-nav>
            <b-nav-item v-on:click="showSelection('platform')"> Platforms </b-nav-item>
            <b-nav-item v-on:click="showSelection('space')"> Spaces </b-nav-item>
            <b-nav-item v-on:click="showSelection('credentials')"> Credentials </b-nav-item>
            <b-nav-item v-on:click="showSelection('user')"> User </b-nav-item>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            </b-navbar-nav>
        </b-navbar>
        <br>
            <Platform v-bind:user="user" v-if="show==='platform'"/>
            <Space v-bind:user="user" v-if="show==='space'"/>
            <Credentials v-bind:user="user" v-if="show==='credentials'"/>
            <User v-bind:user="user" v-if="show==='user'"/>
        </div>
    </div>
</template>

<script>
    import Platform from "./Platform";
    import Space from "./Space";
    import User from "./User";
    import Credentials from "./Credentials";
    export default {
        name: "Management",
        components: {Platform, Space, User, Credentials},
        data() {
            return {
                show: "platform",
                user: {
                    username: null,
                    email: null,
                    uid: null
                }
            }
        },
        created() {
            this.getUserData()
        },
        methods: {
            showSelection(page){
                this.show = page
            },
            getUserData() {
                this.user.username = this.$cookies.get('username')
                this.user.email = this.$cookies.get('email')
                this.user.uid = this.$cookies.get('uid')
            }
        }
    }
</script>

<style scoped>
    #section {
        margin-left: 5%;
        margin-right: 5%;
    }
</style>