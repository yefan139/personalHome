<template>
    <div id="editorjsId" :style="'width:' + props.width + 'px;min-height:' + props.height + 'px;'"></div>
</template>

<script setup lang="ts">
    import {ref, onMounted} from 'vue';

    import zh from '../utils/i18n.json';
    // 内容警告（Warning）：用于突出显示重要提示或警告
    // 勾选框（Checklist）：用于创建待办事项列表，可以勾选完成状态

    import EditorJS from '@editorjs/editorjs';
    import Header from '@editorjs/header'; // 标题（Header）：用于设置文本的标题级别，支持多级标题
    import List from '@editorjs/list'; // 列表（List）：支持有序列表和无序列表
    import Paragraph from '@editorjs/paragraph'; // 段落（Paragraph）：用于添加普通文本段落
    import Quote from '@editorjs/quote'; // 引用（Quote）：用于添加引用文本块
    import Image from '@editorjs/image'; // 图像（Image）：可以插入图片，并指定图片的来源、标题和描述等属性
    import Embed from '@editorjs/embed'; // 视频（Embed）：可以插入媒体内容的外部嵌入代码或链接
    import Table from '@editorjs/table'; // 表格（Table）：可以创建简单的表格，指定表格行数和列数
    import Code from '@editorjs/code'; // 代码（Code）：用于插入代码块，支持多种编程语言的语法高亮
    import Delimiter from '@editorjs/delimiter'; // 分割线（Delimiter）：用于在内容中插入水平分割线
    import Link from '@editorjs/link'; // 插入链接（Link）：可以插入超链接，指定链接的URL、标题和打开方式等
    
    // 外部传入属性
    const props = defineProps({
        modelValue: {
            type: String,
            default: "",
        },
        width: {
            type: Number,
            default: 500,
        },
        height: {
            type: Number,
            default: 500,
        },
    });

    const editor = ref(null)
 
    const saveEditor = () => {
        editor.value.save().then((outputData) => {
            console.log(outputData)
        }).catch((error) => {
            console.log(error)
        });
    }
    /* const {data} = toRefs(reactive({
        //定义数组和对象
        data: ''
    })) */

    onMounted(() => {
        editor.value = new EditorJS({
            holder: 'editorjsId', //应该包含编辑器的元素Id
            // autofocus: true, //自动获取焦点
            placeholder: '请输入内容',
            i18n: {
                messages: zh
            },
            logLevel: 'VERBOSE', //日志级别   VERBOSE显示所有消息(默认) INFO显示信息和调试消息 WARN只显示警告消息 ERROR只显示错误信息
            readOnly: false, //只读模式
            tools: { //工具列表
                header: {
                    class: Header,
                    inlineToolbar: ['link']
                },
                list: {
                    class: List,
                    inlineToolbar: true
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true
                },
                // image: SimpleImage,
                image: {
                    class: Image,
                    inlineToolbar: true
                },
                embed: {
                    class: Embed,
                    inlineToolbar: true
                },
                table: {
                    class: Table,
                    inlineToolbar: true
                },
                code: {
                    class: Code,
                    inlineToolbar: true
                },
                delimiter: {
                    class: Delimiter,
                    inlineToolbar: true
                },
                link: {
                    class: Link,
                    inlineToolbar: true
                },
            },
            onReady: () => {
                console.log('Editor.js is ready to work!')
            },
        })
        console.log(editor.value);
    });

    defineExpose({saveEditor});

</script>
