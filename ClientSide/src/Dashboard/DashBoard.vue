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
          <template slot="button-content"><em>User</em></template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          <b-dropdown-item href="/register">Register</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>


    <button>Venues</button>
    <button>Reviews</button>
  </div>


</template>

<script>
    export default {
        name: "DashBoard"
    }
</script>

<style scoped>

</style>
