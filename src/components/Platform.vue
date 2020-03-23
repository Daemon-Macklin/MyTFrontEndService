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
            <div class="four wide fields">
                <div class="field">
                    <label>Cloud Service</label>
                    <select class="form-control" @change="changeCS($event)">
                        <option value="" selected disabled>Cloud Service</option>
                        <option v-for="cloudService in cloudServices" :value="cloudService" :key="cloudService">{{ cloudService }}</option>
                    </select>
                </div>
                <div class="field" v-if="selectedCS!=='Google Cloud'">
                    <label>Space</label>
                    <select v-if="selectedCS!=='Google Cloud'" class="form-control" @change="changeSpace($event)">
                        <option value="" selected disabled>Space</option>
                        <option v-for="space in spaces" :value="space.id" :key="space.id">{{ space.name }} ({{space.id}})</option>
                    </select>
                </div>
                <div class="field" v-if="selectedCS==='Google Cloud'">
                    <label>Credentials</label>
                    <select v-if="selectedCS==='Google Cloud'" class="form-control" @change="changeCred($event)">
                        <option value="" selected disabled>Credentials</option>
                        <option v-for="cred in creds" :value="cred.id" :key="cred.id">{{ cred.name }} ({{cred.id}})</option>
                    </select>
                </div>
                <div class="field">
                    <label>DataBase</label>
                    <select class="form-control" @change="changeDB($event)">
                        <option value="" selected disabled>Database</option>
                        <option v-for="database in this.databases" :value="database" :key="database">{{ database }}</option>
                    </select>
                </div>
                <div class="field">
                    <label>DataBase Size</label>
                    <select class="form-control" @change="changeDBSize($event)">
                        <option value="" selected disabled>Database Size</option>
                        <option v-for="size in this.dbSizes" :value="size" :key="size">{{ size }}</option>
                    </select>
                </div>
            </div>
            <div class="two wide fields" v-if="selectedCS==='Openstack'">
                <div class="field">
                    <label>Flavor Name</label>
                    <input v-model="flavorName" type="text">
                </div>
                <div class="field">
                    <label>Image Name</label>
                    <input v-model="imageName" type="text">
                </div>
            </div>
            <div class="two wide fields" v-if="selectedCS==='Google Cloud'">
                <div class="field">
                    <label>Availability Zone</label>
                    <input v-model="zone" type="text">
                </div>
            </div>
            <div  v-if="selectedDB==='MySQLDB' || selectedDB === 'TimeScaleDB'">
                <div class="two wide fields">
                    <div class="field">
                        <label>Field Name</label>
                        <input v-model="fieldname" type="text">
                    </div>
                    <div class="field">
                        <label>Field Type</label>
                        <select class="form-control" @change="changeFieldType($event)">
                            <option value="" selected disabled>Type</option>
                            <option v-for="type in this.fieldTypes" :value="type" :key="type">{{ type }}</option>
                        </select>
                    </div>
                </div>
                <div class="ui blue button" v-on:click="addField">Add</div>
                <br>
                <br>
                    <div class="ui centered stackable equal width grid">
                        <div class="four wide column" v-for="item in this.dispDBFields" :key="item.name">
                            <div class="ui card">
                                <div class="content">
                                    <div class="header">
                                        {{item.name}}: {{item.type}}
                                        <i class="fa fa-trash-o" style="padding: 5px" v-on:click="removeField(item.name)"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <br>
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
                    <b-form-checkbox v-model="rabbitTLS" name="check-button" switch size="lg"></b-form-checkbox>
                </div>
            </div>
            <div class="two wide fields">
                <div class="field">
                    <label> Monitoring Enabled </label>
                    <b-form-checkbox v-model="monitoring" name="check-button" switch size="lg"></b-form-checkbox>
                </div>
                <div class="field">
                    <label> Monitoring Frequency </label>
                    <select class="form-control" :disabled="!monitoring" @change="changeFreq($event)">
                        <option value="" selected disabled>Freq(mins)</option>
                        <option v-for="freq in this.monitoringFreq" :value="freq" :key="freq">{{ freq }}</option>
                    </select>
                </div>
            </div>
            <div class="three wide fields">
                <div class="field">
                    <label>Data Processing Template</label>
                    <div class="ui blue button" v-if="!loading" v-on:click="downloadTemplate">Download Template</div>
                </div>
                <div class="field">
                    <label> Data Processing Script </label>
                    <input type="file" id="embedpollfileinput" @change="fileEvent($event)"/>
                </div>
                <div class="field">
                    <label> Required Packages</label>
                    <div class="ui action input">
                        <input type="text" v-model="packageInput" placeholder="Package Name...">
                        <button class="ui blue button" v-on:click="addPackage">Add</button>
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
            <div class="ui blue button" v-if="!loading" v-on:click="createPlatform">Add</div>
            <div align="center" justify="center" v-if="loading">
                <RingLoader size="60px"></RingLoader>
            </div>
        </div>
    </div>
    <br>
    <div class="ui raised segment">
        <v-client-table :columns="columns" :data="platforms" :options="options">
            <template slot="id" slot-scope="props">
                <i class="center aligned fa fa-trash-o" style="padding-right: 5px" v-on:click="removePlatform(props.row.id)"></i>
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
            this.getCreds()
            this.getPlatforms()
        },
        data() {
            return {
                loading: false,
                packageInput: null,
                name: null,
                password: null,
                packages: [],
                databases: ["InfluxDB", "MongoDB", "MySQLDB", "TimeScaleDB"],
                cloudServices: ["Amazon Web Services", "Openstack", "Google Cloud"],
                monitoringFreq: [2, 5, 10, 20, 30, 60],
                dbSizes: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                spaces: [],
                awsSpaces: [],
                osSpaces: [],
                creds: [],
                rabbitMQuserPass: true,
                rabbitUsername: null,
                rabbitPassword: null,
                rabbitTLS: false,
                selectedCS: null,
                selectedDB: null,
                selectedDBSize: null,
                selectedSpace: null,
                selectedCred: null,
                zone: null,
                monitoring: false,
                selectedFreq: null,
                columns: ['name', 'cloudService', 'ip' ,'id'],
                platforms: [],
                dataProcessingScript: null,
                imageName: null,
                flavorName: null,
                dbFields: {},
                fieldTypes: ["int", "varchar"],
                fieldname: null,
                fieldType: null,
                dispDBFields: [],
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
                } else if (this.rabbitMQuserPass === true && (this.rabbitUsername === null || this.rabbitPassword === null)){
                    this.flashMessage.error({title: 'Error', message: "If you are using RabbitMQ credentials you must use both username and password"});
                } else if (this.monitoring === true && this.selectedFreq === null){
                    this.flashMessage.error({title: 'Error', message: "If you are using monitoring you must specify frequency"});
                } else {

                    let cloudServices = {
                        "Amazon Web Services" : "aws",
                        "Openstack" : "openstack",
                        "Google Cloud": "gcp"
                    };

                    let data = {
                        "platformName" : this.name.toLowerCase().replace(/\s+/g, ''),
                        "cloudService" : cloudServices[this.selectedCS],
                        "uid" : this.user.uid,
                        "password": this.password,
                        "sid" : this.selectedSpace,
                        "database": this.selectedDB.toLowerCase(),
                        "dbsize" : this.selectedDBSize,
                        "packages": this.packages,
                        "rabbitTLS": this.rabbitTLS.toString(),
                        "monitoring" : this.monitoring,
                        "monitoringFreq" : this.selectedFreq
                    };

                    if (this.rabbitMQuserPass) {
                        data["rabbitUser"] = this.rabbitUsername.replace(/\s+/g, '')
                        data["rabbitPass"] = this.rabbitPassword.replace(/\s+/g, '')
                    }

                    if(this.selectedCS === "Openstack"){
                        data["flavorName"] = this.flavorName
                        data["imageName"] = this.imageName
                    }

                    if(this.selectedCS === "Google Cloud"){
                        data["zone"] = this.zone
                        data["cid"] = this.selectedCred
                    }

                    if(this.selectedDB === "MySQLDB" || this.selectedDB === "TimeScaleDB"){
                        data["dbFields"] = JSON.stringify(this.dbFields)
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

                    if(this.rabbitTLS === false) {
                        mytservice.createPlatform(formData, token).then(
                            response => {
                                console.log(response);
                                this.flashMessage.success({
                                    title: 'Platform has been deployed',
                                    message: "Now you can IoT"
                                });
                                this.getPlatforms();
                                this.clearFields()
                                this.loading = false
                            }
                        ).catch(
                            error => {
                                console.log(error.response);
                                this.loading = false;
                                if (error.response.status === 401) {
                                    this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                    this.$parent.$parent.isSignedIn()
                                } else if (error.response.status === 400) {
                                    this.flashMessage.error({
                                        title: 'Error',
                                        message: error.response.data.errors.message
                                    });
                                }
                            }
                        )
                    } else if(this.rabbitTLS === true) {
                        mytservice.createPlatformTLS(formData, token).then(
                            response => {
                                console.log(response);
                                this.flashMessage.success({
                                    title: 'Platform has been deployed',
                                    message: "Now you can IoT, here are your TLS keys"
                                });
                                this.getPlatforms();
                                this.loading = false
                                let blob = new Blob([(response.data)])
                                try {
                                    saveAs(blob, this.name + "-Keys.zip")
                                } catch (e) {
                                    console.log(e)
                                }
                                this.clearFields()
                            }
                        ).catch(
                            error => {
                                console.log(error.response);
                                this.loading = false;
                                if (error.response.status === 401) {
                                    this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                    this.$parent.$parent.isSignedIn()
                                } else if (error.response.status === 400) {
                                    this.flashMessage.error({
                                        title: 'Error',
                                        message: error.response.data.errors.message
                                    });
                                }
                            }
                        )
                    }
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
                console.log(this.selectedCS)
                if(this.selectedCS === "Openstack"){
                    this.spaces = this.osSpaces
                } else {
                    this.spaces = this.awsSpaces
                }
                console.log(this.spaces)
                console.log(this.awsSpaces)
            },
            changeDB (event) {
                this.selectedDB = event.target.options[event.target.options.selectedIndex].text
            },
            changeDBSize (event) {
                this.selectedDBSize = event.target.options[event.target.options.selectedIndex].text
            },
            changeFreq (event) {
                this.selectedFreq = event.target.options[event.target.options.selectedIndex].text
                console.log(this.selectedFreq)
            },
            changeFieldType (event) {
                this.fieldType = event.target.options[event.target.options.selectedIndex].text
                console.log(this.fieldType)
            },
            changeSpace (event) {
                let selectedSpaceText = event.target.options[event.target.options.selectedIndex].text;
                this.selectedSpace = selectedSpaceText.match(/\(([^)]+)\)/)[1]
            },
            changeCred (event) {
                let selectedCredText = event.target.options[event.target.options.selectedIndex].text
                this.selectedCred = selectedCredText.match(/\(([^)]+)\)/)[1]
            },
            getSpaces(){
                let token = this.$cookies.get("access_token");
                mytservice.getSpaces(this.user.uid, token).then(
                    response => {
                        let awsSpaces = []
                        for (let key in response.data.spaces) {
                            if(response.data.spaces[key].type === "AWS"){
                                awsSpaces.push(response.data.spaces[key])
                            }
                        }
                        this.awsSpaces = awsSpaces
                        let osSpaces = []
                        for (let key in response.data.spaces) {
                            if(response.data.spaces[key].type === "Openstack"){
                                osSpaces.push(response.data.spaces[key])
                            }
                        }
                        this.osSpaces = osSpaces
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
            getCreds(){
                let token = this.$cookies.get("access_token")
                mytservice.getCreds(this.user.uid, token).then(
                    response => {
                        let gcpCreds = []
                        for (let key in response.data.creds) {
                            if (response.data.creds[key].type === "GCP") {
                                gcpCreds.push(response.data.creds[key])
                            }
                        }
                        this.creds = gcpCreds
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
            removeField(item){
                Vue.delete(this.dbFields, item)
                for(let dispItem in this.dispDBFields){
                    if(this.dispDBFields[dispItem].name === item){
                        this.dispDBFields = this.dispDBFields.filter(function(value){
                            return value.name !== item;
                        });
                    }
                }
            },
            downloadTemplate(){
                let token = this.$cookies.get("access_token");
                mytservice.downloadTemplate(token).then(
                    response => {
                        console.log(response);
                        this.flashMessage.success({title: 'Template Received', message: "Put your custom code here"});
                        let blob = new Blob([(response.data)])
                        try {
                            saveAs(blob, "dataProcessing.py")
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
            },
            addField(){
                this.dbFields[this.fieldname] = this.fieldType
                console.log(JSON.stringify(this.dbFields))

                let data = {
                    "name" : this.fieldname,
                    "type" : this.fieldType
                }
                this.fieldname = null
                for(let item in this.dispDBFields){
                    console.log(data.name)
                    console.log(this.dispDBFields[item].name)
                    if(data.name === this.dispDBFields[item].name){
                        this.dispDBFields[item].type = data.type
                        return
                    }
                }
                this.dispDBFields.push(data)
            },
            clearFields() {
                this.name = null
                this.password = null
                this.packages = []
                this.rabbitMQuserPass = true
                this.rabbitUsername = null
                this.rabbitPassword = null
                this.rabbitTLS = null
                this.monitoring = false
                this.selectedFreq = null
            }
        }
    }

    /**
     *                 loading: false,
     packageInput: null,
     name: null,
     password: null,
     packages: [],
     databases: ["InfluxDB", "MongoDB", "MySQL", "TimeScale"],
     cloudServices: ["Amazon Web Services", "Openstack", "Google Cloud"],
     monitoringFreq: [2, 5, 10, 20, 30, 60],
     spaces: [],
     rabbitMQuserPass: true,
     rabbitUsername: null,
     rabbitPassword: null,
     rabbitTLS: false,
     selectedCS: null,
     selectedDB: null,
     selectedSpace: null,
     monitoring: false,
     selectedFreq: null,
     columns: ['name', 'cloudService', 'ip' ,'id'],
     platforms: [],
     dataProcessingScript: null,
     */
</script>

<style scoped>

</style>