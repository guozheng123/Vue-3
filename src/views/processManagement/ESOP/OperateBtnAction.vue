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
        <a-button
            type="primary"
            class="tpf-button"
            @click="releaseGuidebook"
            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
        >
            <SvgIcon type="icon-fuzhi" /> 发布
        </a-button>
        <a-button
            type="primary"
            class="tpf-button"
            @click="setDefault"
            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
        >
            <SvgIcon type="icon-shezhimoren" />
            设置默认
        </a-button>
        <a-button
            type="primary"
            class="tpf-button"
            @click="setEnableGuide"
            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
        >
            <SvgIcon type="icon-qiyong" /> 启用/禁用
        </a-button>

        <!-- 导入 -->
        <TpfTableImportBtn
            :uploadAction="uploadAction"
            downLoadTemplate="guidebookTemplate"
            @uploadTable="getDataList"
        />
        <a-button class="tpf-button" type="primary" ghost @click="exportTable">
            <SvgIcon type="icon-daochu" /> 导出
        </a-button>
    </a-space>
</template>

<script setup lang="tsx">
    import { defineAsyncComponent, unref } from 'vue';
    import type { TpfUploadFile } from '@/types';
    import { useGuidebookApi, useFilesystemApi, useQueryAPi } from '@/api';
    import { useRouter } from 'vue-router';
    import { isEmpty } from 'lodash-es';

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    type Props = {
        selectedRowInfo: {
            selectedRowKeys: any[];
        };
        getDataList: () => void;
        getExportParams: () => Record<string, any>;
    };
    const props = defineProps<Props>();

    const filesystemApi = useFilesystemApi();

    const router = useRouter();

    const guidebookApi = useGuidebookApi();

    // 新增
    const onAdd = () => {
        router.push({
            path: '/processManagement/ESOP/addESOP'
        });
    };

    const delGuidebook = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除该ESOP?' });
        await guidebookApi.deleteGuidebookByIds({
            guidebookIds: props.selectedRowInfo.selectedRowKeys
        });
        const { message } = await import('ant-design-vue');
        message.success('删除成功');
        props.getDataList();
    };

    const releaseGuidebook = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '发布选择的ESOP?', title: '确认发布' });
        await guidebookApi.releaseGuidebookByIds({
            guidebookIds: props.selectedRowInfo.selectedRowKeys
        });
        const { message } = await import('ant-design-vue');
        message.success('发布成功');
        props.getDataList();
    };

    const setDefault = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '设置默认选择的ESOP?', title: '设置默认' });
        await guidebookApi.defaultGuidebookByIds({
            guidebookIds: props.selectedRowInfo.selectedRowKeys
        });
        const { message } = await import('ant-design-vue');
        message.success('设置成功');
        props.getDataList();
    };

    const setEnableGuide = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '选择的ESOP切换启用禁用?', title: '切换启用禁用' });
        await guidebookApi.enableGuidebookByIds({
            guidebookIds: props.selectedRowInfo.selectedRowKeys
        });
        const { message } = await import('ant-design-vue');
        message.success('切换成功');
        props.getDataList();
    };

    //导入
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await guidebookApi.importGuidebook({ overrideFlag, fileCode });
    };

    const exportTable = () => {
        filesystemApi.exportFileList(() => guidebookApi.exportGuideBook(props.getExportParams()));
    };
</script>

<style lang="less" scoped></style>
