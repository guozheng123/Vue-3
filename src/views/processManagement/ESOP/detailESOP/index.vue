<template>
    <TpfAddInfoLayout title="ESOP详情">
        <TpfCollapse title="基本信息" id="ESOPBaseInfo">
            <TpfDescriptions
                :originalDate="guidebookInfo.guidebookBaseInfo || {}"
                :renderList="productionOrderList"
                id="guidebookBaseInfo"
            />
        </TpfCollapse>

        <!-- 物料列表 -->
        <LoadingSkeleton>
            <ESOPMaterielList
                readOnly
                id="guidebookMaterials"
                :list="guidebookInfo.guidebookMaterials"
            />
        </LoadingSkeleton>

        <!-- 开工检查 -->
        <LoadingSkeleton>
            <ESOPStartInspection
                id="guidebookChecklists"
                readOnly
                fieldName="guidebookChecklists"
                :list="guidebookInfo.guidebookChecklists"
            />
        </LoadingSkeleton>

        <!-- 作业说明 -->
        <LoadingSkeleton>
            <ESOPJobDescription
                readOnly
                id="guidebookInstructions"
                fieldName="guidebookInstructions"
                :list="guidebookInfo.guidebookInstructions"
            />
        </LoadingSkeleton>

        <!-- 附件 -->
        <LoadingSkeleton>
            <TpfCollapseFileInfo
                readonly
                accept=".doc,.docx,.xlsx,.xls,.pdf,.pptx,.dwg,.jpg,.png"
                id="guidebookFiles"
                fieldName="guidebookFiles"
                :fileList="guidebookInfo.guidebookFiles"
            />
        </LoadingSkeleton>

        <TpfAnchor :anchorList="anchorList" />

        <template #footerRight="{ goBack }">
            <a-button class="tpf-button" @click="goBack"> 关闭 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useGuidebookApi } from '@/api';
    import { useRouteQuery } from '@/hooks';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useTpfCollapseFileInfo } from '@/components';
    import { getTpfOptionEnum } from '@/config';
    const { getLabel, publishOption } = getTpfOptionEnum();

    const { TpfCollapseFileInfo } = useTpfCollapseFileInfo();

    const anchorList = [
        { href: 'guidebookBaseInfo', title: '基本信息', visible: true },
        { href: 'guidebookMaterials', title: '物料列表', visible: true },
        { href: 'guidebookChecklists', title: '开工检查', visible: true },
        { href: 'guidebookInstructions', title: '作业说明', visible: true },
        { href: 'guidebookFiles', title: '附件', visible: true }
    ];
    const guidebookApi = useGuidebookApi();

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const ESOPMaterielList = defineAsyncComponent(
        () => import('../editESOP/components/ESOPMaterielList.vue')
    );
    const ESOPJobDescription = defineAsyncComponent(
        () => import('../editESOP/components/ESOPJobDescription.vue')
    );
    const ESOPStartInspection = defineAsyncComponent(
        () => import('../editESOP/components/ESOPStartInspection.vue')
    );

    const { guidebookId } = useRouteQuery<{ guidebookId: string; type: string }>();

    const guidebookInfo = ref({ guidebookFiles: [] } as any);

    const productionOrderList = [
        { label: 'ESOP编号', field: 'guidebookCode' },
        { label: 'ESOP名称', field: 'guidebookName' },
        { label: '版本', field: 'versionName' },
        {
            label: '工序编号',
            field: 'operationCode',
            description: '工序编号和物料列表，至少有一个必须维护数据'
        },
        { label: '工序名称', field: 'operationName' },
        { label: '备注', field: 'remark' },
        { label: '是否发布', field: 'releaseFlag' }
    ];

    const getGuidebookInfo = async () => {
        if (!unref(guidebookId)) return;
        // loading.value = true;
        try {
            guidebookInfo.value = await guidebookApi
                .getGuidebookById({ guidebookId, type: 'DETAIL' })
                .then(res => res.data.object || {});
            const releaseFlag = guidebookInfo.value.guidebookBaseInfo.releaseFlag;
            guidebookInfo.value.guidebookBaseInfo.releaseFlag = getLabel(
                releaseFlag,
                publishOption
            );
        } finally {
            // loading.value = false;
        }
    };

    onMounted(() => {
        getGuidebookInfo();
    });
</script>
