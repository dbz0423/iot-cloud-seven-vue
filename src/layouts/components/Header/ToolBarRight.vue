<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <!-- <Language id="language" /> -->
      <SearchMenu id="searchMenu" />
      <ThemeSetting id="themeSetting" />
      <Message id="message" />
      <Fullscreen id="fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
    <span class="tenantname">{{ tenantname }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStoreWithOut } from '@/store/modules/app'
import AssemblySize from './components/AssemblySize.vue'
import SearchMenu from './components/SearchMenu.vue'
import ThemeSetting from './components/ThemeSetting.vue'
import Message from './components/Message.vue'
import Fullscreen from './components/Fullscreen.vue'
import Avatar from './components/Avatar.vue'

const appStore = useAppStoreWithOut()
const username = computed(() => appStore.userInfo.username)
const tenantname = computed(() => appStore.userInfo.tenantName)
</script>

<style scoped lang="less">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;

  .header-icon {
    display: flex;
    align-items: center;

    & > * {
      margin-left: 21px;
    }
  }

  .username {
    margin: 0 20px;
    font-size: 15px;
  }

  .tenantname {
    margin: 0 20px;
    font-size: 15px;
  }
}
</style>
