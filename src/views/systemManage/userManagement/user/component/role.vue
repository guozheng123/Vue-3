<template>
    <div>
        <TpfCollapse title="角色" gap="0">
            <template v-if="routerType !== 'detail'" #right>
                <a-button type="primary" ghost @click="openRoleModel" class="tpf-button">
                    <SvgIcon type="icon-insert" style="margin-right: 5px" />
                    新增
                </a-button>
                <a-button
                    type="primary"
                    ghost
                    @click="deleteTable"
                    class="tpf-button"
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
        <RoleModel @getList="getList" ref="roleModel" />
    </div>
</template>

<script setup lang="ts" name="roleComponent">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import mitts from '@/utils/bus';
    import { useRouter } from 'vue-router';
    import { message } from 'ant-design-vue';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const RoleModel = defineAsyncComponent(() => import('../model/roleModel.vue'));
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const [roleModel, onOpenRoleModel] = useOpenAntdModal();

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const $router = useRouter();

    const routerType = computed(() => $router.currentRoute.value.query.type);
    const isSystemUser = ref(1);
    const userName = ref('');
    const columns = ref<TpfColumnType[]>([
        {
            title: '角色编号',
            dataIndex: 'roleCode',
            key: 'roleCode',
            align: 'center',
            width: 150
        },
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName', align: 'center', width: 150 }
    ]);
    const { tableInfo, loading, getDataList, selectedRowInfo, setTableList } = useAntdTable({
        api: async () => {
            if (props.paramsData.systemFlag === 1) {
                isSystemUser.value = 1;
            }
            const res = {
                list: routerType.value !== 'add' ? props.paramsData.roleList : []
            };
            return res;
        },
        rowKey: 'roleId',
        isPageAble: false,
        hasRowSelection: routerType.value !== 'detail'
    });
    const openRoleModel = () => {
        console.log(isSystemUser.value);

        if (isSystemUser.value === 0) {
            message.warning(`${userName.value}不是系统用户 不能赋予角色`);
        } else {
            const ids = tableInfo.value.dataSource?.map((e: any) => {
                return e.roleId;
            });
            onOpenRoleModel(ids);
        }
    };
    const getList = (data: any) => {
        unref(data).forEach((e: never) => {
            tableInfo.value.dataSource?.push(e);
        });
    };

    const load = () => {
        if (routerType.value !== 'add') {
            const data = props.paramsData.roleList;
            getList(data);
        }
    };

    const deleteTable = () => {
        const data = tableInfo.value.dataSource?.filter((e: any) => {
            console.log(e, '234');
            if (!unref(selectedRowInfo).selectedRowKeys.includes(e.roleId)) {
                return e;
            }
        });
        setTableList(data);
    };

    onMounted(() => {
        getDataList();

        mitts.on('event', (e: number | any) => {
            isSystemUser.value = e;
        });
        mitts.on('userName', (e: string | any) => {
            userName.value = e;
            // isSystemUser.value = e;
        });
        load();
    });
    defineExpose({
        tableInfo
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
