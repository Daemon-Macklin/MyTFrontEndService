<template>
  <div id="app">
    <div id="section" class="ui raised centered segment">
        <Management/>
    </div>
  </div>
</template>

<script>
    import Management from "./Management";

export default {
  name: 'Home',
    components: {Management},
    data() {
      return {
          user: {
              username: null,
              email: null,
              uid: null
          }
      }
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    getUserData() {
      this.user.username = this.$cookies.get('username')
      this.user.email = this.$cookies.get('email')
      this.user.uid = this.$cookies.get('uid')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#section {
  margin-left: 5%;
  margin-right: 5%;
}
</style>
