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

  </div>

</template>

<script>
    export default {
        data(){
          return{
            url:'/users/',
            signedInId: '',
            username:'',
            email:'',
            password:'',
            token:'',
          }
        },

    mounted(){
      this.token = localStorage.token;
      this.signedInId = localStorage.id;
      this.url += localStorage.id;
      console.log("This "+ this.$route.params.id);
      console.log("signed in " + localStorage.id);
      window.addEventListener("load", function(event) {
        document.getElementById('profile').href = this.url;
      });

    },

      methods:{
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
