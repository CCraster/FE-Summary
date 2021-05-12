<template>
  <router-view />
  <!-- eslint-disable -->
  <div id="footer">
    <span><router-link to="/page1">to page1</router-link></span>
    <span><router-link to="/page2">to page2</router-link></span>
    <!-- <span @click="handleButtonClick">show a alert</span> -->
  </div>
  <!-- eslint-enable -->
</template>

<script>
export default {
  name: 'App',
  methods: {
    handleButtonClick() {
      import('@/utils');
    },
  },
};
</script>

<style>
#app {
  height: 100%;
}
a {
  color: white;
  text-decoration: none;
}
</style>
