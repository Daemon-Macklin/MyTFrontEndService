<template>
    <div>
        <div class="ui three wide cards">
            <AwsForm v-bind:user="user" />
            <OSCredForm v-bind:user="user" />
            <GCPCredForm v-bind:user="user" />
        </div>
        <br>
        <v-client-table :columns="columns" :data="creds" :options="options">
            <template slot="id" slot-scope="props">
                <i class="center aligned fa fa-trash-o" style="padding: 5px" v-on:click="removeCreds(props.row.id, props.row.type)"></i>
            </template>
        </v-client-table>
    </div>
</template>

<script>
    import Vue from 'vue'
    import AwsForm from "./credForms/AwsCredForm";
    import OSCredForm from "./credForms/OSCredForm"
    import GCPCredForm from "./credForms/GCPCredForm";
    import VueTables from 'vue-tables-2'
    import mytservice from "../services/mytservice";
    Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

    export default {
        name: "Credentials",
        components: {AwsForm, OSCredForm, GCPCredForm},
        created() {
            this.getCreds()
            },
        props: {
            user: Object
        },
        data() {
            return {
                columns: ['type', 'name', 'id'],
                creds: [],
                options: {
                    headings: {
                        name: 'Title',
                        type: 'Type',
                        id: 'Remove'
                    }
                }
            }
        },
        methods: {
            getCreds(){
                let token = this.$cookies.get("access_token")
                mytservice.getCreds(this.user.uid, token).then(
                    response => {
                        this.creds = response.data.creds
                    }
                ).catch(
                    error => {
                        console.log(error)
                        // if(error.)
                        this.flashMessage.error({title: 'Error', message: "Error Getting Credentials"});
                    }
                )
            },
            removeCreds(id, type) {
                if(id === null && type === null){
                    console.log("Error deleting creds")
                } else {
                    console.log(id)
                    console.log(type)
                    let token = this.$cookies.get("access_token")
                    mytservice.removeCred(type, id, token).then(
                        response => {
                            console.log(response)
                            if(type === "aws")
                                this.flashMessage.success({title: 'Credentials Removed', message: "Don't forget to deactivate them on AWS"})
                            else
                                this.flashMessage.success({title: 'Credentials Removed', message: ""})
                            this.getCreds()
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
            }
        }
    }
</script>

<style scoped>

</style>