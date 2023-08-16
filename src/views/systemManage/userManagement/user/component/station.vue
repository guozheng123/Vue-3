<template>
    <div>
        <TpfCollapse title="岗位" gap="0">
            <template v-if="routerType !== 'detail'" #right>
                <a-button type="primary" ghost @click="openModel" class="tpf-button">
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
            <a-card>
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
        <StationModel @getList="getList" ref="stationModel" />
    </div>
</template>

<script setup lang="ts" name="stationComponent">
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
    const StationModel = defineAsyncComponent(() => import('../model/stationModel.vue'));

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });

    const [stationModel, onOpenStationModel] = useOpenAntdModal();
    const $router = useRouter();

    const routerType = computed(() => $router.currentRoute.value.query.type);

    const columns = ref<TpfColumnType[]>([
        {
            title: '岗位编号',
            dataIndex: 'postCode',
            key: 'postCode',
            align: 'center',
            width: 150
        },
        { title: '岗位名称', dataIndex: 'postName', key: 'postName', align: 'center', width: 150 }
    ]);

    const { tableInfo, loading, getDataList, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            const res = {
                list: routerType.value !== 'add' ? props.paramsData.postList : []
            };
            return res;
        },
        rowKey: 'postId',
        isPageAble: false,
        hasRowSelection: routerType.value !== 'detail'
    });
    const deleteTable = () => {
        const data = tableInfo.value.dataSource?.filter((e: any) => {
            if (!unref(selectedRowInfo).selectedRowKeys.includes(e.postId)) {
                return e;
            }
        });
        setTableList(data);
    };

    const getList = (data: any) => {
        unref(data).forEach((e: never) => {
            tableInfo.value.dataSource?.push(e);
        });
    };
    const openModel = () => {
        const ids = tableInfo.value.dataSource?.map((e: any) => {
            return e.postId;
        });
        onOpenStationModel(ids);
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
            height: 200;

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
