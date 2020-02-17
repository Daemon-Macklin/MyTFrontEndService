<template>
    <div id="app">
        <div id="section" v-if="signedIn === false" class="ui raised centered segment">
            <login-form :data="loginFormData" @sign-in="signIn"/>
            <br>
            <login-form :data="registerFormData" @sign-in="register"/>
        </div>
        <div id="section" v-if="signedIn === true" class="ui raised centered segment">
                User data goes here
        </div>
        <FlashMessage></FlashMessage>
    </div>
</template>

<script>
    import Vue from 'vue'
    import mytservice from "../services/mytservice";
    import Cookies from 'vue-cookies'
    import LoginForm from 'vue-login-form'
    import FlashMessage from '@smartweb/vue-flash-message';

    Vue.use(Cookies)
    Vue.use(FlashMessage)


    export default {
        name: "User",
        components: {
            LoginForm
        },
        created() {
            this.isSignedIn()
        },
        data () {
            return {
                signedIn: false,
                loginFormData: {
                    title: "Account Login",
                    form: true,
                    buttonText: "SIGN IN",
                    inputList:[
                        {
                        id: 'email',
                        label: 'Email',
                        type: 'text',
                        placehold: 'Email',
                        auto: 'email',
                        value: ''
                        },
                        {
                            id: 'password',
                            label: 'Password',
                            type: 'password',
                            placehold: 'Password',
                            auto: 'current-password',
                            value: ''
                        },
                    ]
                },
                registerFormData: {
                    title: "Account Register",
                    form: true,
                    buttonText: "REGISTER",
                    inputList:[
                        {
                            id: 'reg_email',
                            label: 'Email',
                            type: 'text',
                            placehold: 'Email',
                            auto: 'email',
                            value: ''
                        },
                        {
                            id: 'reg_username',
                            label: 'Username',
                            type: 'text',
                            placehold: 'Username',
                            auto: 'username',
                            value: ''
                        },
                        {
                            id: 'reg_password',
                            label: 'Password',
                            type: 'password',
                            placehold: 'Password',
                            auto: 'current-password',
                            value: ''
                        },
                    ]},
                userName: null,
                email: null,
                id: null
            }
        },
        methods : {
            signIn(res) {
                let json = {
                   email: res.email,
                   password: res.password
                };

                mytservice.login(json).then(
                    response => {
                        let user = response.data
                        if(user.success === true){
                            console.log(response.data)
                            this.signedIn = true
                            this.flashMessage.success({title: 'Login Successful', message: 'Welcome ' + user.username})
                            this.$cookies.set('uid', user.uid.toString())
                            this.$cookies.set('access_token', user.access_token.toString())
                            this.$cookies.set('refresh_token', user.refresh_token.toString())
                            this.$cookies.set('username', user.username.toString())
                            this.$cookies.set('email', user.email.toString())
                        }
                    }
                ).catch(
                    error => {
                        let err = error.response.data.errors.message
                        console.log(err)
                        this.flashMessage.error({title: 'Login Error', message: err});
                    }
                )
            },
            register(res){
                let json = {
                    email: res.reg_email,
                    password: res.reg_password,
                    userName: res.reg_username
                };

                mytservice.register(json).then(
                    response => {
                        let user = response.data
                        if(user.success === true){
                            console.log(response.data)
                            this.signedIn = true
                            this.flashMessage.success({title: 'Register Successful', message: 'Welcome ' + user.username})
                            this.$cookies.set('uid', user.uid.toString())
                            this.$cookies.set('access_token', user.access_token.toString())
                            this.$cookies.set('refresh_token', user.refresh_token.toString())
                            this.$cookies.set('username', user.username.toString())
                            this.$cookies.set('email', user.email.toString())
                        }
                    }
                ).catch(
                    error => {
                        let err = error.response.data.errors.message
                        console.log(err)
                        this.flashMessage.error({title: 'Login Error', message: err});
                    }
                )
            },
            isSignedIn(){
                console.log("Here")
                let access_token = this.$cookies.get('access_token')
                let refresh_token = this.$cookies.get('access_token')
                if (access_token != null && refresh_token != null){
                    var current_time = new Date().getTime() / 1000;
                    if (current_time > access_token.exp) {
                        // Access token is expired
                        if (current_time > refresh_token.exp){
                            // Refresh token is expired
                            this.logout()
                        } else {
                            mytservice.refreshToken(refresh_token)
                            .then(
                                response =>{
                                    console.log(response)

                                }
                            ).catch(
                                error => {
                                    console.log(error)
                                }
                            )
                        }
                    } else {
                        this.signedIn = true
                    }
                } else {
                    console.log("No user signed in")
                }
            },
            logout(){
                this.$cookies.remove('uid')
                this.$cookies.remove('access_token')
                this.$cookies.remove('refresh_token')
                this.$cookies.remove('username')
                this.$cookies.remove('email')
                location.reload()
            }
        }
    }
</script>

<style scoped>
    #section {
        margin-left: 10%;
        margin-right: 10%;
    }
</style>