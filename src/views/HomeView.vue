<script setup lang="ts">
    const assetsUrl = window.assetsUrl;
    const url = `${assetsUrl}/avatar.jpg`;
</script>

<template>
    <div class="full_page">
        <div class="head_box" :style="{background: `transparent url(${assetsUrl}/spaceBg.jpg) repeat center`}">
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
        </div>
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
</style>
