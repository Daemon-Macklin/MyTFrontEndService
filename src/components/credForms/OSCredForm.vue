<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">Openstack Credentials</div>
            <div class="meta"> Save credentials for your Openstack</div>
            <div class="ui form">
                <div class="fields">
                    <div class="field">
                        <label>Name</label>
                        <input v-model="name" type="text">
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input v-model="password" type="password">
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label>OS Username</label>
                        <input v-model="osUsername" type="text">
                    </div>
                    <div class="field">
                        <label>OS Password</label>
                        <input v-model="osPassword" type="password">
                    </div>
                </div>
                <div class="field">
                    <label>Auth Url</label>
                    <input v-model="authUrl" type="text">
                </div>
                <div class="ui basic green button" v-on:click="createCreds">Add</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import VueForm from 'vue-form'
    import mytservice from "../../services/mytservice";

    Vue.use(VueForm)

    export default {
        name: "OSCredForm",
        props: {
            user: Object
        },
        data(){
            return {
                name: null,
                password: null,
                osUsername: null,
                osPassword: null,
                authUrl: null,
            }
        },
        methods: {
            createCreds(){
                if(this.name === null || this.packageInput === null || this.osUsername === null || this.osPassword === null || this.audio === null){
                    this.flashMessage.error({title: 'Error', message: "All fields must be filled out"});
                } else {
                    let data = {
                        name : this.name,
                        password: this.password,
                        uid : this.user.uid,
                        osUsername: this.osUsername,
                        osPassword: this.osPassword,
                        authUrl: this.authUrl,
                    }
                    let token = this.$cookies.get("access_token")
                    mytservice.createOSCreds(data, token).then(
                        response => {
                            this.flashMessage.success({title: 'Credentials Created', message: "Don't worry, we have encrypted it for you"})
                            this.$parent.getCreds()
                            console.log(response)
                            this.clearFields()
                        }
                    ).catch(
                        error => {
                            console.log(error)
                            if (error.response.status === 401) {
                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                this.$parent.$parent.isSignedIn()
                            }
                            else if(error.response.status === 400){
                                this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                            }
                        }
                    )
                }
            },
            clearFields(){
                this.name = null
                this.password = null
                this.osUsername = null
                this.osPassword = null
                this.authUrl = null
            }
        }
    }
</script>

<style scoped>

</style>