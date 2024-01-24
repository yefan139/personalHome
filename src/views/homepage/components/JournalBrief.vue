<template>
    <div class="jour_news_box">
        <div class="jour_news_content">
            <div class="jour_news_img">
                <el-image style="width: 100%; height: 100%;" :src="`${assetsUrl}/daniel-cross-the-road.jpg`" lazy />
            </div>
            <div style="padding: 15px">
                <div>
                    <div class="jour_new_title" @click="() => jumpEditor('1')">深深的爱，淡淡的香</div>
                    <p class="two_hidden_ellipsis jour_news_text">一朵花，皎洁，素雅，渐渐地演变成了一幅画，印在了记忆的长河里。那花，叶细长，翠翠的，花开时，伸出一只长长的颈，花儿在颈上绽开，花瓣不多，色浅浅的，似白玉般温润、玲珑，淡淡的香气从花蕊中溢出，香薰满屋，沁人肺腑，令人心广神怡，使人宁静安详。</p>
                </div>
                <div class="jour_news_time">2020-09-21</div>
            </div>
        </div>
        <div class="jour_news_content">
            <div class="jour_news_img">
                <el-image style="width: 100%; height: 100%;" :src="`${assetsUrl}/daniel-one-person-journey.jpg`" lazy />
            </div>
            <div style="padding: 15px">
                <div>
                    <div class="jour_new_title">遇见你，不知是美好还是错误</div>
                    <p class="two_hidden_ellipsis jour_news_text">我一直用心向着阳可是我始终摆脱不了那后阴影，我从来没有承认过我的感情路有多么坎坷，因为离人要走所以所有的一切都那么惨白无力。</p>
                </div>
                <div class="jour_news_time">2023-09-20</div>
            </div>
        </div>
        <div class="jour_news_list">
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {useRouter} from "vue-router";

    const router = useRouter();

    const assetsUrl = window.assetsUrl; // 服务静态资源路径
    // 跳转到编辑页
    const jumpEditor = (id: string) => {
        console.log("id", id);
        router.push(`/editor`)
    };
</script>

<style scoped>
    .jour_news_box {
        display: flex;
        justify-content: space-between;
    }
    .jour_news_content {
        width: 48%;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 0 15px 0 rgba(0,0,0,.1);
    }
    .jour_news_img {
        width: 100%;
        height: 200px;
        overflow: hidden;
    }
    .jour_new_title {
        font-size: 16px;
    }
    .jour_new_title:hover {
        color: #ffc011;
    }
    .jour_news_text {
        margin-top: 14px;
        color: #666;
    }
    .jour_news_time {
        font-size: 14px;
        line-height: 1.5;
        color: #999;
        margin-top: 8px;
    }
    .jour_news_list {
        
    }
</style>
