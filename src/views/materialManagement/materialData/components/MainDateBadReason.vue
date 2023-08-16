<template>
    <TpfLayout>
        <template #content>
            <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                <template #default="args">
                    <LoadingSkeleton>
                        <TpfTable
                            v-bind="{ ...args, ...tableInfo, pagination, seq: true, beforeRender }"
                        />
                    </LoadingSkeleton>
                </template>
                <template #operateLeft>
                    <a-button type="primary" class="tpf-button" @click="add">
                        <SvgIcon type="icon-insert" /> 新增
                    </a-button>
                    <a-button
                        class="tpf-button"
                        type="primary"
                        :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                        @click="onDelete"
                    >
                        <SvgIcon type="icon-shanchu" /> 删除
                    </a-button>
                </template>
            </TpfTableLayout>
        </template>
        <AddCauseDeficiency ref="addCauseDeficiency" @submitAdd="submitAddCauseDeficiency" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="MainDateBadReason">
    import { defineAsyncComponent, onMounted, unref, ref } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import { PageCodeEnum } from '@/config';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { isEmpty } from 'lodash-es';
    import type { ResQueryDefectCauseListByPage } from '@/api';
    import { useMaterialApi } from '@/api';
    import { message } from 'ant-design-vue';
    import type { TpfColumnType } from '@/types';
    import SvgIcon from '@/components/SvgIcon/index.vue';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddCauseDeficiency = defineAsyncComponent(() => import('./AddCauseDeficiency.vue'));

    const pageCode = PageCodeEnum.materialCause; // 物料主数据pagecode

    const [addCauseDeficiency, onOpenAddCauseDeficiency] = useOpenAntdModal();

    const businessId = ref('');

    const useMaterial = useMaterialApi();

    const beforeRender = (list: TpfColumnType[]) => {
        return list.map(item => {
            if (['iqcFlag', 'ipqcFlag', 'fqcFlag', 'oqcFlag'].includes(item.dataIndex as string)) {
                item.customRender = ({ text }) =>
                    text === '1' && <SvgIcon type="icon-xuanzhong" class="t-text-primary" />;
            }
            return item;
        });
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo, getTableList } = useAntdTable({
        api: async () => {
            const params = {
                id: Number(unref(businessId))
            };
            const res = await useMaterial.queryMaterialTypeCauseList(params);
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: false,
        isConfig: true,
        hasRowSelection: true
    });

    const submitAddCauseDeficiency = async (v: ResQueryDefectCauseListByPage[]) => {
        const list = unref(v);

        const ids = list.map((e: any) => ({
            businessId: unref(businessId),
            causeId: e.defectCauseId
        }));
        const res = await useMaterial.addMaterialTypeCause(ids);
        if (res.data.value) {
            message.success('保存成功');
            getDataList();
        }
    };
    const add = () => {
        if (!unref(businessId)) {
            return message.warning('需选择分类进行添加!');
        }
        onOpenAddCauseDeficiency(unref(getTableList()));
    };
    const onDelete = async () => {
        const ids = selectedRowInfo.value.selectedRowKeys as string[];
        const res = await useMaterial.deleteMaterialTypeCause({ ids: ids });
        if (res.data.value) {
            message.success('删除成功');
            getDataList();
        }
    };

    const updateTableList = (code = '') => {
        code = code === 'SYFL' ? '' : code;
        businessId.value = code;
        getDataList();
    };

    onMounted(() => {
        getDataList();
    });

    defineExpose({ updateTableList });
</script>
