<template>
    <div class="ui raised card">
        <div class="content" style="alignment: left">
            <div class="header">Openstack Space</div>
            <div class="meta">Save a network configuration for Openstack Platforms</div>
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
                <div class="fields">
                    <div class="field">
                        <label>Tenant Network</label>
                        <input v-model="tenantName" type="text">
                    </div>
                    <div class="field">
                        <label>Availability Zone</label>
                        <input v-model="availabilityZone" type="text">
                    </div>
                </div>
                <div class="fields">
                    <div class="field">
                        <label>External Network</label>
                        <input v-model="ipPool" type="text">
                    </div>
                    <div class="field">
                        <label>Security Group</label>
                        <input v-model="securityGroup" type="text">
                    </div>
                    <div class="field">
                        <label>Internal Network</label>
                        <input v-model="intNetwork" type="text">
                    </div>
                </div>
                <select class="form-control" @change="changeCred($event)">
                    <option value="" selected disabled>Credentials</option>
                    <option v-for="cred in this.osCreds" :value="cred.id" :key="cred.id">{{ cred.name }} ({{cred.id}})</option>
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
    import RingLoader from 'vue-spinner/src/RingLoader.vue'
    import mytservice from "../../services/mytservice";

    export default {
        name: "OSSpaceForm",
        props: {
            user: Object,
            osCreds: Array
        },
        components: {
            RingLoader
        },
        data() {
            return {
                name: null,
                password: null,
                tenantName: null,
                availabilityZone: null,
                ipPool: null,
                securityGroup: null,
                selectedCred: null,
                intNetwork: null,
                loading: false
            }
        },
        methods: {
            createSpace() {
                if(this.name === null || this.password === null || this.tenantNetwork === null || this.availabilityZone === null || this.ipPool === null || this.intNetwork === null || this.selectedCred === null) {
                    this.flashMessage.error({title: 'Error', message: "All Fields must be filled"});
                } else{
                    let data = {
                        uid : this.user.uid,
                        name: this.name,
                        password: this.password,
                        tenantName: this.tenantName,
                        availabilityZone: this.availabilityZone,
                        ipPool: this.ipPool,
                        securityGroup: this.securityGroup,
                        intNetwork: this.intNetwork,
                        cid: this.selectedCred
                    }
                    let token = this.$cookies.get("access_token")
                    this.loading = true
                    mytservice.createOSSpace(data, token).then(
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
                            this.loading=false
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
            changeCred (event) {
                let selectedCredText = event.target.options[event.target.options.selectedIndex].text
                this.selectedCred = selectedCredText.match(/\(([^)]+)\)/)[1]
            },
            clearFields(){
                this.name = null
                this.password = null
                this.tenantNetwork = null
                this.availabilityZone = null
                this.ipPool = null
                this.selectedCred = null
            }
        }
    }
</script>

<style scoped>

</style>