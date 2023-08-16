<template>
    <TpfModal
        class="image-modal"
        v-model:visible="visible"
        height="440px"
        width="666px"
        title="图片预览"
    >
        <div class="image-box">
            <TpfImagePreview
                v-bind="{ ...options }"
                :imgList="props.currentListImages"
                @del-pic="onDelPic"
            />
        </div>
    </TpfModal>
</template>

<script setup lang="ts" name="InfoModal">
    import { ref } from 'vue';
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfImagePreview from '@/components/TpfImagePreview/index.vue';
    type Props = {
        currentListImages: any[];
    };
    const props = withDefaults(defineProps<Props>(), {
        currentListImages: () => []
    });
    const emit = defineEmits(['updateImagesList']);
    const visible = ref(false);
    const options = {
        width: 180,
        height: 180
    };
    let currentIndex = -1;
    const open = (index: number) => {
        visible.value = !visible.value;
        currentIndex = index;
    };
    const onDelPic = (item: any, index: number) => {
        const list = props.currentListImages.filter((v: any) => v.fileCode !== item.fileCode);
        emit('updateImagesList', list, currentIndex);
    };
    defineExpose({
        open
    });
</script>

<style scoped lang="less">
    .image-modal {
        .image-box {
            padding: 15px;
        }
    }
</style>
