<template>
    <TpfModal v-model:visible="visible" width="800px" title="查看图片" height="500px">
        <div>
            <TpfImagePreview v-bind="{ ...wh }" :imgList="imageList" :useClose="false" />
        </div>
    </TpfModal>
</template>

<script setup lang="tsx" name="imagePreview">
    import { ref } from 'vue';
    import { useRef } from '@/hooks';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfImagePreview from '@/components/TpfImagePreview/index.vue';
    const [visible, setVisible] = useRef(false);
    const wh = {
        width: 240,
        height: 260
    };
    const imageList = ref<any[]>();
    const open = (list: any[]) => {
        onSetImage(list);
        setVisible(!visible.value);
    };
    const onSetImage = (list: any[]) => {
        if (Array.isArray(list)) {
            imageList.value = list;
        }
    };
    defineExpose({
        open
    });
</script>
