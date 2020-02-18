<template>
    <div id="app">
        <div id="section" class="ui raised centered segment">
            <login-form :data="loginFormData" @sign-in="signIn"/>
            <br>
            <login-form :data="registerFormData" @sign-in="register"/>
        </div>
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
    Vue.use(LoginForm)


    export default {
        name: "Login",
        components: {
            LoginForm
        },
        data () {
            return {
                loginFormData: {
                    title: "Account Login",
                    form: false,
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
                    form: false,
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
            }
        },
        methods : {
            signIn(res) {

                if(res.email === "" || res.password === ""){
                    this.flashMessage.error({title: 'Login Error', message: "All Fields must be filled"});
                    return
                }

                let json = {
                   email: res.email,
                   password: res.password
                };

                mytservice.login(json).then(
                    response => {
                        let user = response.data
                        if(user.success === true){
                            console.log(response.data)
                            this.$cookies.set('uid', user.uid.toString())
                            this.$cookies.set('access_token', user.access_token.toString())
                            this.$cookies.set('refresh_token', user.refresh_token.toString())
                            this.$cookies.set('username', user.username.toString())
                            this.$cookies.set('email', user.email.toString())
                            location.reload()
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

                if(res.reg_email === "" || res.reg_password === "" || res.reg_username === ""){
                    this.flashMessage.error({title: 'Register Error', message: "All Fields must be filled"});
                    return
                }
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
                            this.$cookies.set('uid', user.uid.toString())
                            this.$cookies.set('access_token', user.access_token.toString())
                            this.$cookies.set('refresh_token', user.refresh_token.toString())
                            this.$cookies.set('username', user.username.toString())
                            this.$cookies.set('email', user.email.toString())
                            location.reload()
                        }
                    }
                ).catch(
                    error => {
                        let err = error.response.data.errors.message
                        console.log(err)
                        this.flashMessage.error({title: 'Register Error', message: err});
                    }
                )
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