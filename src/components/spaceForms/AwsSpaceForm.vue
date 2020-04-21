<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">AWS Space</div>
            <div class="meta"> Create a Space on your AWS account</div>
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
                <div class="two wide fields">
                    <div class="field">
                        <label>Availability Zone</label>
                        <input v-model="availabilityZone" type="text">
                    </div>
                    <div class="field">
                        <label>Credentials</label>
                        <select class="form-control" @change="changeCred($event)">
                            <option value="" selected disabled>Credentials</option>
                            <option v-for="cred in this.awsCreds" :value="cred.id" :key="cred.id">{{ cred.name }} ({{cred.id}})</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui blue bottom attached button"  v-if="!loading" v-on:click="createSpace">Add</div>
        <div align="center" justify="center" v-if="loading">
            <RingLoader size="60px"></RingLoader>
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
            user: Object,
            awsCreds: Array
        },
        data(){
            return {
                name: null,
                password: null,
                availabilityZone: null,
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
                        "availability_zone" : this.availabilityZone,
                        "spaceName" : this.name
                    }
                    let token = this.$cookies.get("access_token")
                    this.flashMessage.info({title: 'Space deployment has started', message: "This could take a minute..."})
                    this.loading = true
                    mytservice.createAWSSpace(data, token).then(
                        response => {
                            console.log(response)
                            this.flashMessage.success({title: 'Space Has been created', message: 'You can deploy platforms now!'})
                            this.$parent.getSpaces()
                            this.loading=false
                            this.clearFields()
                        }
                    ).catch(
                        error => {
                            this.loading=false
                            console.log(error)
                            if (error.response.status === 401) {
                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                            }
                            else if(error.response.status === 400){
                                this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                            }
                        }
                    )
                }
            },
            changeCred (event) {
                let selectedCredText = event.target.options[event.target.options.selectedIndex].text
                this.selectedCred = selectedCredText.match(/\(([^)]+)\)/)[1]
            },
            clearFields() {
                this.name = null
                this.password = null
            }
        },
    }
</script>

<style scoped>

</style>