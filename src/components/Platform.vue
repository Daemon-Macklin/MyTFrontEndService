<template>
<div>
    <div class="ui raised segment">
        <div class="ui form">
            <h2 class="ui dividing header">New Platform</h2>
            <div class="two wide fields">
                <div class="field">
                    <label>Platform Name</label>
                    <input v-model="name" type="text">
                </div>
                <div class="field">
                    <label>Password</label>
                    <input v-model="password" type="password">
                </div>
            </div>
            <div class="three wide fields">
                <div class="field">
                    <label>Cloud Service</label>
                    <select class="form-control" @change="changeCS($event)">
                        <option value="" selected disabled>Cloud Service</option>
                        <option v-for="cloudService in cloudServices" :value="cloudService" :key="cloudService">{{ cloudService }}</option>
                    </select>
                </div>
                <div class="field">
                    <label>Space</label>
                    <select class="form-control" @change="changeSpace($event)">
                        <option value="" selected disabled>Space</option>
                        <option v-for="space in spaces" :value="space.id" :key="space.id">{{ space.name }} ({{space.id}})</option>
                    </select>
                </div>
                <div class="field">
                    <label>DataBase</label>
                    <select class="form-control" @change="changeDB($event)">
                        <option value="" selected disabled>Database</option>
                        <option v-for="database in this.databases" :value="database" :key="database">{{ database }}</option>
                    </select>
                </div>
            </div>
            <div class="three wide fields">
                <div class="field">
                    <label>RabbitMQ Username/Password</label>
                    <b-form-checkbox v-model="rabbitMQuserPass" name="check-button" switch size="lg"></b-form-checkbox>
                </div>
                <div class="field">
                    <label>RabbitMQ Username</label>
                    <input :disabled="!rabbitMQuserPass" v-model="rabbitUsername" type="text">
                </div>
                <div class="field">
                    <label>RabbitMQ Password</label>
                    <input :disabled="!rabbitMQuserPass" v-model="rabbitPassword" type="password">
                </div>
            </div>
            <div class="ui basic green button" v-if="!loading" v-on:click="createPlatform">Add</div>
            <div align="center" justify="center" v-if="loading">
                <RingLoader size="60px"></RingLoader>
            </div>
        </div>
    </div>
    <br>
    <div class="ui raised segment">
        <v-client-table :columns="columns" :data="platforms" :options="options">
            <template slot="id" slot-scope="props">
                <i class="center aligned fa fa-trash-o" style="padding: 5px" v-on:click="removePlatform(props.row.id)"></i>
            </template>
        </v-client-table>
    </div>
</div>
</template>

<script>
    import Vue from 'vue'
    import {Checkbox, Radio} from 'vue-checkbox-radio';
    import mytservice from "../services/mytservice";
    import RingLoader from 'vue-spinner/src/RingLoader.vue'

    Vue.component('checkbox', Checkbox);
    Vue.component('radio', Radio);

    export default {
        name: "Platform",
        props: {
            user: Object
        },
        components: {
            RingLoader
        },
        created() {
            this.getSpaces()
            this.getPlatforms()
        },
        data() {
            return {
                loading: false,
                name: null,
                password: null,
                databases: ["InfluxDB", "MongoDB", "MySQL", "TimeScale"],
                cloudServices: ["Amazon Web Services", "Openstack", "Google Cloud"],
                spaces: [],
                rabbitMQuserPass: true,
                rabbitUsername: null,
                rabbitPassword: null,
                selectedCS: null,
                selectedDB: null,
                selectedSpace: null,
                columns: ['name', 'cloudService', 'ip' ,'id'],
                platforms: [],
                options: {
                    headings: {
                        name: 'Title',
                        ip: 'Public IP Address',
                        cloudService: 'Cloud Service',
                        id: 'Remove'
                    }
                }
            }
        },
        methods: {
            createPlatform() {
                if (this.name === null || this.password === null || this.selectedDB === null || this.selectedCS === null){
                    this.flashMessage.error({title: 'Error', message: "All Fields must be filled"});
                }
                if (this.rabbitMQuserPass === true && (this.rabbitUsername === null || this.rabbitPassword === null)){
                    this.flashMessage.error({title: 'Error', message: "If you are using RabbitMQ credentials you must use both username and password"});
                } else {

                    let cloudServices = {
                        "Amazon Web Services" : "aws",
                        "Openstack" : "openstack",
                        "Google Cloud": "gcp"
                    }

                    let data = {
                        "platformName" : this.name,
                        "cloudService" : cloudServices[this.selectedCS],
                        "uid" : this.user.uid,
                        "password": this.password,
                        "sid" : this.selectedSpace,
                        "database": this.selectedDB.toLowerCase()
                    }

                    if (this.rabbitMQuserPass) {
                        data["rabbitUser"] = this.rabbitUsername
                        data["rabbitPass"] = this.rabbitPassword
                    }

                    let token = this.$cookies.get("access_token")
                    this.flashMessage.info({title: 'Platform deployment has started', message: "This could take a few minutes...."})
                    this.loading = true
                    mytservice.createPlatform(data, token).then(
                        response => {
                            console.log(response)
                            this.flashMessage.success({title: 'Platform has been deployed', message: "Now you can IoT"})
                            this.getPlatforms()
                            this.loading = false
                        }
                    ).catch(
                        error => {
                            console.log(error)
                            if (error.response.status === 401) {
                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                this.$parent.$parent.isSignedIn()
                                this.loading = false
                            }
                            else if(error.response.status === 400){
                                this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                                this.loading = false
                            }
                        }
                    )
                }
            },
            removePlatform (id) {
                console.log(id)
                this.$fire({
                    title: "Password",
                    text: "Enter Password to Conform Delete",
                    type: "info",
                    input: "password",
                }).then(r => {
                    let password = r.value;
                    if (password === null || password === 'undefined'){
                        console.log("")
                    } else {

                        let data = {
                            "password" : password,
                            "uid" : this.user.uid
                        }

                        let token = this.$cookies.get("access_token")

                        this.flashMessage.info({title: 'Platform teardown has started', message: "This could take a minute...."})
                        mytservice.removePlatform(data, id, token).then(
                            response => {
                                console.log(response)
                                this.flashMessage.success({title: 'Platform Removed', message: "You can double check your Cloud Service dashboard to be sure"})
                                this.getPlatforms()
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
                })
            },
            changeCS (event) {
                this.selectedCS = event.target.options[event.target.options.selectedIndex].text
            },
            changeDB (event) {
                this.selectedDB = event.target.options[event.target.options.selectedIndex].text
            },
            changeSpace (event) {
                let selectedSpaceText = event.target.options[event.target.options.selectedIndex].text
                this.selectedSpace = selectedSpaceText.match(/\(([^)]+)\)/)[1]
            },
            getSpaces(){
                let token = this.$cookies.get("access_token")
                mytservice.getSpaces(this.user.uid, token).then(
                    response => {
                        this.spaces = response.data.spaces
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
            getPlatforms() {
                let token = this.$cookies.get("access_token")
                mytservice.getPlatforms(this.user.uid, token).then(
                    response => {
                        console.log(response)
                        this.platforms = response.data.platforms
                    }
                ).catch(
                    error => {
                        console.log(error)
                        if(error.response.data.msg === "Token has expired"){
                            this.flashMessage.error({title: 'Auth Error', message: "Token Has Expired"})
                            this.$parent.$parent.isSignedIn()
                            console.log("Done from platform")
                        } else
                            this.flashMessage.error({title: 'Error', message: "Error Getting Spaces"});
                    }
                )
            }
        }
    }

</script>

<style scoped>

</style>