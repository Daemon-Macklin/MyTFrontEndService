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
            <div class="four wide fields">
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
                <div class="field">
                    <label>RabbitMQ TLS Enabled</label>
                    <b-form-checkbox v-model="rabbitMQTLS" name="check-button" switch size="lg"></b-form-checkbox>
                </div>
            </div>
            <div class="two wide fields">
                <div class="field">
                    <label> Data Processing Script </label>
                    <input type="file" id="embedpollfileinput" @change="fileEvent($event)"/>
                </div>
                <div class="field">
                    <label> Required Packages</label>
                    <div class="ui action input">
                        <input type="text" v-model="packageInput" placeholder="Package Name...">
                        <button class="ui button" v-on:click="addPackage">Add</button>
                    </div>
                </div>
            </div>
            <h4 class="ui horizontal divider header">Packages</h4>
            <div class="ui centered stackable equal width grid">
                <div class="four wide column" v-bind:key="item" v-for="item in packages">
                    <div class="ui card">
                        <div class="content">
                            <div class="header">
                                {{item}}
                                <i class="fa fa-trash-o" style="padding: 5px" v-on:click="removePackage(item)"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h4 class="ui horizontal divider header">Ready?</h4>
            <br>
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
                <i class="center aligned fa fa-cogs" style="padding: 5px" v-on:click="updateProcessing(props.row.id)"></i>
                <i class="center aligned fa fa-database" style="padding: 5px" v-on:click="getDump(props.row.id)"></i>
            </template>
        </v-client-table>
    </div>
</div>
</template>

