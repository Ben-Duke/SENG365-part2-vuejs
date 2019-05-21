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

    <div style="padding-left: 20%;">
      <div style=" float:left " >
      <img id="primaryPhoto" src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
      </div>
      <div>
        <p id="name">Name: </p>
        <p id="city">City:</p>
        <p id="category">Category: </p>
        <p id="stars">Stars: </p>
        <p id="cost">Cost:  </p>
        <p id="admin">Admin: <a id="userLink"></a></p>
        <p id="address">Address: </p>
        <b-button id="moreButton" v-on:click="changeLength()">More</b-button>
        <p id="shortDesc">Description: </p>

      </div>

      <div id="allPhotos" style="padding-left: 20%; width:70% ">
        users
      </div>




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
        firstName:'',
        description: 'short',
        long:'',
        short:''
      }
    },
    mounted(){
      console.log("Id is "+this.$route.params.id);
      this.token = localStorage.token;
      this.firstName = localStorage.name;
      console.log("Name" +localStorage.name);
      this.getVenue();

    },


    methods: {
      changeLength: function(){
        let target = document.getElementById("shortDesc");
        if(this.description === 'short'){
          target.innerText = "Description: " + this.short + " " + this.long;
          document.getElementById('moreButton').innerText="less"
          this.description = 'long'
        }else if(this.description === 'long'){
          target.innerText = "Description: " + this.short;
          this.description = 'short';
          document.getElementById('moreButton').innerText="more"
        }
      },
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

            let moreButton = document.getElementById('moreButton');




            let admin = document.getElementById("userLink");

            admin.title = data['admin']['username'];

            admin.href= '/users/'+  data['admin']['userId'];

            admin.innerText = data['admin']['username'];

            //console.log("Data looks like " + JSON.stringify(data['admin']['username']));

            let address = document.getElementById("address");
            address.innerText += " " + data['address'];

            this.short = data['shortDescription'];
            this.long = data['longDescription'];

            let shortDesc = document.getElementById("shortDesc");
            shortDesc.innerText += " " + data['shortDescription'];



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
            cost.innerText += "$".repeat(data['modeCostRating']);

            let picture = document.getElementById('primaryPhoto');

            console.log("primary " + data["primaryPhoto"]);
            if(data['primaryPhoto']){
              picture.setAttribute('src', 'http://localhost:4941/api/v1/venues/' + data['venueId'] + "/photos/"+ data['primaryPhoto'] );

            }else{
              console.log("No image for " + data["venueName"] );
              picture.setAttribute('src', 'http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363');
            }
            picture.setAttribute('height', '250');
            picture.setAttribute('width', '250');
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
