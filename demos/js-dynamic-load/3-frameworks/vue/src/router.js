import { createWebHistory, createRouter } from 'vue-router';

// import Home from '@/pages/Home.vue';
// import Page1 from '@/pages/Page1.vue';
// import Page2 from '@/pages/Page2.vue';

// const Home = () => import('@/pages/Home.vue');
// const Page1 = () => import('@/pages/Page1.vue');
// const Page2 = () => import('@/pages/Page2.vue');

const Home = import('@/pages/Home.vue');
const Page1 = require.ensure([], (require) => {
  return require('@/pages/Page1.vue').default;
});
const Page2 = () => import('@/pages/Page2.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/page1',
    name: 'page1',
    component: Page1,
  },
  {
    path: '/page2',
    name: 'page2',
    component: Page2,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
