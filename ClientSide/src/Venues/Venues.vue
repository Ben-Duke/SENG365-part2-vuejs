<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

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

    <table>

      <tr>
        <input v-model="userEntry" placeholder="Search on">
        <select v-model="sortBy">
          <option disabled value="">Sort by</option>
          <option>None</option>
          <option>Sort by highest star rating</option>
          <option>Sort by lowest star rating</option>
          <option>Sort by highest cost rating</option>
          <option>Sort by lowest cost rating</option>
          <option>Sort by closest</option>
          <option>Sort by farthest</option>
        </select>
        <span>Selected: {{sortBy}} </span>
        <input v-model="maxCost" placeholder="Search for venues less than ">

        <button v-on:click="this.getVenues">Search</button>
      </tr>
    </table>

    <div id="container"class="container"></div>
  <div id="responseDiv"></div>
    <table class="table" id="venueTable">
      <thead>

      <tr>
        <th scope="col"></th>
        <th scope="col">Venue name</th>
        <th scope="col">Category <select id="catDropDown" v-model="selected">
          <option disabled value="">Please select one</option>

        </select></th>
        <th scope="col">City <input type="text" id="citytext" v-model="city"></th>
        <th scope="col">Description</th>
        <th scope="col">Latitude</th>
        <th scope="col">Longitude</th>
        <th scope="col">Star Rating</th>
        <th scope="col">Cost Rating</th>
      </tr>
      </thead>
      <tbody id="rowTarget">
      <div id="aimHere"></div>
      </tbody>
    </table>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          userEntry: '',
          categories: [],
          firstName:'',
          token:'',
          city:"",
          selected:"",
          sortBy:"",
          minStar:"",
          maxCost:"",
          token:'',
          username:'',
          password:''
        }
      },
      mounted() {
        this.token = localStorage.token;
        this.getCategoriesDefault();
        console.log("User Id = " + localStorage.id)
          this.firstName = localStorage.name;
          this.token = localStorage.token;
          console.log(localStorage.name);
          console.log(localStorage.token);
          console.log(localStorage.id);
          window.addEventListener("load", function(event) {
            document.getElementById('profile').href = '/users/'+localStorage.id;
          });

      },
      methods: {
        getVenuesDefault: function () {
          console.log("VenuesDefault");
          let urlParams = '';

          console.log('url is '+ urlParams);
          //sortBy=DISTANCE&reverseSort=true&myLatitude=-43.5216384&myLongitude=172.57758719999998
          this.$http.get('http://localhost:4941/api/v1/venues?'+ 'sortBy=COST_RATING&reverseSort=true')

            .then(function (response) {


              let table = document.getElementById("venueTable");
              for(let i = table.rows.length - 1; i > 0; i--)
              {
                table.deleteRow(i);
              }


              for (let i = 0; i < response.data.length; i++) {
                //Data of the request but for the index of i
                let data = response.data[i];
                let stars;
                if (data["meanStarRating"] == null) {
                  stars = 0.0;
                } else {
                  stars = data["meanStarRating"];
                }

                let cost;
                if (data["modeCostRating"] == null) {
                  cost = "-";
                } else {
                  cost = "$".repeat( data["modeCostRating"]);
                }

                let table = document.getElementById("venueTable");
                //create a div
                let venueInfoRow = document.createElement("tr");
                let venuepicture = document.createElement("span");

                let venuePicture = document.createElement("td");
                let picture = document.createElement('img');


                if(data['primaryPhoto']){
                  picture.setAttribute('src', 'http://localhost:4941/api/v1/venues/' + data['venueId'] + "/photos/"+ data['primaryPhoto'] );

                }else{
                  //console.log("No image for " + data["venueName"] );
                  picture.setAttribute('src', 'http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363');
                }

                picture.setAttribute('alt', 'No Picture');
                picture.setAttribute('height', '100');
                picture.setAttribute('width', '100');
                venuePicture.appendChild(picture);
                venueInfoRow.appendChild(venuePicture);


                let venueName = document.createElement("td");
                venueName.innerText = data["venueName"];
                venueInfoRow.appendChild(venueName);

                let venueCategory = document.createElement("td");
                let catId = (data["categoryId"]);
                venueCategory.innerText = this.categories[catId-1]['categoryName'] ;
                venueInfoRow.appendChild(venueCategory);

                let venueCity = document.createElement("td");
                venueCity.innerText = data["city"];
                venueInfoRow.appendChild(venueCity);

                let venueDescription = document.createElement("td");
                venueDescription.innerText = data["shortDescription"];
                venueInfoRow.appendChild(venueDescription);

                let venueLatitude = document.createElement("td");
                venueLatitude.innerText = data["latitude"];
                venueInfoRow.appendChild(venueLatitude);

                let venueLongitude = document.createElement("td");
                venueLongitude.innerText = data["longitude"];
                venueInfoRow.appendChild(venueLongitude);

                let venueStarRating = document.createElement("td");
                venueStarRating.innerText = stars;
                venueInfoRow.appendChild(venueStarRating);

                let venueCostRating = document.createElement("td");
                venueCostRating.innerText = cost;
                venueInfoRow.appendChild(venueCostRating);

                venueInfoRow.onclick = function() {
                  window.location.href = "/venues/"+ data['venueId'];
                }
                table.appendChild(venueInfoRow);

              }


            }, function (error) {
              console.log("fetching failed");
              this.error = error;
              this.errorFlag = true;

            });


        },
        getVenues: function () {

          let urlParams = '';

          if(this.sortBy === 'Sort by distance'){
            navigator.geolocation.getCurrentPosition(function(location) {
              console.log(location.coords.latitude);
              console.log(location.coords.longitude);
              console.log(location.coords.accuracy);
              urlParams += "sortBy=DISTANCE" + '&myLatitude=' + location.coords.latitude
                + '&myLongitude=' + location.coords.longitude;
            });


          }else if(this.sortBy === 'Sort by highest star rating'){
              urlParams += 'sortBy=STAR_RATING' + "&"
          }
          else if(this.sortBy === 'Sort by lowest star rating'){
            urlParams += 'sortBy=STAR_RATING&reverseSort=true' + "&"
          }
          else if(this.sortBy === 'Sort by highest cost rating'){
            urlParams += 'sortBy=COST_RATING&reverseSort=true'+ "&"
          }
          else if(this.sortBy === 'Sort by lowest cost rating'){
            urlParams += 'sortBy=COST_RATING' + "&"
          }
          else if(this.sortBy === 'Sort by closest'){
            navigator.geolocation.getCurrentPosition(function(location) {
              console.log("closest");
               console.log(location.coords.latitude);
              console.log(location.coords.longitude);
              console.log(location.coords.accuracy);
              urlParams += '&sortBy=DISTANCE&myLatitude=' + location.coords.latitude+ '&myLongitude='+location.coords.longitude+'&';
            })


          }
          else if(this.sortBy === 'Sort by farthest'){
            navigator.geolocation.getCurrentPosition(function(location) {
              console.log("far");
              // console.log(location.coords.latitude);
              // console.log(location.coords.longitude);
              // console.log(location.coords.accuracy);

              console.log('url is '+ urlParams);
              urlParams += '&sortBy=DISTANCE&reverseSort=true&myLatitude=' + location.coords.latitude+ '&myLongitude='+location.coords.longitude+'&';
            })


          }

          if(this.maxCost != ''){
            urlParams += 'maxCostRating=' + number.parse(this.maxCost) + "&"
          }

          if(this.selected !== ''){
            urlParams+= "categoryId="+this.selected+"&";
          }
          if(this.city !== ""){
            urlParams += "city=" + this.city+"&";
          }
          else if(this.userEntry !==''){
            urlParams += 'q='+this.userEntry+"&";
          }


          setTimeout(() => {
            console.log('url is '+ urlParams);
            this.$http.get('http://localhost:4941/api/v1/venues?' + urlParams)
              .then(function (response) {


                let table = document.getElementById("venueTable");
                for (let i = table.rows.length - 1; i > 0; i--) {
                  table.deleteRow(i);
                }


                for (let i = 0; i < response.data.length; i++) {
                  //Data of the request but for the index of i
                  let data = response.data[i];
                  console.log(JSON.stringify(data));
                  let stars;
                  if (data["meanStarRating"] == null) {
                    stars = 3;
                  } else {
                    stars = data["meanStarRating"];
                  }

                  let cost;
                  if (data["modeCostRating"] == null) {
                    cost = "Free";
                  } else {
                    cost = data["modeCostRating"];
                  }

                  let table = document.getElementById("venueTable");
                  //create a div
                  let venueInfoRow = document.createElement("tr");
                  let venuepicture = document.createElement("span");

                  let venuePicture = document.createElement("td");
                  let picture = document.createElement('img');


                  if (data['primaryPhoto']) {
                    picture.setAttribute('src', 'http://localhost:4941/api/v1/venues/' + data['venueId'] + "/photos/" + data['primaryPhoto']);

                  } else {
                    //console.log("No image for " + data["venueName"] );
                    picture.setAttribute('src', 'http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363');
                  }

                  picture.setAttribute('alt', 'No Picture');
                  picture.setAttribute('height', '100');
                  picture.setAttribute('width', '100');
                  venuePicture.appendChild(picture);
                  venueInfoRow.appendChild(venuePicture);


                  let venueName = document.createElement("td");
                  venueName.innerText = data["venueName"];
                  venueInfoRow.appendChild(venueName);

                  let venueCategory = document.createElement("td");
                  let catId = (data["categoryId"]);
                  venueCategory.innerText = this.categories[catId - 1]['categoryName'];
                  venueInfoRow.appendChild(venueCategory);

                  let venueCity = document.createElement("td");
                  venueCity.innerText = data["city"];
                  venueInfoRow.appendChild(venueCity);

                  let venueDescription = document.createElement("td");
                  venueDescription.innerText = data["shortDescription"];
                  venueInfoRow.appendChild(venueDescription);

                  let venueLatitude = document.createElement("td");
                  venueLatitude.innerText = data["latitude"];
                  venueInfoRow.appendChild(venueLatitude);

                  let venueLongitude = document.createElement("td");
                  venueLongitude.innerText = data["longitude"];
                  venueInfoRow.appendChild(venueLongitude);

                  let venueStarRating = document.createElement("td");
                  venueStarRating.innerText = stars;
                  venueInfoRow.appendChild(venueStarRating);

                  let venueCostRating = document.createElement("td");
                  venueCostRating.innerText = cost;
                  venueInfoRow.appendChild(venueCostRating);

                  venueInfoRow.onclick = function() {
                    window.location.href = "/venues/"+ data['venueId'];
                  }
                  table.appendChild(venueInfoRow);
                  //console.log("Object is " + JSON.stringify(response.data[i]));
                }


              }, function (error) {
                console.log("fetching failed");
                this.error = error;
                this.errorFlag = true;

              });

          }, 100)
        },
        getCategoriesDefault: function () {


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
              let opt = document.createElement('option');
              opt.appendChild( document.createTextNode('None') );
              opt.value = '';
              dropdown.appendChild(opt);

              this.getVenuesDefault();
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
  #container {

  }
  .row {
    margin-left: 10%;
    width: 80%;
    background-color: teal;
    overflow: hidden;
  }
  #rowinfo {

    background-color: teal;
    overflow: hidden;
  }
  #picture{
    float:left;
    background-color: green;
    width: 100px;
    padding-top: 50px;
    padding-right: 30px;
    padding-bottom: 50px;
    padding-left: 80px;
  }
  .checked {
    color: orange;
  }

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
