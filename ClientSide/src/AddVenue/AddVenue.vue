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


      <div width="50%">
      <form>


        <label>Venue Name:</label>
        <input v-model="venueName" placeholder="Name of the venue" required class="form-control">
        <label id="venueNameErrorLabel" style="color:red" hidden="true" ref="venueNameErrorLabel"></label>
        <br>
        <label>Category:</label><span style="padding: 5%"></span>
        <br>
        <select id="catDropDown" v-model="selected">
          <option disabled value="">Please select one</option>

        </select>
        <br>
        <label>City:</label>
        <input v-model="city" placeholder="City name" required class="form-control">


        <label id="cityErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Address:</label>
        <input v-model="shortDescription" placeholder="Type your address" required class="form-control">
        <label id="addressErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Short Description:</label>
        <input v-model="shortDescription" placeholder="Type your description" required class="form-control">
        <label id="shortDescriptionErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>
        <br>
        <label>Long Description:</label>
        <input id="password" type="textfield" v-model="longDescription" placeholder="Type your description"  class="form-control" required>
        <label id="LongDescriptionErrorLabel" style="color:red" hidden="true" ref="nameErrorLabel"></label>

        <br>
        <label>Latitude:</label>
        <input v-model="latitude" placeholder="Name of the venue" required class="form-control">
        <label id="latitudeErrorLabel" style="color:red" hidden="true" ref="venueNameErrorLabel"></label>
        <br>
        <label>Longitude:</label>
        <input v-model="longitude" placeholder="Enter latitude" required class="form-control">
        <label id="longitudeErrorLabel" style="color:red" hidden="true" ref="venueNameErrorLabel"></label>
        <br>
        <button class="btn btn-primary" align="center" v-on:click.prevent="post">Submit</button>
      </form>
      </div>
    </div>

</template>

<script>
    export default {

      data(){
        return{
          categories:[],
          selected:'',
          pageName: "AddVenue",
          url:'/users/',
          signedInId: '',
          username:'',
          email:'',
          password:'',
          token:'',
          error: "",
          errorFlag: false,
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
        this.getCategories();
      },
      methods:{
        getCategories: function () {


          this.$http.get('http://localhost:4941/api/v1/categories',
            JSON.stringify({ }))
            .then(function (response) {



              this.categories = response.data;
              console.log("cats are " +  JSON.stringify( this.categories));
              let dropdown = document.getElementById('catDropDown');
              for(let i in this.categories){


                let opt = document.createElement('option');
                opt.appendChild( document.createTextNode(this.categories[i]['categoryName']) );
                opt.value = this.categories[i]['categoryId'];
                dropdown.appendChild(opt);
              }





            }, function (error) {
              console.log("fetching failed");
              this.error = error;
              this.errorFlag = true;

            });
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

</style>
