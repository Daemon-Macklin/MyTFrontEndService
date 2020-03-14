<template>
    <div class="ui two cards">
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">
                    <h3 class="ui dividing header">User Data</h3>
                </div>
                <div class="meta">
                    Your info
                </div>
                <div class="description">
                    <div class="ui vertical steps">
                        <div class="step">
                            <i class="user icon"></i>
                            <div class="content">
                                <div class="title">Username</div>
                                <div class="description">{{ user.username }}</div>
                            </div>
                        </div>
                        <div class="step">
                            <i class="envelope outline icon"></i>
                            <div class="content">
                                <div class="title">Email</div>
                                <div class="description">{{ user.email }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui raised card">
            <div class="content" style="alignment: left">
                <div class="header">
                    <h3 class="ui dividing header">Keys</h3>
                </div>
                <br>
                <div class="meta"> Get the public and private key we generated for you</div>
                <br>
                <div class="content">
                    <div class="ui action input">
                        <input v-model="key_password" placeholder="Password" type="password">
                        <button class="ui blue button" v-on:click="getKey">Get</button>
                    </div>
                </div>
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
                            this.key_password = null
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