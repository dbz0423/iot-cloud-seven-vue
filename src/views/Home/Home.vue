<template>
  <div class="home card">
    <!-- <img class="home-bg" src="https://dbz0423.oss-cn-nanjing.aliyuncs.com/welcome.png" alt="welcome" /> -->
    <iframe src="http://localhost:8080/#/" width="100%" height="100%"></iframe>
  </div>
</template>

<script setup lang="ts" name="home"></script>

<style scoped lang="less">
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 0;
  padding-bottom: 0;

  .home-bg {
    width: 100%;
    height: auto;
  }
}
</style>
