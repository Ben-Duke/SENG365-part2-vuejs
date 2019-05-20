<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
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
          <template slot="button-content"><em>User</em></template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>

        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

    <div class="container"><input v-model="userEntry" placeholder="Search on"><button v-on:click="this.getVenues">Search</button> </div>
    <div id="container"class="container"></div>
  <div id="responseDiv"></div>
    <table class="table" id="venueTable">
      <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Venue name</th>
        <th scope="col">Category</th>
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
          userLatitude: 0,
          userLongitude:0,
          city:""
        }
      },
      mounted() {
        this.getCategories();
        //this.getVenues();
      },
      methods: {
        getVenues: function () {

          let urlParams = '';

          if(this.city !== ""){
            urlParams += "city=" + this.city;
          }
          else if(this.userEntry !==''){
            urlParams += 'q='+this.userEntry;
          }

          this.$http.get('http://localhost:4941/api/v1/venues?'+ urlParams)
            .then(function (response) {

              ///Refreshing the table here
              console.log(document.getElementById('rowTarget'));
              //document.getElementById('rowTarget').innerHTML='';


              let table = document.getElementById("venueTable");
//or use :  var table = document.all.tableid;
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
                  cost = data["modeCostRating"];
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
                  console.log("No image for " + data["venueName"] );
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

                table.appendChild(venueInfoRow);
                console.log("Object is " + JSON.stringify(response.data[i]));
              }


            }, function (error) {
              console.log("fetching failed");
              this.error = error;
              this.errorFlag = true;

            });


        },
        getCategories: function () {
          this.$http.get('http://localhost:4941/api/v1/categories',
            JSON.stringify({ }))
            .then(function (response) {
              this.categories = response.data;
              //console.log("category size  = " + this.categories);
              // console.log("data = " + response.data);
              //console.log("data = " + JSON.stringify(response.data));
              this.getVenues();
            }, function (error) {
              console.log("fetching failed");
              this.error = error;
              this.errorFlag = true;

            });
        },

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
</style>
