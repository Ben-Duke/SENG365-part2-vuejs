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
          <template slot="button-content"><em>User</em></template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>

        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

    <div class="container"><button>Filter 1</button> <button>Filter 2</button> </div>
    <div id="container"class="container"></div>
  <div id="responseDiv"></div>

<!--    <div class  = "row">-->
<!--      <div id="picture" ></div>-->
<!--      <div id="rowinfo">-->
<!--        Name:-->
<!--        <br>-->
<!--        Venue category-->
<!--        <br>-->
<!--        Stars-->
<!--        <br>-->
<!--        Cost:-->
<!--      </div>-->
<!--    </div>-->

  </div>
</template>

<script>
    export default {
      data() {
        return {}
      },
      mounted(){
        this.getVenues();
      },
      methods: {
        getVenues: function () {
          this.$http.get('http://localhost:4941/api/v1/venues?',
            JSON.stringify({
              params: {"city" : "North Pole"}//could be useful later for filtering
              ,
            }))
            .then(function (response) {
             // console.log("data = " + response.data);
              console.log("data size = " + response.data.length);
              let i;
              let container = document.getElementById("container");
              for(i = 0; i < response.data.length; i++){
                //Data of the request but for the index of i
                let data = response.data[i];
                let stars;
                if(data["meanStarRating"] == null){
                  stars = 0.0;
                }else{
                  stars = data["meanStarRating"];
                };

                //create a div
                let venueInfoRow = document.createElement("div");
                venueInfoRow.className += "list-group-item";
                venueInfoRow.innerHTML += "Name: " +  data["venueName"];
                venueInfoRow.innerHTML += "<br>";
                venueInfoRow.innerHTML += "Venue category: " + data["categoryId"];
                venueInfoRow.innerHTML += "<br>";
                venueInfoRow.innerHTML += "Stars: " + stars;
                container.appendChild(venueInfoRow);
                //container.appendChild(document.createElement('br'))

                console.log("Object is " + JSON.stringify(response.data[i]));
              }
             // document.getElementById("responseDiv").innerText = JSON.stringify(response.data[1]);

            }, function (error) {
              console.log("fetching failed");
              this.error = error;
              this.errorFlag = true;

            });
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
</style>
