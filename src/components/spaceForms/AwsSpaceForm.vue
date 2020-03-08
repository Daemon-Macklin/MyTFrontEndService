<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">AWS Space</div>
            <div class="meta"> Create a Space on your AWS account</div>
            <div v-if="!loading" class="ui form">
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
            <div align="center" justify="center" v-if="loading">
                <RingLoader size="120px"></RingLoader>
            </div>
        </div>
    </div>
</template>

<script>
    import mytservice from "../../services/mytservice";
    import RingLoader from 'vue-spinner/src/RingLoader.vue'

    export default {
        name: "AwsForm",
        components: {
            RingLoader
        },
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
                selectedCred: null,
                loading: false,
                color: "red",
                size: "small"
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
                    this.flashMessage.info({title: 'Space deployment has started', message: "This could take a minute..."})
                    this.loading = true
                    mytservice.createSpace(data, token).then(
                        response => {
                            console.log(response)
                            this.flashMessage.success({title: 'Space Has been created', message: 'You can deploy platforms now!'})
                            this.$parent.getSpaces()
                            this.loading=false
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
                            this.loading=false
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
            clearFields() {
                this.selectedCred = null
                this.name = null
                this.password = null
            }
        },
    }
</script>

<style scoped>

</style>