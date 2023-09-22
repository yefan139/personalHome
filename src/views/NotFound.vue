<template>
    <div class="error_box" :style="{background: `transparent url(${assetsUrl}/404-page.jpg) no-repeat center`, backgroundSize: '100% 100%'}">
    </div>
</template>
  
<script setup lang="ts">
    const assetsUrl = window.assetsUrl;
</script>

<style scoped>
    .error_box {
        width: 100vw;
        height: 100vh;
    }
</style>
  