<template>
    <div style="padding: 50px 0;">
        <div class="editorBox">
            <EditorJs ref="editorRef" :width="700" :height="710" v-model="data"></EditorJs>
            <el-button @click="save">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {reactive, ref, toRefs} from 'vue';
    import EditorJs from '../components/Editor.vue';
    const {data} = toRefs(reactive({
        //定义数组和对象
        data: ''
    }));
    const editorRef = ref<InstanceType<typeof EditorJs> | null>(null); //定义普通类型
    // 保存
    const save = () => {
        editorRef.value?.saveEditor()
    };

</script>

<style scoped>
    .editorBox {
        padding: 40px;
        width: 760px;
        background-color: #fff;
        margin: 0 auto;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .04), 0 4px 10px rgba(0, 0, 0, .08);
    }
</style>
