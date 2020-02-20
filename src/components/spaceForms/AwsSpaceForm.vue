<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">AWS Space</div>
            <div class="meta"> Create a Space on your AWS account</div>
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
                <select class="form-control" @change="changeCred($event)">
                    <option value="" selected disabled>Credentials</option>
                    <option v-for="cred in this.creds" :value="cred.id" :key="cred.id">{{ cred.name }} ({{cred.id}})</option>
                </select>
                <br><br>
                <div class="ui basic green button" v-on:click="createSpace">Add</div>
            </div>
        </div>
    </div>
</template>

<script>
    import mytservice from "../../services/mytservice";

    export default {
        name: "AwsForm",
        props: {
            user: Object
        },
        created() {
            this.getCreds()
        },
        data(){
            return {
                creds: [],
                name: null,
                password: null,
                selectedCred: null
            }
        },
        methods: {
            createSpace(){
                if (this.name == null || this.password == null || this.selectedCred == null){
                    this.flashMessage.error({title: 'Error', message: "All Fields must be filled"});
                } else {
                    let data = {
                        "uid" : this.user.uid,
                        "cid" : this.selectedCred,
                        "password" : this.password,
                        "cloudService" : "aws",
                        "spaceName" : this.name
                    }
                    let token = this.$cookies.get("access_token")
                    mytservice.createSpace(data, token).then(
                        response => {
                            console.log(response)
                            this.flashMessage.success({title: 'Space Has been created', message: 'You can deploy platforms now!'})
                            this.$parent.getSpaces()
                        }
                    ).catch(
                        error => {
                            console.log(error)
                            if (error.response.status === 401) {
                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                this.$parent.$parent.$parent.isSignedIn()
                            }
                            else if(error.response.status === 400){
                                this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                            }
                        }
                    )
                }
            },
            getCreds(){
                let token = this.$cookies.get("access_token")
                mytservice.getCreds(this.user.uid, token).then(
                    response => {
                        let creds = []
                        for (let key in response.data.creds) {
                            if(response.data.creds[key].type === "aws"){
                                creds.push(response.data.creds[key])
                            }
                        }
                        this.creds = creds
                    }
                ).catch(
                    error => {
                        if(error.response.data.msg === "Token has expired"){
                            this.flashMessage.error({title: 'Auth Error', message: "Token Has Expired"})
                            this.$parent.$parent.isSignedIn()
                        } else
                            this.flashMessage.error({title: 'Error', message: "Error Getting Spaces"});
                    }
                )
            },
            changeCred (event) {
                let selectedCredText = event.target.options[event.target.options.selectedIndex].text
                this.selectedCred = selectedCredText.match(/\(([^)]+)\)/)[1]
            },
        },
    }
</script>

<style scoped>

</style>