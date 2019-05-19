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
      }
    }


  }
</script>

<style scoped>

</style>
