<template>
    <TpfAddInfoLayout title="编辑打印模板">
        <PrintCore class="t-px-[12px]" ref="printCoreDom" />
        <template #footerRight="{ goBack }">
            <a-button class="tpf-button" @click="goBack"> 取消 </a-button>
            <a-button class="tpf-button" type="primary" @click="onSave(goBack)">保存</a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import PrintCore from '@/print-plugin/components/print-core';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref } from 'vue';

    const printCoreDom = ref<InstanceType<typeof PrintCore> | null>(null);

    const onSave = async (cb: () => void) => {
        await printCoreDom.value?.saveTemplate();
        cb();
    };
</script>
