<template>

    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/">Venue Hunter</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="/venues">Venues</b-nav-item>

          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->

              <b-dropdown-item id='profile' href="#" v-on:click="toUser" v-if="this.token !== ''" >Profile</b-dropdown-item>
              <b-dropdown-item href="#" v-if="this.token === ''" v-on:click="openLogIn()" >Login</b-dropdown-item>
              <b-dropdown-item href="#" v-if="this.token !== ''" v-on:click="logOut()" >Sign Out</b-dropdown-item>
              <b-dropdown-item href="/register" v-if="this.token == '' ">Register</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>


      <div style="margin: 2% 0 0 25%; width: 50%" class="md-form">
        <!-- The Modal -->
        <div id="myModal" class="modal">

          <!-- Modal content -->
          <div class="modal-content">
            <span class="close">&times;</span>
            <p><label>Username:</label>
              <input v-model="username" placeholder="username">
              <label>Password:</label>
              <input type="password" v-model="password" placeholder="password">
              <br>
              <button style="float:right"  class="btn-primary" v-on:click="logIn()">Log in</button>
            </p>
          </div>

        </div>
        <form>

        <p class="h4 text-center mb-4">Register</p>
        <label>Username:</label>
        <input v-model="username" placeholder="Username" required class="form-control">
        <label id="usernameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Given name:</label><span style="padding: 5%"></span>
        <br>
        <input v-model="givenName" placeholder="Given name" required class="form-control">

        <label>Family name:</label>
        <input v-model="familyName" placeholder="Family name" required class="form-control">

        <label id="givenNameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <label id="familyNameErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
          <br>
        <label>Email:</label>
        <input v-model="email" placeholder="Email" required class="form-control">
        <label id="emailErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Password:</label>
        <input id="password" type="password" v-model="password" placeholder="password"  class="form-control" required>

        <label>Confirm password</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="password" class="form-control" required>
        <label id="passwordErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <label id="confirmPasswordErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <button class="btn btn-primary" align="center" v-on:click.prevent="post">Submit</button>
      </form></div>


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
                localStorage.id = response.data["userId"];
                localStorage.token = response.data["token"];
                localStorage.name = this.givenName;
                console.log("Token is :"+ localStorage.token);
                this.$router.push("/")
              }, function(error){
                console.log("Login failed");
                this.error = error;
                this.errorFlag = true;

              });
          },
          getUser: function(){
            this.$http.get('http://localhost:4941/api/v1/users/'+localStorage.id)
              .then(function(response){
                  this.user = response.data;
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              });
          },
          post: function(){
            console.log("Posting");
            let passwordErrorLabel = document.getElementById("confirmPasswordErrorLabel");
            let password = document.getElementById("password").value;
            let confirmPassword = document.getElementById("confirmPassword").value;
            console.log("Password compare " + password + " vs " + confirmPassword);
            if(password != confirmPassword){
              passwordErrorLabel.hidden=false;
              passwordErrorLabel.innerText = "Password and confirm password needs to match";
            }else{
              if(!this.validate()){
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
                    this.validate(error["statusText"]);

                  });
              }

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



            if(this.username.length < 1){
              usernameErrorText.hidden = false;
              usernameErrorText.innerText = "Username needs to be at least one character";
              valid = true;
            }else{
              if(errorToCheck === "username or email already in use"){
                usernameErrorText.hidden = false;
                usernameErrorText.innerText = "A user looks to be already registered with this username try another or try another email";
                emailErrorText.hidden = false;
                emailErrorText.innerText = "A user looks to be already registered with this email try another or try another username";
              }
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
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(!re.test(String(this.email).toLowerCase())){
              console.log("Error for email");
              emailErrorText.hidden=false;
              emailErrorText.innerText = "Needs to be a valid email";
              valid = false;
            }

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
          },
        openLogIn: function (){
          console.log("Login");
          var modal = document.getElementById("myModal");
          var span = document.getElementsByClassName("close")[0];
          modal.style.display = "block";
          span.onclick = function() {
            modal.style.display = "none";
          }
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          }
        },
        logIn: function (){
          this.$http.post('http://localhost:4941/api/v1/users/login',
            JSON.stringify({ params: {},
              username: this.username,
              email: this.email,
              password: this.password }))
            .then(function(response){
              console.log("Log in response " + JSON.stringify(response.data))



              localStorage.token = response.data["token"];
              localStorage.id = response.data['userId'];
              this.token = localStorage.token;
              this.$http.post('http://localhost:4941/api/v1/users/'+localStorage.id)
                .then(function(response){
                  localStorage.name = response.data['givenName'];
                })
              window.location.reload();
            }, function(error){
              console.log("Error in logging in")
            });
        },
        logOut: function(){
          localStorage.token = '';
          localStorage.id = '';
          localStorage.name = '';
          this.name = '';
          this.token = '';
          window.location.reload()
        },
        toUser: function (){
          this.$router.push('/users/' + localStorage.id);
        }
      }
    }
</script>

<style scoped>
  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 45%;
    top: 0;
    width: 50%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */

  }

  /* Modal Content */
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
  }

  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
</style>
