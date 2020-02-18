<template>
    <div>
        <div>
        <b-navbar type="light" variant="info">
            <b-navbar-nav>
            <b-nav-item v-on:click="showSelection('platform')"> Platforms </b-nav-item>
            <b-nav-item v-on:click="showSelection('space')"> Spaces </b-nav-item>
            <b-nav-item v-on:click="showSelection('credentials')"> Credentials </b-nav-item>
            <b-nav-item v-on:click="showSelection('user')"> User </b-nav-item>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            </b-navbar-nav>
        </b-navbar>
        </div>
        <br>
        <div class="ui raised centered segment">
            <Platform v-if="show==='platform'"/>
            <Space v-if="show==='space'"/>
            <Credentials v-if="show==='credentials'"/>
            <User v-if="show==='user'"/>
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
        methods: {
            showSelection(page){
                this.show = page
            }
        }
    }
</script>

<style scoped>

</style>