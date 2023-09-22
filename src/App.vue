<script setup lang="ts">
import {ref} from 'vue';
import { RouterView } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 是否显示返回顶部
const showBackToTop = ref(false);

// 返回顶部
const backToTop = () => {
    window.scrollTo({top: 0, behavior: "smooth"});
};

// 添加窗口滚动事件
window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 150 || document.body.scrollTop > 150) {
        showBackToTop.value = true;
    } else {
        showBackToTop.value = false;
    }
})
</script>

<template>
    <el-config-provider :locale="zhCn">
        <!-- 子级路由 -->
        <RouterView />

        <!-- 返回顶部 -->
        <div v-if="showBackToTop" class="back-to-top iconfont icon-up_to_top" title="返回顶部" @click="backToTop"></div>
    </el-config-provider>
</template>

<style scoped>
    .back-to-top {
        position: fixed;
        right: 60px;
        bottom: 100px;
        width: 40px;
        height: 40px;
        font-size: 30px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 9px 0 rgba(0,0,0,0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /* header {
        line-height: 1.5;
        max-height: 100vh;
    }

    .logo {
        display: block;
        margin: 0 auto 2rem;
    }

    nav {
        width: 100%;
        font-size: 12px;
        text-align: center;
        margin-top: 2rem;
    }

    nav a.router-link-exact-active {
        color: var(--color-text);
    }

    nav a.router-link-exact-active:hover {
        background-color: transparent;
    }

    nav a {
        display: inline-block;
        padding: 0 1rem;
        border-left: 1px solid var(--color-border);
    }

    nav a:first-of-type {
        border: 0;
    }

    @media (min-width: 1024px) {
        header {
            display: flex;
            place-items: center;
            padding-right: calc(var(--section-gap) / 2);
        }

        .logo {
            margin: 0 2rem 0 0;
        }

        header .wrapper {
            display: flex;
            place-items: flex-start;
            flex-wrap: wrap;
        }

        nav {
            text-align: left;
            margin-left: -1rem;
            font-size: 1rem;

            padding: 1rem 0;
            margin-top: 1rem;
        }
    } */
</style>
