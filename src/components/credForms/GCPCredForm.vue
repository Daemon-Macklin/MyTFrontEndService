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
                    <label> Service Account File </label>
                    <input type="file" id="embedpollfileinput" @change="fileEvent($event)"/>
                </div>
           </div>
        </div>
        <div class="ui blue bottom attached button" v-on:click="createCreds">Add</div>
    </div>
</template>

<script>
    export default {
        name: "GCPCredForm",
        props: {
          user: Object
        },
        data() {
            return {
                name: null,
                password: null,
                account: null
            }
        },
        methods: {
            fileEvent(event) {
                this.dataProcessingScript = event.target.files[0]
            },
            createCreds(){
                console.log("")
            }
        }
    }
</script>

<style scoped>

</style>