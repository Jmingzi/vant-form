<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  html {
    font-family: PingFang SC, Helvetica Neue, Arial, sans-serif;
    background: #f7f8f9;
  }
  .create-area {
    font-size: 14px;
    background-color: #f7f7f7;
    min-height: 100vh;
    // padding: 20px;
    padding-bottom: 70px;
    &__box {
      background-color: #fff;
      // border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
      .van-cell {
        background-color: transparent;
      }
    }
    &__btn {
      box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.05);
    }
  }
</style>
