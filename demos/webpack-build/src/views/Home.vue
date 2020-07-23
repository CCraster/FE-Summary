<template>
  <div class="home">
    <div class="top">
      <div class="menu-wrapper">
        <div
          v-for="(menu, index) in menus"
          :key="index"
          @click="goView(menu.path)"
          :style="{ background: menu.bgColor }"
        >
          {{ menu.label }}
        </div>
      </div>
      <div class="router-view">
        <router-view />
      </div>
    </div>
    <div class="bottom">
      <button @click="$router.push('/')">TO根目录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menus: [
        {
          label: 'View1',
          path: 'view1',
          bgColor: '#e74c3c',
        },
        {
          label: 'View2',
          path: 'view2',
          bgColor: '#8e44ad',
        },
        {
          label: 'View3',
          path: 'view3',
          bgColor: '#3498db',
        },
        {
          label: 'View4',
          path: 'view4',
          bgColor: '#16a085',
        },
        {
          label: 'View5',
          path: 'view5',
          bgColor: '#f39c12',
        },
      ],
    };
  },
  methods: {
    goView(path) {
      console.log(`now is go ${path}`);
      this.$router.push(path);
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    .menu-wrapper {
      margin-right: 10px;
      > div {
        width: 60px;
        padding: 5px 10px;
        margin-bottom: 5px;
        border-radius: 2px;
        color: #fff;
        display: flex;
        justify-content: center;
        cursor: pointer;
      }
    }
    .router-view {
      width: 400px;
      height: 160px;
      background: #fafafa;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      box-shadow: 0px 0px 5px #999;
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    background-color: #fafafa;
  }
}
</style>
