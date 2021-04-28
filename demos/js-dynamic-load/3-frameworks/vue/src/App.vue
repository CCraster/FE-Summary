<template>
  <router-view />
  <!-- eslint-disable -->
  <div id="footer">
    <router-link to="/page1">page1</router-link>
    <router-link to="/page2">page2</router-link>
    <!-- <button @click="handleButtonClick">show a alert</button> -->
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body {
  margin: 0;
  padding: 0;
}
#footer {
  bottom: 0;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e64a19;
}

.page {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page1 {
  background-color: #9e9e9e;
}
.page2 {
  background-color: greenyellow;
}
</style>
