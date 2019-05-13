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
            <label id="usernameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
            <br>
            <label>Given name:</label><span style="padding: 5%"></span><label>Family name:</label>
            <br>
          <input v-model="givenName" placeholder="Given name" required>

          <input v-model="familyName" placeholder="Family name" required>
            <label id="givenNameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
            <label id="familyNameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
            <br>
            <label>Email:</label>
          <input v-model="email" placeholder="Email" required>
            <label id="emailErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
            <br>
            <label>Password:</label>
          <input id="password" type="password" v-model="password" placeholder="password" required>

            <label>Confirm password</label>
            <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="password" required>
            <label id="passwordErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
            <label id="confirmPasswordErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
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
      },

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
                this.$router.push("Home");
              }, function(error){
                console.log("Login failed");
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
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            console.log("Password compare " + password + " vs " + confirmPassword);
            if(this.validate()){
              console.log("passwords need to match");
            }
            else{
              this.$http.post('http://localhost:4941/api/v1/users',
                JSON.stringify({ params: {},
                  username: this.username,
                  givenName: this.givenName,
                  familyName: this.familyName,
                  email: this.email,
                  password: this.password }))
                .then(function(response){
                  console.log(response.data);
                  console.log("Yeet");
                  this.login();
                }, function(error){

                  this.error = error;
                  console.log(this.error["statusText"]);
                  this.errorFlag = true;
                  //this.reqBody = JSON.parse(error);

                  this.validate(error["statusText"]);

                });
            }



          },
          validate: function(error = ""){
            let valid = false;
            let index = error.indexOf(":")+2;
            let errorToCheck = error.substr(index);
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            let usernameErrorText = document.getElementById("usernameErrorLabel");
            let givenNameErrorText = document.getElementById("givenNameErrorLabel");
            let familyNameErrorText = document.getElementById("givenNameErrorLabel");
            let passwordErrorText = document.getElementById("passwordErrorLabel");
            let emailErrorText = document.getElementById("emailErrorLabel");
            console.log("error is :" + error);
            //data.email must be a valid email address
            //let nameErrorText = document.getElementById("nameErrorLabel");


            if(this.username.length < 1){
              usernameErrorText.hidden = false;
              usernameErrorText.innerText = "username needs to be at least one character";
              valid = true;
            }

            if(this.givenName.length < 1){
              givenNameErrorText.hidden=false;
              givenNameErrorText.innerText = "Names need to be at least one character";
              valid = false;
            }

            if(this.familyName.length < 1){
              familyNameErrorText.hidden=false;
              familyNameErrorText.innerText = "Names need to be at least one character";
              valid = false;
            }
            if(this.email.length < 1){
              emailErrorText.hidden=false;
              emailErrorText.innerText = "Needs to be a valid email";
              valid = false;
            }
            console.log("Error to check:" + errorToCheck);

            if(errorToCheck === "data.email should match format \"email\""){
              emailErrorText.hidden=false;
              emailErrorText.innerText = "Needs to be a valid email address";
              valid = false;
            }

            if(error["Bad Request"] === "data.email must be a valid email address"){
              emailErrorText.hidden=false;
              emailErrorText.innerText = "Needs to be a valid email address";
              valid = false;
            }

            if(this.password === ""){
              passwordErrorText.hidden = false;
              passwordErrorText.innerText = "Password cannot be blank";
              valid = false;
            }else{
              if(password != confirmPassword){
                passwordErrorText.hidden=false;
                passwordErrorText.innerText = "Passwords need to match";
                valid = false;
              }
            }

            return valid;
          }
      }
    }
</script>

<style scoped>

</style>
