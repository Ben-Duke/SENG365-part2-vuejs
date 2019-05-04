<template>
    <div>
        <div v-if="errorFlag" style="color:red;">
            {{error}}
        </div>
      username: "testdudette",
      givenName: "Tammy",
      familyName: "Tester",
      email: "testdudette@gmail.com",
      password: "testing"
        <form style="margin: 20%">
          <div>
            <label>Username:</label>
          <input v-model="username" placeholder="Username">
            <br>
            <label>Given name:</label><span style="padding: 5%"></span><label>Family name:</label>
            <br>
          <input v-model="givenName" placeholder="Given name">

          <input v-model="familyName" placeholder="Family name">
            <br>
            <label>Email:</label>
          <input v-model="email" placeholder="Email">
            <br>
            <label>password:</label>
          <input type="password" v-model="password" placeholder="password">
            <label>Confirm password</label>
            <input type="password" v-model="confirmPassword" placeholder="password">
          </div>
          <button v-on:click.prevent="post">Post it</button>
        </form>

    </div>
</template>

<script>
    export default {
        data(){
          return{
              error: "",
              errorFlag: false,
              user: "",
              username:"",
              givenName:"",
              familyName:"",
              email:"",
              password:"",
              confirmPassword: ""
          }
        },
      mounted: function(){
          this.getUser();

      },
      methods: {
          getUser: function(){
            this.$http.get('http://localhost:4941/api/v1/users/1')
              .then(function(response){
                  this.user = response.data;
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              });
          },
          post: function(){
            console.log("Posting");


            this.$http.post('http://localhost:4941/api/v1/users',
              JSON.stringify({ params: {},
                username: this.username,
                givenName: this.givenName,
                familyName: this.familyName,
                email: this.email,
                password: this.password }))
              .then(function(response){
                console.log(response.data);
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              });
          }
      }
    }
</script>

<style scoped>

</style>
