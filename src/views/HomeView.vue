<script setup lang="ts">
    import {reactive, ref, watch} from 'vue';
    import {useRoute, useRouter, type RouteLocationNormalized} from 'vue-router';
    import type {navType} from './type/interface';

    const assetsUrl = window.assetsUrl;
    const router = useRouter();
    const route = useRoute();

    const url = `${assetsUrl}/avatar.jpg`; // 顶部导航背景图
    const hoverAcitveIndex = ref(0); // 鼠标移动到导航的下标
    const curAcitveIndex = ref(0); // 导航当前选中的下标
    // 导航列表信息
    const navList = reactive<navType[]>([
        {
            name: 'Home',
            path: "/home/homeCenter",
            icon: 'icon-home',
            bg: "daniel-cross-the-road.jpg"
        },
        {
            name: 'Email',
            path: "/home/email",
            icon: 'icon-email',
            bg: "daniel-one-person-journey.jpg"
        },
        {
            name: 'Message',
            path: "/home/message",
            icon: 'icon-message',
            bg: "lukasz-sea.jpg"
        },
        {
            name: 'Like',
            path: "/home/like",
            icon: 'icon-like',
            bg: "eric-coffee.jpg"
        },
        {
            name: 'Profile',
            path: "/home/profile",
            icon: 'icon-profile',
            bg: "daniele-paddy.jpg"
        }
    ]);
    
    // 路径变化设置菜单选择状态
    const setActiveIndex = (routeObj: RouteLocationNormalized) => {
        navList.some((item, index) => {
            if (item.path === routeObj.path) {
                hoverAcitveIndex.value = index;
                curAcitveIndex.value = index;
                return true;
            }
            return false;
        })
    }

    // 初始加载设置菜单选择状态
    setActiveIndex(route);

    // 监听路由变化
    watch(route, (newRoute) => {
        setActiveIndex(newRoute);
    })

    // 鼠标进入nav
    const mouseenterNav = (num: number) => {
        hoverAcitveIndex.value = num;
    };
    // 鼠标移出nav
    const mouseleaveNav = () => {
        hoverAcitveIndex.value = curAcitveIndex.value;
    };
    // 点击nav
    const handleNav = (num: number, row: navType) => {
        hoverAcitveIndex.value = num;
        curAcitveIndex.value = num;
        router.push(row.path)
    };
</script>

<template>
    <div class="full_page">
        <div class="head_box" :style="{background: `transparent url(${assetsUrl}/spaceBg.jpg) repeat center`, backgroundSize: 'cover'}">
            <div class="avatar_box">
                <div class="img_box">
                    <el-image style="width: 100%; height: 100%" :src="url" fit="fill" />
                </div>
            </div>
            <div class="signature_box">
                <div class="welcom">WELCOME</div>
                <div class="fence"></div>
                <div class="signature_cont">***个人空间</div>
            </div>
            <ul class="nav-center" @mouseleave="() => mouseleaveNav()">
                <li v-for="(item, index) in navList" :key="item.name" @mouseenter="() => mouseenterNav(index)" @click="() => handleNav(index, item)" :class="[index === hoverAcitveIndex && 'active']">
                    <i :class="['iconfont', item.icon]"></i><span :class="[`${item.icon}-name`]">{{item.name}}</span>
                </li>
                <div class="indicator" :style="{transform: `translateX(calc(70px * ${hoverAcitveIndex} + 5px))`}">
                    <div class="indicator-before"></div>
                    <div class="indicator-content"></div>
                    <div class="indicator-after"></div>
                </div>
            </ul>
        </div>
        <div
            class="banner"
            v-for="(item, index) in navList"
            :key="item.name"
            :style="{
                background: `transparent url(${assetsUrl}/${item.bg}) no-repeat center`,
                backgroundSize: '100% 100%',
                display: index === curAcitveIndex ? 'block' : 'none'
            }"
        ></div>
        <RouterView />
        <div style="height: 100px; background: #94c4ef;"></div>
    </div>
</template>

<style scoped>
    .full_page {
        background: #f7f8fa;
    }
    .head_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .avatar_box {
        width: 264px;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .avatar_box .img_box {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 6px solid #f7f8fa;
        overflow: hidden;
        box-shadow: 0px 0px 16px 3px rgba(0, 0, 0, 0.12), 0px 0px 5px 0px rgba(0, 0, 0, 0.08), 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .signature_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .welcom {
        font-size: 24px;
        line-height: 24px;
        color: rgb(68, 68, 68);
        font-family: 微软雅黑;
    }
    .signature_box .fence {
        width: 45px;
        height: 3px;
        margin: 15px 0;
        border-radius: 1.5px;
        background: rgb(255, 192, 1);
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
    }
    .signature_cont {
        font-size: 14px;
        line-height: 24px;
        color: rgb(119, 119, 119);
    }
    
    .nav-center {
        width: 400px;
        height: 70px;
        margin-top: 35px;
        padding: 0 25px;
        border-radius: 10px;
        background-color: #94c4ef;
        position: relative;
        display: flex;
    }
    .nav-center li {
        width: 70px;
        height: 70px;
        z-index: 3;
        color: #fff;
        position: relative;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .nav-center li i {
        display: block;
        height: 70px;
        line-height: 70px;
        font-size: 24px;
        text-align: center;
        position: relative;
        transition: all 0.5s;
    }
    .nav-center li span {
        position: absolute;
        font-size: 12px;
        letter-spacing: 2px;
        transition: all 0.5s;
        transform: translateY(20px);
    }
    .nav-center li.active i {
        transform: translateY(-35px);
        color: #fff;
    }
    .nav-center li.active .icon-like, .nav-center li.active .icon-like-name {
        color: rgb(247, 141, 158);
    }
    .nav-center li.active span {
        opacity: 1;
        transform: translateY(10px);
    }
    .indicator {
        position: absolute;
        top: -43%;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        transition: all 0.5s;
    }
    .indicator-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #2196f3;
        border-radius: 50%;
        border: 6px solid #fff;
        z-index: 2;
    }
    .indicator-before {
        position: absolute;
        top: 50%;
        left: -16px;
        width: 20px;
        height: 20px;
        background-color: #94c4ef;
        border-top-right-radius: 20px;
        box-shadow: 1px -10px 0 0 #fff;
    }
    .indicator-after {
        position: absolute;
        top: 50%;
        right: -16px;
        width: 20px;
        height: 20px;
        background-color: #94c4ef;
        border-top-left-radius: 20px;
        box-shadow: -1px -10px 0 0 #fff;
    }

    .banner {
        height: 460px;
    }
</style>
