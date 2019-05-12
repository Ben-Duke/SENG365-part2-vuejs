<template>

    <div>
      <div id="Test"></div>
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
          <input v-model="username" placeholder="Username" required>
            <br>
            <label>Given name:</label><span style="padding: 5%"></span><label>Family name:</label>
            <br>
          <input v-model="givenName" placeholder="Given name" required>

          <input v-model="familyName" placeholder="Family name" required>
            <label id="nameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel">Please use only use alpha numeric characters</label>
            <br>
            <label>Email:</label>
          <input v-model="email" placeholder="Email" required>
            <br>
            <label>password:</label>
          <input type="password" v-model="password" placeholder="password" required>
            <label>Confirm password</label>
            <input type="password" v-model="confirmPassword" placeholder="password" required>
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
              confirmPassword: "",
              errorId :"",
              token:''
          }
        },
      mounted(){

          if (localStorage.token) {
          this.token = localStorage.token;
          console.log("Working");
          this.getUser();
          this.login();
        }
      },
      watch: {
        token(newtoken) {
          localStorage.token = newtoken;
        }
      }



      ,
      methods: {
          login: function(){
            this.$http.post('http://localhost:4941/api/v1/users/login',
              JSON.stringify({ params: {},
                username: this.username,
                email: this.email,
                password: this.password }))
              .then(function(response){
                console.log(response.data);
                localStorage.token = response.data["token"];
                console.log("Token is :"+localStorage.token);
              }, function(error){
                this.error = error;
                this.errorFlag = true;

              });
          },
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
                this.login();
              }, function(error){
                this.error = error;
                this.errorFlag = true;
                //this.reqBody = JSON.parse(error);

                this.validate(error["statusText"]);

              });
          },
          validate: function(error){
            console.log("error is :" + error);

            let nameErrorText = document.getElementById("nameErrorLabel");


            nameErrorText.hidden=false;
            nameErrorText.innerText = "Names need to be at least one character";
          }
      }
    }
</script>

<style scoped>

</style>
