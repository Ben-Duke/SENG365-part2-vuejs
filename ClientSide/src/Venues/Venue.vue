<template>
  <div>

    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">Venue Hunter</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Venues</b-nav-item>
          <b-nav-item href="#">Reviews</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content" v-if="this.firstName!==''">{{firstName}}</template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#" v-if="this.token === ''" v-on:click="openLogIn()" >Login</b-dropdown-item>
            <b-dropdown-item href="#"  v-on:click="logOut()" >Sign Out</b-dropdown-item>
            <b-dropdown-item href="/register" v-if="this.token !== '' ">Register</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div style="padding-left: 20%;">
      <div style=" float:left " >
      <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
      </div>
      <div>
        <p id="name">Name: </p>
        <p id="city">City:</p>
        <p id="category">Category: </p>
        <p id="stars">Stars: </p>
        <p id="cost">Cost:  </p>
        <p id="admin">Admin: </p>
        <p id="address">Address: </p>
        <p id="shortDesc">Quick Description: </p>
        <p id="longDesc">Detailed Description:</p>
      </div>

      <div id="allPhotos" style="padding-left: 20%; width:70% ">
        <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
        <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
        <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
        <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
        <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
      </div>


      <!-- Trigger/Open The Modal -->
      <button id="myBtn" v-on:click="openLogIn()">Open Modal</button>

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


    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        id:0,
        venues:[],
        cost:0,
        stars:0,
        name:"",
        username:'',
        email:'',
        password:'',
        token:'',
        firstName:''
      }
    },
    mounted(){
      console.log("Id is "+this.$route.params.id);
      console.log("Token is " + localStorage.token)
      this.getVenue();



    },


    methods: {

      getVenue: function () {
        this.$http.get('http://localhost:4941/api/v1/venues/'+this.$route.params.id
          )

          .then(function (response) {
            //console.log("data size = " + JSON.stringify(  response['data']));
            let data = response.data;
            let name = document.getElementById("name");
            this.name = data['venueName'];
            name.innerText += " " + data['venueName']

            let city = document.getElementById("city");
            city.innerText += " " + data['city'];

            let category = document.getElementById("category");
            category.innerText += " " + data['category']['categoryName'];


            let admin = document.getElementById("admin");
            admin.innerText += " " + data['admin']['username'];
            //console.log("Data looks like " + JSON.stringify(data['admin']['username']));

            let address = document.getElementById("address");
            address.innerText += " " + data['address'];

            let shortDesc = document.getElementById("shortDesc");
            shortDesc.innerText += " " + data['shortDescription'];

            let longDesc = document.getElementById("longDesc");
            longDesc.innerText += " " + data['longDescription'];

            this.getVenues();
          }, function (error) {
            console.log("fetching failed");
            this.error = error;
            this.errorFlag = true;

          })


      },
      getVenues: function () {
        console.log("name is"+ this.name);
        this.$http.get('http://localhost:4941/api/v1/venues?count=1&q='+this.name
          )
          .then(function (response) {
            let data=response.data[0];
            console.log("data single= " + JSON.stringify(response.data[0]));


            let stars = document.getElementById("stars");
            stars.innerText += " " + data['meanStarRating'];

            let cost = document.getElementById("cost");
            cost.innerText += " " + data['modeCostRating'];

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
            localStorage.id = response.data['venueId'];
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
