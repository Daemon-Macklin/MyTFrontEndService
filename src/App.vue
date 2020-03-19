<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand href="/">
          <img src="./assets/logoNav.png" alt="Img">
          MyT
        </b-navbar-brand>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-navbar-nav>
              <b-nav-item v-on:click="logout">Logout</b-nav-item>
            </b-navbar-nav>
          </b-navbar-nav>
      </b-navbar>
  </div>
    <Login v-if="signedIn === false"/>
    <Management v-if="signedIn === true"/>
    <FlashMessage></FlashMessage>
  </div>
</template>

<script>
// import Vue from 'vue'
import Login from './components/Login'
import mytservice from "./services/mytservice";
import Management from "./components/Management";

export default {
  name: 'App',
  components: {Management, Login},
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
      let refresh_token = this.$cookies.get('refresh_token')
      console.log(access_token)
      if (access_token != null && refresh_token != null){
        let current_time = new Date().getTime() / 1000;

        let at_base64 = access_token.split('.')[1]
        let at_decoded = JSON.parse(window.atob(at_base64))

        if (current_time > at_decoded.exp) {
          // Access token is expired
          let rt_base64 = refresh_token.split('.')[1]
          let rt_decoded = JSON.parse(window.atob(rt_base64))
          if (current_time > rt_decoded.exp){
            // Refresh token is expired
            this.flashMessage.error({title: 'Auth Error', message: 'Token Invalid - Please Login Again'})
            this.logout()
          } else {
            console.log("Refreshing Token")
            mytservice.refreshToken(refresh_token)
                    .then(
                            response =>{
                              console.log(response)
                              this.$cookies.set('access_token', response.data.access_token)
                              this.signedIn = true
                            }
                    ).catch(
                    error => {
                      console.log(error)
                    }
            )
          }
        } else {
          console.log("Token is valid")
          this.signedIn = true
          this.user.username = this.$cookies.get('username')
          this.user.email = this.$cookies.get('email')
          this.user.uid = this.$cookies.get('uid')
          this.flashMessage.success({title: 'Verification Successful', message: 'Welcome ' + this.user.username})
        }
      } else {
         console.log("No User logged in")
      }
    },
    logout(){
      console.log("Logout")
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
