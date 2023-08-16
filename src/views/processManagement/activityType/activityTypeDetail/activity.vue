<template>
    <TpfCollapse title="作业单元" gap="0">
        <template #right>
            <a-button
                :disabled="!disabledBtn"
                type="primary"
                ghost
                @click="openModel()"
                class="tpf-button"
            >
                <SvgIcon type="icon-insert" style="margin-right: 5px" />
                添加作业单元
            </a-button>
        </template>
        <TpfTable
            class="t-h-[300px] t-px-[12px] t-py-[10px]"
            seq
            v-bind="{
                operateColumn
            }"
            :columns="columns"
            :dataSource="dataList"
            size="small"
            :pagination="false"
        />
        <AddActivity ref="addActivity" @getData="getData" />
    </TpfCollapse>
</template>

<script setup lang="ts" name="classComponentActivity">
    import { ref, defineAsyncComponent, onMounted, computed, unref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { useOpenAntdModal, useRouteQuery } from '@/hooks';
    import mitts from '@/utils/bus';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const AddActivity = defineAsyncComponent(() => import('./addActivity.vue'));
    type Props = {
        paramsData?: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });

    const { type } = useRouteQuery<{ type: string }>();

    const disabledBtn = ref(false);
    const { statusOptionStr, getLabel } = getTpfOptionEnum();
    const dataList = ref([]);

    const [addActivity, openAddActivity] = useOpenAntdModal();
    const factoryId = ref('');

    const defaultBtn = [
        {
            title: '删除',
            onClick: (row: { [key: string]: any }) => {
                if (type === 'detail') {
                    return;
                }
                dataList.value = unref(dataList).filter(
                    (e: any) => e.workUnitCode !== row.record.workUnitCode
                );
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 160,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const columns = computed<TpfColumnType[]>(() => {
        return [
            { title: '作业单元编号', dataIndex: 'workUnitCode', ...tableResizable() },
            { title: '作业单元名称', dataIndex: 'workUnitName', ...tableResizable() },
            {
                title: '启用',
                dataIndex: 'status',
                ...tableResizable(),
                customRender: ({ text }) => {
                    return getLabel(text, statusOptionStr);
                }
            }
        ];
    });

    const openModel = () => {
        openAddActivity({ factoryId: factoryId.value, workUnitIds: dataList.value });
    };
    const getData = (val: any) => {
        dataList.value = val;
    };
    onMounted(async () => {
        mitts.off('factoryId');
        mitts.on('factoryId', (e: string | any) => {
            disabledBtn.value = e ? true : false;
            factoryId.value = e;
        });
        if (type === 'edit' || type === 'detail') {
            disabledBtn.value = props.paramsData.factoryId ? true : false;
            factoryId.value = props.paramsData.factoryId;
            dataList.value = props.paramsData.workUnitListVos;
        }
    });
    const getDataList = () => {
        const workUnitIds = dataList.value.map((e: any) => {
            return e.workUnitId;
        });
        return workUnitIds;
    };
    defineExpose({
        getDataList
    });
</script>
