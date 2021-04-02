<template>
  <router-view />
</template>

<script>
export default {
  created() {
    this.axios.interceptors.response.use((response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.request.status === 401 && error.config && !error.config.__isRetryRequest) {
        // if you ever get an unauthorized, logout the user
          this.$store.dispatch("AUTH_LOGOUT");
        // you can also redirect to /login if needed !
          this.$router.push("/login");
        }
      return Promise.reject(error);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
