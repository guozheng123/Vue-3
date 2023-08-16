<template>
    <TpfAddInfoLayout title="工段管理详情">
        <!-- 基本信息 -->
        <TpfCollapse title="基本信息" id="workshopSectionVo">
            <TpfDescriptions
                :originalDate="WorkshopSection.workshopSectionVo || {}"
                :renderList="productionOrderList"
            />
        </TpfCollapse>

        <!-- 工序列表 -->
        <!-- <LoadingSkeleton> -->
        <ProcedureList
            readOnly
            fieldName="operationRequestVos"
            :list="WorkshopSection.operationResponseVos"
        />
        <!-- </LoadingSkeleton> -->
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useWorkshopApi, getDepartmentTreeList } from '@/api';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import { useRouteQuery } from '@/hooks';
    import { getTpfOptionEnum } from '@/config';
    const { getLabel, statusNumberOption } = getTpfOptionEnum();

    const WorkshopSection = ref<{ [k: string]: any }>({});
    const warehouseApi = useWorkshopApi();
    const productionOrderList = [
        { label: '工段编号', field: 'workshopSectionCode' },
        { label: '工段名称', field: 'workshopSectionName' },
        { label: '备注', field: 'remark' },
        {
            label: '所属部门',
            field: 'departmentName'
        },
        {
            label: '启用',
            field: (info: Record<string, any>) => getLabel(info.enabled, statusNumberOption)
        }
    ];
    // 工序列表
    const ProcedureList = defineAsyncComponent(
        () => import('../workSectionManagementModel/components/ProcedureList.vue')
    );
    const { WorkshopSectionId } = useRouteQuery<{ WorkshopSectionId: string }>();
    const onGetEditDatas = async () => {
        if (!WorkshopSectionId) return;
        try {
            WorkshopSection.value = await warehouseApi
                .getWorkshopSectionById({
                    WorkshopSectionId
                })
                .then(res => res.data.object || {});
        } finally {
            // loading.value = false;
        }
    };
    onMounted(() => {
        onGetEditDatas();
    });
</script>
