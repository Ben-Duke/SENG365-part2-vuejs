<template>
    <div id="app">

      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/venues">Venue Hunter</b-navbar-brand>

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
      <h1 class="display-4" style="width: 100%;text-align: center;" >{{this.pageName}}</h1>
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


      {
      "venueName": "Dank grotto",
      "categoryId": 1,
      "city": "North Pole",
      "shortDescription": "The Dankest place on earth.",
      "longDescription": "Especially good in the summer months.",
      "address": "1 North Pole",
      "latitude": -45,
      "longitude": 0
      }

      <form>

        <p class="h4 text-center mb-4">Register</p>
        <label>Venue Name:</label>
        <input v-model="venueName" placeholder="Name of the venue" required class="form-control">
        <label id="venueNameErrorLabel" style="color:red" hidden="true" ref="venueNameErrorLabel"></label>
        <br>
        <label>Category:</label><span style="padding: 5%"></span>
        <br>
        <input v-model="categoryId" placeholder="Category name" required class="form-control">

        <label>City:</label>
        <input v-model="city" placeholder="City name" required class="form-control">

        <label id="cityErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>address:</label>
        <input v-model="shortDescription" placeholder="Email" required class="form-control">
        <label id="emailErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Short Description:</label>
        <input v-model="shortDescription" placeholder="Email" required class="form-control">
        <label id="emailErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Password:</label>
        <input id="password" type="password" v-model="password" placeholder="password"  class="form-control" required>

        <br>
        <button class="btn btn-primary" align="center" v-on:click.prevent="post">Submit</button>
      </form>
    </div>

</template>

<script>
    export default {

      data(){
        return{
          pageName: "AddVenue",
          url:'/users/',
          signedInId: '',
          username:'',
          email:'',
          password:'',
          token:'',

          venueName:'',
          categoryId:'',
          city:'',
          shortDescription: "",
          longDescription: "",
          address: "",
          latitude: '',
          longitude: ''
        }
      },
      mounted(){
        this.token = localStorage.token;
        this
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

</style>
