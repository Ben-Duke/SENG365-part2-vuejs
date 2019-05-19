<template>
  <div>

    <div style="padding-left: 20%;">
      <div style=" float:left " >
      <img src="http://www.bruttles.com/layout/images/NoPhotoDefault.png?1323807363">
      </div>
      <div>
        <p id="name">Name: </p>
        <p id="city">City:</p>
        <p id="category">Category: </p>
        <p id="stars">Stars: {{this.stars}}</p>
        <p id="cost">Cost: {{this.cost}} </p>
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
        name:""
      }
    },
    mounted(){
      console.log("Id is "+this.$route.params.id);
      this.getVenue();
      this.getVenues();
    },
    methods: {

      getVenue: function () {
        ///
        ///Change this after
        ///
        this.$http.get('http://localhost:4941/api/v1/venues/'+this.$route.params.id,
          JSON.stringify({
            params: {}//could be useful later for filtering
            ,
          }))
          .then(function (response) {
            //console.log("data size = " + JSON.stringify(  response['data']));
            let data = response.data;
            let name = document.getElementById("name");
            name.innerText += " " + data['venueName']

            let city = document.getElementById("city");
            city.innerText += " " + data['city'];

            let category = document.getElementById("category");
            category.innerText += " " + data['category']['categoryName'];

            //let stars = document.getElementById("stars");
            //stars.innerText += " " + data['stars']['categoryName'];

            let admin = document.getElementById("admin");
            admin.innerText += " " + data['admin']['username'];
            //console.log("Data looks like " + JSON.stringify(data['admin']['username']));

            let address = document.getElementById("address");
            address.innerText += " " + data['address'];

            let shortDesc = document.getElementById("shortDesc");
            shortDesc.innerText += " " + data['shortDescription'];

            let longDesc = document.getElementById("longDesc");
            longDesc.innerText += " " + data['longDescription'];


          }, function (error) {
            console.log("fetching failed");
            this.error = error;
            this.errorFlag = true;

          });
      },
      getVenues: function () {
        this.$http.get('http://localhost:4941/api/v1/venues?'
          ,{'q':this.name,'count':1},)
          .then(function (response) {
            console.log("data single= " + JSON.stringify(response.data));
            this.venues = response.data;


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

</style>
