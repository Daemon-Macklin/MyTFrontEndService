<template>
    <div class="ui three cards">
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">{{ user.username }}</div>
                <div class="meta"> {{ user.email }}</div>
                <div class="description">
                    Elliot Fu is a film-maker from New York.
                </div>
            </div>
        </div>
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">Keys</div>
                <div class="meta"> Get the public and private key we generated for you</div>
                    <div class="ui form">
                        <div class="inline field">
                            <label>Password</label>
                            <input v-model="key_password" type="password">
                        </div>
                        <div class="ui basic green button" v-on:click="getKey">Get </div>
                    </div>
            </div>
        </div>
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">Something else</div>
                <div class="meta"> </div>
                <div class="ui basic green button">Does nothing</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import mytservice from "../services/mytservice";
    import FlashMessage from '@smartweb/vue-flash-message';
    import saveAs from 'file-saver';

    Vue.use(FlashMessage)

    export default {
        name: "User.vue",
        data() {
          return {
              key_password: null,
          }
        },
        props: {
            user: Object
        },
        methods: {
            getKey() {
                if(this.key_password === null){
                    this.flashMessage.error({title: 'Authentication Error', message: "Password is required to get Key"});
                } else {
                    let access_token = this.$cookies.get('access_token')
                    mytservice.getKeys(this.user.uid, this.key_password, access_token).then(
                        response => {
                            this.flashMessage.warning({title: 'Key received', message: 'BE SURE NOT TO SHOW THIS TO ANYONE'})
                            let blob = new Blob([response.data.privateKey.toString() + "\n" + response.data.publicKey.toString()], {type: "text/plain;charset=utf-8"})
                            console.log(blob)
                            try {
                                saveAs(blob, this.user.username + "-key.txt")
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    ).catch(
                        error => {
                            console.log(error)
                            if (error.response.status === 401) {
                                this.flashMessage.error({title: 'Error', message: error.response.data.msg});
                                if(error.response.data.msg === "")
                                    this.logout()
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