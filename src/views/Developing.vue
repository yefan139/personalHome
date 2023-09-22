<template>
    <div class="error_box">
        <el-empty
            :image="`${assetsUrl}/developing-unsplash.jpg`"
            :image-size="500"
            description="功能正在开发中，敬请期待！"
        />
    </div>
</template>
  
<script setup lang="ts">
    const assetsUrl = window.assetsUrl;
</script>

<style>
</style>
