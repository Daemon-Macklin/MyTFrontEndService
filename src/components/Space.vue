<template>
    <div>
        <AwsSpaceForm v-bind:user="user" />
        <br>
        <v-client-table :columns="columns" :data="spaces" :options="options">
            <template slot="id" slot-scope="props">
                <i class="center aligned fa fa-trash-o" style="padding: 5px" v-on:click="removeSpace(props.row.id, props.row.type)"></i>
            </template>
        </v-client-table>
    </div>
</template>

<script>
    import Vue from 'vue'
    import AwsSpaceForm from "./spaceForms/AwsSpaceForm";
    import mytservice from "../services/mytservice";
    import VueSimpleAlert from "vue-simple-alert";

    Vue.use(VueSimpleAlert)
    export default {
        data() {
            return {
                columns: ['type', 'name', 'id'],
                spaces: [],
                options: {
                    headings: {
                        name: 'Title',
                        type: 'Type',
                        id: 'Remove'
                    }
                }
            }
        },
        props: {
            user: Object
        },
        components: {
            AwsSpaceForm
        },
        created() {
            this.getSpaces()
            },
        name: "Space",
        methods: {
            removeSpace(id, type){
                console.log(id)
                console.log(type)
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
                        if (type === "aws") {
                            let data = {
                                "uid": this.user.uid,
                                "password": password
                            }
                            let token = this.$cookies.get("access_token")
                            mytservice.removeAWSSpaces(data, id, token).then(
                                response => {
                                    console.log(response)
                                    this.flashMessage.success({title: 'Space Removed', message: "You can double check your AWS dashboard to be sure"})
                                    this.getSpaces()
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
                })
            },
            getSpaces(){
                let token = this.$cookies.get("access_token")
                mytservice.getSpaces(this.user.uid, token).then(
                    response => {
                        this.spaces = response.data.spaces
                    }
                ).catch(
                    error => {
                        console.log(error)
                        this.flashMessage.error({title: 'Error', message: "Error Getting Spaces"});
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>