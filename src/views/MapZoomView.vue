<template>
  <div id="map-zoom"></div>
</template>
<script setup lang="ts">
  import * as d3 from 'd3';
  import { message } from 'ant-design-vue';

  onMounted(() => {
    d3.json(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    ).then((data) => {
      console.log(data);
    });
  });
</script>
