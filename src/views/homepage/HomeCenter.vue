<template>
    <div>
        <div class="journal">
            <el-container>
                <el-aside width="240px">
                    <div class="journal_sidebar">
                        <div style="text-align: right; width: 200px;">
                            <div style="font-size: 26px; color: #444444; line-height: 35px;">JOURNAL</div>
                            <div style="font-size: 20px; line-height: 26px;">日志</div>
                            <div @click.stop="jumpJournalList" class="more" style="font-size: 14px;cursor: pointer; padding-top: 20px;">MORE+</div>
                        </div>
                        <div style="padding-left: 20px;">
                            <div class="journal_side_fence"></div>
                        </div>
                    </div>
                </el-aside>
                <el-main>
                    <JournalBrief />
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {useRouter} from 'vue-router';
    import JournalBrief from './components/JournalBrief.vue';

    const assetsUrl = window.assetsUrl; // 服务静态资源路径
    const router = useRouter();

    // 跳转日志列表
    const jumpJournalList = () => {
        router.push('/home/profile');
    };
</script>

<style scoped>
    .journal {
        margin: 0 auto;
        width: 1200px;
    }
    .journal_sidebar {
        padding-top: 40px;
        display: flex;
    }
    .journal_side_fence {
        width: 2px;
        height: 19px;
        margin-top: 10px;
        background: #ffc011;
    }
    .more:hover {
        color: #ffc011;
    }

</style>
