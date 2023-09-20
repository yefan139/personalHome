<template>
    <div>
        <div class="journal">
            <el-container>
                <el-aside width="240px">
                    <div class="journal_sidebar">
                        <div class="journal_title">
                            <div>JOURNAL</div>
                            <div></div>
                        </div>
                        <div>日志</div>
                        <div>MORE+</div>
                    </div>
                </el-aside>
                <el-main>Main</el-main>
            </el-container>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    .journal {
        margin: 0 auto;
        width: 1200px;
    }
    .journal_sidebar {
        padding-top: 40px;
    }
    .journal_title {
        display: flex;
    }
</style>
