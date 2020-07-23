import Vue from 'vue';
import App from './App.vue';
import router from './router';

// import ElementUI from 'element-ui';
import { Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import Button from 'element-ui/lib/button';
// import 'element-ui/lib/theme-chalk/button.css';

// Vue.use(ELEMENT);

import './utils/a.js';

Vue.use(Button);

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
