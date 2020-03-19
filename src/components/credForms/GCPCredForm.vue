<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">Google Cloud Credentials</div>
            <div class="meta"> Save credentials for your GCP Account</div>
            <div class="ui form">
                <div class="two wide fields">
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
                    <label>Platform</label>
                    <input v-model="platform" type="text">
                </div>
                <div class="field">
                    <label> Service Account File </label>
                    <input type="file" id="embedpollfileinput" @change="fileEvent($event)"/>
                </div>
           </div>
        </div>
        <div class="ui blue bottom attached button" v-on:click="createCreds">Add</div>
    </div>
</template>

<script>
    import mytservice from "../../services/mytservice";

    export default {
        name: "GCPCredForm",
        props: {
          user: Object
        },
        data() {
            return {
                name: null,
                password: null,
                platform: null,
                account: null
            }
        },
        methods: {
            fileEvent(event) {
                this.account = event.target.files[0]
            },
            createCreds() {
                if(this.name === null || this.password === null || this.account === null || this.platform === null){
                    this.flashMessage.error({title: 'Error', message: "All fields must be filled out"});
                } else{
                    let formData = new FormData();

                    formData.append("name", this.name)
                    formData.append("password", this.password)
                    formData.append("platform", this.platform.toLowerCase())
                    formData.append("account", this.account)
                    formData.append("uid", this.user.uid)

                    let token = this.$cookies.get("access_token");

                    mytservice.createGCPCreds(formData, token).then(
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
                this.platform = null
                this.account = null
            }
        }
    }
</script>

<style scoped>

</style>