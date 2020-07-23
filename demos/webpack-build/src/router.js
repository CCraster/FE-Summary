import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import View1 from '@/components/View1';
import View2 from '@/components/View2';
import View3 from '@/components/View3';
import View4 from '@/components/View4';
import View5 from '@/components/View5';

/********** 按需加载 **********/
// const View1 = () => import('@/components/View1');
// const View2 = () => import('@/components/View2');
// const View3 = () => import('@/components/View3');
// const View4 = () => import('@/components/View4');
// const View5 = () => import('@/components/View5');

Vue.use(VueRouter);

let routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/view1',
        component: View1,
      },
      {
        path: '/view2',
        component: View2,
      },
      {
        path: '/view3',
        component: View3,
      },
      {
        path: '/view4',
        component: View4,
      },
      {
        path: '/view5',
        component: View5,
      },
    ],
  },
];

let router = new VueRouter({
  routes,
});

export default router;
