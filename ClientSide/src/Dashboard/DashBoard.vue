<template>
  <div> <b-navbar toggleable="lg" type="dark" variant="info">
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
          <b-dropdown-item href="#" v-if="this.firstName==''" onclick="console.log('works')" >login</b-dropdown-item>
          <b-dropdown-item href="#" v-if="this.firstName!==''" v-on:click="logIn()" >Sign Out</b-dropdown-item>
          <b-dropdown-item href="/register" v-if="this.token !== '' ">Register</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>




    <button onclick="window.location.href='/venues'">Venues</button>
    <button onclick="window.location.href='/reviews'">Reviews</button>
  </div>


</template>

<script>

  export default {
    data() {
      return {
        firstName:'',
        token:''
      }
    },
    mounted() {

      if(localStorage.name){
        this.firstName = localStorage.name;
        console.log(localStorage.name);
        console.log(localStorage.token);
        console.log(localStorage.id);
      }


    },
    methods: {
      logOut: function(){
        localStorage.token = '';
        localStorage.id = '';
        localStorage.name = '';
        this.name = '';
        this.token = '';
        window.location.reload()
      },
      logIn: function(){
        console.log("LogIn called");


      }
    }
  }
</script>

<style scoped>

</style>
