<template>
    <a-space :size="10">
        <a-button type="primary" class="tpf-button" @click="onAdd">
            <SvgIcon type="icon-insert" /> 新增
        </a-button>
        <a-button
            type="primary"
            class="tpf-button"
            @click="delGuidebook"
            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
        >
            <SvgIcon type="icon-shanchu" /> 删除
        </a-button>
        <a-button class="tpf-button" type="primary" ghost @click="exportTable">
            <SvgIcon type="icon-daochu" /> 导出
        </a-button>
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
        <ConfirmStorageModal
            v-if="onloadConfirmStorageModal"
            ref="confirmStorageRef"
            @onGetTableList="getDataList"
        />
    </a-space>
</template>

<script setup lang="tsx">
    import { defineAsyncComponent } from 'vue';
    import { useFilesystemApi, useWarehouseApi } from '@/api';
    import { isEmpty } from 'lodash-es';
    import { useOpenAntdModal } from '@/hooks';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';

    const ConfirmStorageModal = defineAsyncComponent(
        () => import('./editTakeStock/components/ConfirmStorageModal.vue')
    );

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    type Props = {
        selectedRowInfo: {
            selectedRowKeys: any[];
            selectedRows: any[];
        };
        getDataList: () => void;
        getExportParams: () => Record<string, any>;
    };
    const props = defineProps<Props>();

    const filesystemApi = useFilesystemApi();

    const warehose = useWarehouseApi();

    // 新增
    const [confirmStorageRef, onOpenConfirmStorage, onloadConfirmStorageModal] = useOpenAntdModal();
    const onAdd = async () => {
        onOpenConfirmStorage();
    };

    // 删除
    const delGuidebook = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除该盘点单吗?' });
        const { message } = await import('ant-design-vue');
        const res = await warehose.deleteStoreCheck({
            id: props.selectedRowInfo.selectedRowKeys
        });
        if (res.data.list) {
            openDelModalDom(res.data.list);
        } else {
            message.success('删除成功');
            props.getDataList();
        }
    };

    const exportTable = async () => {
        filesystemApi.exportFileList(() => warehose.exportStoreCheck(props.getExportParams()));
    };
</script>

<style lang="less" scoped></style>
