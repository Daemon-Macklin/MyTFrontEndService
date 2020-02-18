<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="light" variant="success">
        <b-navbar-brand href="/">
          <img src="./assets/logoNav.png" alt="Img">
          MyT
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-navbar-nav>
              <b-nav-item v-on:click="logout">Logout</b-nav-item>
            </b-navbar-nav>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
  </div>
    <User v-if="signedIn === false"/>
    <router-view v-if="signedIn === true"/>
    <FlashMessage></FlashMessage>
  </div>
</template>

<script>
import Vue from 'vue'
import User from './components/User'

Vue.use(User)

import mytservice from "./services/mytservice";

export default {
  name: 'App',
  components: {User},
  data() {
    return {
      signedIn: false,
      user : {
        username: null,
        email: null,
        uid: null
      }
    }
  },
  created() {
    this.isSignedIn()
    },
  methods: {

    isSignedIn(){
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
          this.user.username = this.$cookies.get('username')
          this.user.email = this.$cookies.get('email')
          this.user.uid = this.$cookies.get('uid')
          this.flashMessage.success({title: 'Login Successful', message: 'Welcome ' + this.user.username})
        }
      } else {
         console.log("No User logged in")
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
