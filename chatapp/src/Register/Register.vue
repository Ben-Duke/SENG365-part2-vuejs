<template>
    <div>
        Register
    </div>
</template>

<script>
    export default {
        data(){
          return{
              error:"",
              errorFlag: false,
              users:[]
          }
        },
      mounted: function(){
          this.getUsers();
      },
      methods: {
          getUsers:function(){
            this.$http.get('http://localhost:4941/api/users')
              .then(function(response){
                  this.users = response.data;
              }, function(error){
                this.error = error;
                this.errorFlag = true;
              });
          }
      }
    }
</script>

<style scoped>

</style>
