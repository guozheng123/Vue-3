<template>
    <TpfAddInfoLayout :title="title">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <ESOPBaseInfo
                id="ESOPBaseInfo"
                ref="ESOPBaseInDOM"
                fieldName="guidebookBaseInfo"
                :type="type"
                :info="guidebookInfo.guidebookBaseInfo"
                @changeOperationCode="changeOperationCode"
            />
        </LoadingSkeleton>

        <!-- 物料列表 -->
        <LoadingSkeleton>
            <ESOPMaterielList
                id="ESOPMaterielList"
                ref="ESOPMaterielListDom"
                fieldName="guidebookMaterials"
                :list="guidebookInfo.guidebookMaterials"
            />
        </LoadingSkeleton>

        <!-- 开工检查 -->
        <LoadingSkeleton>
            <ESOPStartInspection
                v-if="hasOperationCode"
                id="ESOPStartInspection"
                ref="ESOPStartInspectionDom"
                fieldName="guidebookChecklists"
                :list="guidebookInfo.guidebookChecklists"
            />
        </LoadingSkeleton>

        <!-- 作业说明 -->
        <LoadingSkeleton>
            <ESOPJobDescription
                v-if="hasOperationCode"
                id="ESOPJobDescription"
                ref="ESOPJobDescriptionDom"
                fieldName="guidebookInstructions"
                :list="guidebookInfo.guidebookInstructions"
            />
        </LoadingSkeleton>

        <!-- 附件 -->
        <LoadingSkeleton>
            <TpfCollapseFileInfo
                accept=".doc,.docx,.xlsx,.xls,.pdf,.pptx,.dwg,.jpg,.png"
                id="fileInfo"
                ref="TpfCollapseFileInfoDom"
                fieldName="guidebookFiles"
                :fileList="guidebookInfo.guidebookFiles"
            />
        </LoadingSkeleton>

        <TpfAnchor :anchorList="anchorList" />

        <template #footerRight>
            <a-button class="tpf-button" @click="cancelEdit"> 取消 </a-button>

            <a-button type="primary" class="tpf-button" @click="saveInfo"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useGuidebookApi } from '@/api';
    import type { ReqAddGuidebook } from '@/api';
    import { useRouteQuery, useRouteBackTab } from '@/hooks';
    import { useTpfCollapseFileInfo } from '@/components';

    const guidebookApi = useGuidebookApi();

    const { TpfCollapseFileInfo } = useTpfCollapseFileInfo();

    const hasOperationCode = ref(false);

    const anchorList = computed(() => {
        return [
            { href: 'ESOPBaseInfo', title: '基本信息', visible: true },
            { href: 'ESOPMaterielList', title: '物料列表', visible: true },
            { href: 'ESOPStartInspection', title: '开工检查', visible: unref(hasOperationCode) },
            { href: 'ESOPJobDescription', title: '作业说明', visible: unref(hasOperationCode) },
            { href: 'fileInfo', title: '附件', visible: true }
        ];
    });

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const ESOPBaseInfo = defineAsyncComponent(() => import('./components/ESOPBaseInfo.vue'));

    const ESOPMaterielList = defineAsyncComponent(
        () => import('./components/ESOPMaterielList.vue')
    );
    const ESOPStartInspection = defineAsyncComponent(
        () => import('./components/ESOPStartInspection.vue')
    );
    const ESOPJobDescription = defineAsyncComponent(
        () => import('./components/ESOPJobDescription.vue')
    );

    const { routeBackTab } = useRouteBackTab();

    const { guidebookId, type } = useRouteQuery<{ guidebookId: string; type: string }>();

    const ESOPBaseInDOM = ref<InstanceType<typeof ESOPBaseInfo> | null>(null);

    const TpfCollapseFileInfoDom = ref<InstanceType<typeof TpfCollapseFileInfo> | null>(null);

    const ESOPMaterielListDom = ref<InstanceType<typeof ESOPMaterielList> | null>(null);

    const ESOPStartInspectionDom = ref<InstanceType<typeof ESOPStartInspection> | null>(null);

    const ESOPJobDescriptionDom = ref<InstanceType<typeof ESOPJobDescription> | null>(null);

    const comList = computed(() => [
        ESOPBaseInDOM,
        ESOPMaterielListDom,
        ESOPStartInspectionDom,
        ESOPJobDescriptionDom,
        TpfCollapseFileInfoDom
    ]);

    const title = computed(() => {
        if (!guidebookId) {
            return '新增ESOP';
        }
        if (guidebookId && type === 'DETAIL') {
            return '编辑ESOP';
        }
        if (guidebookId && type === 'COPY') {
            return '复制ESOP';
        }
        if (guidebookId && type === 'UPGRADES') {
            return '升级ESOP';
        }
        return '';
    });

    const guidebookInfo = ref<ReqAddGuidebook>({} as ReqAddGuidebook);

    const getGuidebookInfo = async () => {
        if (!guidebookId) return;
        // loading.value = true;
        try {
            guidebookInfo.value = await guidebookApi
                .getGuidebookById({ guidebookId, type })
                .then(res => res.data.object || {});
            if (unref(guidebookInfo).guidebookBaseInfo.operationCode) {
                changeOperationCode(true);
            }
        } finally {
            // loading.value = false;
        }
    };

    const cancelEdit = () => {
        routeBackTab();
    };

    const saveParams = async () => {
        const allRes = await Promise.all(unref(comList).map(item => item.value?.submit()));
        console.log('allRes: ', allRes);
        const params = allRes.reduce((t, v) => ({ ...t, ...v }), {
            guidebookBaseInfo: {},
            guidebookChecklists: [],
            guidebookFiles: [],
            guidebookInstructions: [],
            guidebookMaterials: []
        } as any);
        params.guidebookBaseInfo.guidebookId = guidebookId;
        console.log('收集到的参数', params);
        if (!unref(guidebookId) || ['COPY', 'UPGRADES'].includes(type)) {
            //新增- ['COPY', 'UPGRADES'] - 复制- 升级
            await guidebookApi.addGuidebook(params);
            return;
        }
        if (guidebookId && type === 'DETAIL') {
            // 编辑
            await guidebookApi.editGuidebook(params);
            return;
        }
    };

    const saveInfo = async () => {
        await saveParams();
        const { message } = await import('ant-design-vue');
        message.success('保存成功');
        cancelEdit();
    };
    const changeOperationCode = (flag = true) => {
        hasOperationCode.value = flag;
    };

    onMounted(() => {
        getGuidebookInfo();
    });
</script>
