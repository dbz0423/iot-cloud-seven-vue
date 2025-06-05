<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-form">
        <div class="login-logo">
          <div class="login-icon-box">
            <img class="login-icon" src="@/assets/images/new-logo.png" />
          </div>
          <h2 class="logo-text"> 智能物联网管理平台 </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from './components/LoginForm.vue'
import SwitchDark from '@/components/SwitchDark/index.vue'
</script>

<style scoped lang="less">
@import './index.less';
</style>
