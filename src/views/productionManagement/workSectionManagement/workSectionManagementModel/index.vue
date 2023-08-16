<template>
    <TpfAddInfoLayout :title="title" class="workSectionManagementModel">
        <!-- 基本信息 -->
        <LoadingSkeleton>
            <OrderBaseInfo
                fieldName="workshopSectionVo"
                id="orderBaseInfo"
                ref="orderBaseInfoDom"
                :type="type"
                :info="WorkshopSection.workshopSectionVo"
            />
        </LoadingSkeleton>
        <!-- 工序列表 -->
        <LoadingSkeleton>
            <ProcedureList
                id="ProcedureList"
                ref="ProcedureListDom"
                fieldName="operationRequestVos"
                :list="WorkshopSection.operationResponseVos"
            />
        </LoadingSkeleton>
        <!-- 按钮区域 -->
        <template #footerRight>
            <a-button class="tpf-button" @click="cancelEdit"> 取消 </a-button>
            <a-button type="primary" class="tpf-button" @click="saveInfo"> 保存 </a-button>
        </template>
        <TpfAnchor :anchorList="anchorList" />
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="workSectionManagementModel">
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { useRouteQuery, useRouteBackTab } from '@/hooks';
    import { ref, computed, unref, defineAsyncComponent, onMounted } from 'vue';
    import { useWorkshopApi } from '@/api';
    import { message } from 'ant-design-vue';
    const warehouseApi = useWorkshopApi();
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const anchorList = [
        { href: 'OrderBaseInfo', title: '基本信息', visible: true },
        { href: 'ProcedureList', title: '工序列表', visible: true }
    ];
    const title = computed(() => {
        if (!WorkshopSectionId) {
            return '新增工段管理';
        }
        if (WorkshopSectionId && type === 'DETAIL') {
            return '编辑工段管理';
        }
        return '';
    });

    const { WorkshopSectionId, type } = useRouteQuery<{
        WorkshopSectionId: string;
        type: string;
    }>();
    const WorkshopSection = ref<any>({});

    // 基本信息
    const OrderBaseInfo = defineAsyncComponent(() => import('./components/OrderBaseInfo.vue'));
    // 工序列表
    const ProcedureList = defineAsyncComponent(() => import('./components/ProcedureList.vue'));
    const { routeBackTab } = useRouteBackTab();
    const orderBaseInfoDom = ref<InstanceType<typeof OrderBaseInfo> | null>(null);
    const ProcedureListDom = ref<InstanceType<typeof ProcedureList> | null>(null);
    const comList = computed(() => [orderBaseInfoDom, ProcedureListDom]);
    // 编辑调用函数回显数据
    const onGetEditData = async () => {
        if (!WorkshopSectionId) return;
        try {
            const res = await warehouseApi.getWorkshopSectionById({
                WorkshopSectionId
            });
            WorkshopSection.value = res.data.object;
        } finally {
            // loading.value = false;
        }
    };
    // 取消按钮
    const cancelEdit = () => {
        routeBackTab();
    };
    // 保存按钮
    const saveInfo = async () => {
        await saveParams();
        // 调用取消按钮函数
        cancelEdit();
    };
    const saveParams = async () => {
        const allRes = await Promise.all(unref(comList).map(item => item.value?.submit()));
        console.log('按钮', allRes);

        const params = allRes.reduce((t, v) => {
            t = { ...t, ...v };
            return t;
        }, {} as any);
        console.log('收集到的参数', params.operationRequestVos.length);
        const newWorkshopSectionId = unref(WorkshopSectionId);
        // 编辑
        if (newWorkshopSectionId) {
            await warehouseApi.editWorkshopSection({
                ...params
            });
            message.success('编辑成功！');
        } else {
            // 新增
            const res = await warehouseApi.addWorkshopSection(params);
            if (res.data.value) {
                message.success('添加成功!');
            } else {
                message.error('添加失败!');
                return;
            }
        }
        return newWorkshopSectionId;
    };
    onMounted(() => {
        onGetEditData();
    });
</script>
