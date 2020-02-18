<template>
  <div id="app">
    <div id="section" class="ui raised centered segment">
      <p>
        This home page will need a lot more work...
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  user : {
    username: null,
    email: null,
    uid: null
  },
  created() {
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
  margin-left: 10%;
  margin-right: 10%;
}
</style>
