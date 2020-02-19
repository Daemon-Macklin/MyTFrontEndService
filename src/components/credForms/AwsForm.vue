<template>
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">AWS Credentials</div>
                <div class="meta"> Create credentials for your AWS account</div>
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
                    <div class="field">
                        <label>Access Key</label>
                        <input v-model="accessKey" type="text">
                    </div>
                    <div class="field">
                        <label>Secret Key</label>
                        <input v-model="secretKey" type="text">
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
        name: "AwsForm",
        props: {
            user: Object
        },
        data() {
            return{
                secretKey: null,
                accessKey: null,
                password: null,
                name: null
            }
        },
        methods: {
        createCreds(){
            if(this.secretKey === null || this.accessKey === null || this.password === null || this.name === null){
                this.flashMessage.error({title: 'Error', message: "All fields must be filled out"});
            } else {
                let data = {
                    name : this.name,
                    password: this.password,
                    uid: this.user.uid,
                    accessKey: this.accessKey,
                    secretKey: this.secretKey
                }
                let token = this.$cookies.get("access_token")

                mytservice.createAWSCreds(data, token).then(
                    response => {
                        this.flashMessage.success({title: 'Credentials Created', message: "Don't worry, we have encrypted it for you"})
                        console.log(response)
                    }
                ).catch(
                    error => {
                        console.log(error)
                        if (error.response.status === 401) {
                            this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                            if(error.response.data.msg === "")
                                this.logout()
                        }
                        else if(error.response.status === 400){
                            this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                        }
                    }
                )
                console.log(data)
            }
        }
    }
    }
</script>

<style scoped>

</style>