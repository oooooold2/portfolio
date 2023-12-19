<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import App from './App.vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import { ConfigProvider as AConfigProvider } from 'ant-design-vue';

  const globalFontSize = ref<number>(14);
  const calcFontSize = () => {
    const { innerWidth, innerHeight } = window;
    document.documentElement.style.fontSize =
      (14 * (innerWidth / innerHeight)) / 1.7 + 'px';
    globalFontSize.value = (14 * (innerWidth / innerHeight)) / 1.7;
  };

  onMounted(() => {
    window.addEventListener('resize', calcFontSize);
    calcFontSize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcFontSize);
  });
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        fontSize: globalFontSize,
      },
    }">
    <app />
  </a-config-provider>
</template>