<script>
    import Vue from 'vue'
    import {Checkbox, Radio} from 'vue-checkbox-radio';
    import Swal from 'sweetalert2'
    import mytservice from "../services/mytservice";
    import RingLoader from 'vue-spinner/src/RingLoader.vue'
    import saveAs from "file-saver";

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
            this.getSpaces();
            this.getPlatforms()
        },
        data() {
            return {
                loading: false,
                packageInput: null,
                name: null,
                password: null,
                packages: [],
                databases: ["InfluxDB", "MongoDB", "MySQL", "TimeScale"],
                cloudServices: ["Amazon Web Services", "Openstack", "Google Cloud"],
                spaces: [],
                rabbitMQuserPass: true,
                rabbitUsername: null,
                rabbitPassword: null,
                rabbitMQTLS: false,
                selectedCS: null,
                selectedDB: null,
                selectedSpace: null,
                columns: ['name', 'cloudService', 'ip' ,'id'],
                platforms: [],
                dataProcessingScript: null,
                options: {
                    headings: {
                        name: 'Title',
                        ip: 'Public IP Address',
                        cloudService: 'Cloud Service',
                        id: 'Management'
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
                    };

                    let data = {
                        "platformName" : this.name,
                        "cloudService" : cloudServices[this.selectedCS],
                        "uid" : this.user.uid,
                        "password": this.password,
                        "sid" : this.selectedSpace,
                        "database": this.selectedDB.toLowerCase(),
                        "packages": this.packages,
                        "rabbitTLS": this.rabbitTLS
                    };

                    if (this.rabbitMQuserPass) {
                        data["rabbitUser"] = this.rabbitUsername;
                        data["rabbitPass"] = this.rabbitPassword
                    }

                    let formData = new FormData();

                    for (let prop in data) {
                        formData.append(prop,data[prop]);
                    }

                    if(this.dataProcessingScript != null){
                        formData.append("script", this.dataProcessingScript)
                    }

                    let token = this.$cookies.get("access_token");

                    this.flashMessage.info({title: 'Platform deployment has started', message: "This could take a few minutes...."});
                    this.loading = true;

                    mytservice.createPlatform(formData, token).then(
                        response => {
                            console.log(response);
                            this.flashMessage.success({title: 'Platform has been deployed', message: "Now you can IoT"});
                            this.getPlatforms();
                            this.loading = false
                        }
                    ).catch(
                        error => {
                            console.log(error.response);
                            this.loading = false;
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
            removePlatform (id) {
                console.log(id);
                this.$fire({
                    title: "Password",
                    text: "Enter Password to Confirm Delete",
                    type: "info",
                    input: "password",
                    showCancelButton: true
                }).then(r => {
                    if (r.value) {
                        let password = r.value;
                        if (password === null || password === 'undefined') {
                            console.log("")
                        } else {

                            let data = {
                                "password": password,
                                "uid": this.user.uid
                            };

                            let token = this.$cookies.get("access_token");

                            this.flashMessage.info({
                                title: 'Platform teardown has started',
                                message: "This could take a minute...."
                            });
                            mytservice.removePlatform(data, id, token).then(
                                response => {
                                    console.log(response);
                                    this.flashMessage.success({
                                        title: 'Platform Removed',
                                        message: "You can double check your Cloud Service dashboard to be sure"
                                    });
                                    this.getPlatforms()
                                }
                            ).catch(
                                error => {
                                    console.log(error);
                                    if (error.response.status === 401) {
                                        this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                        this.$parent.$parent.isSignedIn()
                                    } else if (error.response.status === 400) {
                                        try {
                                            this.flashMessage.error({
                                                title: 'Error',
                                                message: error.response.data.errors.message
                                            });
                                        } catch (e) {
                                            this.flashMessage.error({
                                                title: 'Error',
                                                message: "Error Creating Platform"
                                            });
                                        }
                                    }
                                }
                            )
                        }
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
                let selectedSpaceText = event.target.options[event.target.options.selectedIndex].text;
                this.selectedSpace = selectedSpaceText.match(/\(([^)]+)\)/)[1]
            },
            getSpaces(){
                let token = this.$cookies.get("access_token");
                mytservice.getSpaces(this.user.uid, token).then(
                    response => {
                        this.spaces = response.data.spaces
                    }
                ).catch(
                    error => {
                        if(error.response.data.msg === "Token has expired"){
                            this.flashMessage.error({title: 'Auth Error', message: "Token Has Expired"});
                            this.$parent.$parent.isSignedIn()
                        } else
                            this.flashMessage.error({title: 'Error', message: "Error Getting Spaces"});
                    }
                )
            },
            getPlatforms() {
                let token = this.$cookies.get("access_token");
                mytservice.getPlatforms(this.user.uid, token).then(
                    response => {
                        console.log(response);
                        this.platforms = response.data.platforms
                    }
                ).catch(
                    error => {
                        console.log(error);
                        if(error.response.data.msg === "Token has expired"){
                            this.flashMessage.error({title: 'Auth Error', message: "Token Has Expired"});
                            this.$parent.$parent.isSignedIn();
                            console.log("Done from platform")
                        } else
                            this.flashMessage.error({title: 'Error', message: "Error Getting Spaces"});
                    }
                )
            },
            fileEvent(event) {
                this.dataProcessingScript = event.target.files[0]
            },
            updateProcessing(id) {
                console.log(id);
                Swal.mixin({
                    confirmButtonText: 'Next &rarr;',
                    showCancelButton: true,
                    progressSteps: ['File', 'Packages', 'Password']
                }).queue([
                    {
                        title: 'New Script',
                        text: 'The script you want to upload',
                        input: "file"
                    },
                    {
                        title: 'Additional Packages',
                        text: "List all of your requirements in a comma separated list",
                        input: "textarea"
                    },
                    {
                        title: 'Password',
                        input: "password"
                    }
                ]).then((result) => {
                    if (result.value) {
                        if(result.value[0] === null || result.value[0].name.split('.').pop() !== "py"){
                            Swal.fire({
                                title: 'Must add python File',
                                type: "error"
                            })
                        } else if(result.value[2] === ""){
                            Swal.fire({
                                title: 'Must add Password',
                                type: "error"
                            })
                        } else {
                            Swal.fire({
                                title: 'Looks Good!',
                                confirmButtonText: 'Update',
                                showCancelButton: true,
                            }).then( r=> {
                                console.log(r)

                                if(r.value) {
                                    var processingForm = new FormData()

                                    // console.log(result.value[0].name.split('.').pop())

                                    processingForm.append("uid", this.$cookies.get("uid"))
                                    processingForm.append("password", result.value[2])
                                    processingForm.append("packages", result.value[1])
                                    processingForm.append('script', result.value[0], "dataprocessing.py")

                                    console.log(processingForm)
                                    let token = this.$cookies.get("access_token")
                                    mytservice.updateProcessing(processingForm, id, token).then(
                                        response => {
                                            console.log(response)
                                            this.flashMessage.success({title: 'Platform Updated', message: "Bug Fixin"});
                                        }
                                    ).catch(
                                        error => {
                                            console.log(error);
                                            if (error.response.status === 401) {
                                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                                this.$parent.$parent.isSignedIn()
                                            }
                                            else if(error.response.status === 400){
                                                try {
                                                    this.flashMessage.error({title: 'Error', message: error.response.data.errors.message});
                                                }catch (e){
                                                    this.flashMessage.error({title: 'Error', message: "Error Creating Platform"});
                                                }
                                            }
                                        }
                                    )
                                    }
                                }
                            )
                        }
                    }
                })
            },
            getDump(id){
                console.log(id)

                this.$fire({
                    title: "Password",
                    text: "Enter Password to get Dump",
                    type: "info",
                    input: "password",
                    showCancelButton: true
                }).then(r => {
                    if (r.value) {
                        let password = r.value;
                        if (password === null || password === 'undefined') {
                            console.log("")
                        } else {

                            let data = {
                                "password": password,
                                "uid": this.user.uid
                            };

                            let token = this.$cookies.get("access_token");

                            this.flashMessage.info({
                                title: 'Database Dump started',
                                message: "This could take a minute...."
                            });
                            mytservice.generateDump(data, id, token).then(
                                response => {
                                    console.log(response);
                                    this.flashMessage.success({title: 'Data Received', message: "Your download will start now"});
                                    let blob = new Blob([(response.data)])
                                    try {
                                        saveAs(blob, this.user.username + "dataBase.zip")
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                            ).catch(
                                error => {
                                    console.log(error);
                                    if (error.response.status === 401) {
                                        this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                        this.$parent.$parent.isSignedIn()
                                    } else if (error.response.status === 400) {
                                        try {
                                            this.flashMessage.error({
                                                title: 'Error',
                                                message: error.response.data.errors.message
                                            });
                                        } catch (e) {
                                            this.flashMessage.error({
                                                title: 'Error',
                                                message: "Error Getting Dump"
                                            });
                                        }
                                    }
                                }
                            )
                        }
                    }
                })
            },
            addPackage() {
                if(this.packageInput === null){
                    this.flashMessage.error({title: 'Nothing to add', message: "Witty remark"})
                } else {
                    if (this.packages.includes(this.packageInput)) {
                        this.flashMessage.error({title: 'Package Already in list', message: ""})
                    } else {
                        this.packages.push(this.packageInput)
                        console.log(this.packages)
                    }
                }
            },
            removePackage(item){
                if (this.packages.includes(item)){
                    this.packages = this.packages.filter(function(value){
                        return value !== item;
                    });
                    console.log(this.packages)
                }
            },
            str2bytes (str) {
                var bytes = new Uint8Array(str.length);
                for (var i=0; i<str.length; i++) {
                    bytes[i] = str.charCodeAt(i);
                }
                return bytes;
            }
        }
    }

</script>

<style scoped>

</style>