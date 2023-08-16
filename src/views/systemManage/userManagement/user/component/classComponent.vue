<template>
    <div>
        <TpfCollapse title="班组" gap="0">
            <template v-if="routerType !== 'detail'" #right>
                <a-button type="primary" ghost @click="openModel()" class="tpf-button">
                    <SvgIcon type="icon-insert" style="margin-right: 5px" />
                    新增
                </a-button>
                <a-button
                    @click="deleteTable"
                    class="tpf-button"
                    type="primary"
                    ghost
                    :disabled="!selectedRowInfo.selectedRowKeys.length"
                >
                    <SvgIcon type="icon-shanchu" style="margin-right: 5px" />
                    删除
                </a-button>
            </template>
            <a-card style="padding-bottom: 20px">
                <TpfLayout style="height: 200px">
                    <template #content>
                        <TpfTableLayout>
                            <template #default="args">
                                <TpfTable
                                    v-bind="{
                                        ...args,
                                        ...tableInfo,
                                        loading,
                                        pagination: false,
                                        columns,
                                        seq: true
                                    }"
                                />
                            </template>
                        </TpfTableLayout>
                    </template>
                </TpfLayout>
            </a-card>
        </TpfCollapse>
        <ClassModel @getList="getList" ref="classModel" />
    </div>
</template>

<script setup lang="ts" name="classComponent">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useRouter } from 'vue-router';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const ClassModel = defineAsyncComponent(() => import('../model/classModel.vue'));

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });

    const $router = useRouter();
    const routerType = computed(() => $router.currentRoute.value.query.type);
    const [classModel, onOpenClassModel] = useOpenAntdModal();

    const columns = ref<TpfColumnType[]>([
        {
            title: '班组',
            dataIndex: 'workingTeamAbbreviation'
        },
        {
            title: '车间',
            dataIndex: 'workshopName'
        },
        {
            title: '工厂',
            dataIndex: 'factoryName'
        }
    ]);

    const { tableInfo, loading, getDataList, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            const res = {
                list: routerType.value !== 'add' ? props.paramsData.workingTeamList : []
            };
            return res;
        },
        rowKey: 'workingTeamId',
        isPageAble: false,
        hasRowSelection: routerType.value !== 'detail'
    });

    const getList = (data: any) => {
        unref(data).forEach((e: never) => {
            tableInfo.value.dataSource?.push(e);
        });
    };

    const deleteTable = () => {
        const data = tableInfo.value.dataSource?.filter((e: any) => {
            if (!unref(selectedRowInfo).selectedRowKeys.includes(e.workingTeamId)) {
                return e;
            }
        });
        setTableList(data);
    };

    const openModel = () => {
        const ids = tableInfo.value.dataSource?.map((e: any) => {
            return e.workingTeamId;
        });
        onOpenClassModel(ids);
    };

    defineExpose({
        tableInfo
    });
    onMounted(() => {
        getDataList();
    });
</script>

<style scoped lang="less">
    :deep(.ant-card) {
        .ant-card-body {
            padding: 8px 12px 8px 12px;

            .tpf-layout {
                padding: 0 !important;

                .tpf-table-layout {
                    padding: 0;
                }
                // /*  */
            }

            .operate-line {
                height: 0 !important;
            }
        }
    }
</style>
