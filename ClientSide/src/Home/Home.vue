<template>
  <div>
    Homepage

    <div style="margin: 2% 0 0 25%; width: 50%">
      <router-link :to="{ path: '/dashboard'}"><button>I just want to browse</button></router-link>
      <br>
      <router-link :to="{ path: '/register'}"><button>Register</button></router-link>
    </div>

  </div>
</template>

<script>
    export default {
        name: "Home"
    }
</script>

<style scoped>

</style>
