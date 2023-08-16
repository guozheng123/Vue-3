<template>
    <TpfCollapse title="生产工艺" class="processInfo">
        <AddProcessModal
            ref="addProcessModalDom"
            @getProcessInfo="getProcessInfo"
            v-if="showAddProcessModalDom"
        />

        <TpfTable v-bind="{ ...tableInfo, columns, seq: true, pagination, dataSource }" />

        <template #right>
            <a-button type="primary" class="tpf-button" ghost @click="openAddProcessModal">
                <SvgIcon type="icon-shu_xinzeng" cursor />添加
            </a-button>
            <a-button
                type="primary"
                class="tpf-button"
                ghost
                :disabled="!selectedRowInfo.selectedRowKeys.length"
                @click="delProcess"
            >
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
    </TpfCollapse>
</template>

<script setup lang="tsx" name="processInfo">
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { tableResizable } from '@/config';
    import { useOpenAntdModal, useAntdTable } from '@/hooks';
    import { TpfColumnType } from '@/types';
    import { Checkbox, Select } from 'ant-design-vue';
    import { ref, computed, defineAsyncComponent, unref, watchEffect } from 'vue';
    import { useRouter } from 'vue-router';

    const AddProcessModal = defineAsyncComponent(
        () => import('@/views/productionManagement/productionOrder/components/AddProcessModal.vue')
    );
    type Props = {
        productionOrderProcessVoList?: { [k: string]: any }[];
    };

    const props = withDefaults(defineProps<Props>(), {
        productionOrderProcessVoList: () => []
    });

    const [addProcessModalDom, openAddProcessModalDom, showAddProcessModalDom] = useOpenAntdModal();

    const dataSource = ref<any[]>([]);

    const router = useRouter();

    watchEffect(() => {
        dataSource.value =
            props.productionOrderProcessVoList?.map(item => ({
                ...item,
                isRuntimeProcess: true
            })) || [];
    });

    const go2Detail = (row: Record<string, any>) => {
        const query: Record<string, any> = {
            type: 'detail'
        };
        if (row.isRuntimeProcess) {
            query.runtimeProcessId = row.processId;
        } else {
            query.processId = row.processId;
        }
        router.push({
            path: '/processManagement/workmanshipRoute/detailWorkmanshipRouteDetail',
            query
        });
    };

    const columns = computed(() => {
        return [
            {
                title: '工艺编号',
                dataIndex: 'processCode',
                ...tableResizable(),
                customRender: ({ record, text }) => (
                    <span class="tpf-link" onClick={() => go2Detail(record)}>
                        {text}
                    </span>
                )
            },
            { title: '工艺名称', dataIndex: 'processName', ...tableResizable() },
            {
                title: '工艺版本',
                dataIndex: 'processVersion',
                ...tableResizable(),
                customRender: ({ record, text }) => {
                    return (
                        <Select
                            value={text ? Number(text) : ''}
                            onChange={val => {
                                record.processVersion = val;
                            }}
                            size="middle"
                            style={{ width: '60%' }}
                            options={formatVersionOption(record.versions || [])}
                        />
                    );
                }
            },
            {
                title: '默认工艺',
                dataIndex: 'defaultFlag',
                ...tableResizable(),
                customRender: ({ record, text }) => (
                    <Checkbox
                        checked={Number(text) === 1}
                        class="radio-check"
                        onChange={val => {
                            unref(dataSource).forEach(item => (item.defaultFlag = 0));
                            record.defaultFlag = Number(val.target.checked);
                        }}
                    />
                )
            }
        ] as TpfColumnType[];
    });
    const { tableInfo, pagination, loading, selectedRowInfo } = useAntdTable({
        api: async () => ({ list: [] }),
        rowKey: 'processCode',
        isPageAble: false,
        hasRowSelection: true
    });

    const setMaterialProcessList = (list: Record<string, any>[]) => {
        dataSource.value = unref(list).map(item => ({
            ...item,
            defaultFlag: item.defaultProcess
        }));
    };

    const delProcess = () => {
        dataSource.value = unref(dataSource).filter(
            item => !unref(selectedRowInfo).selectedRowKeys.includes(item.processCode)
        );
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
    };

    const openAddProcessModal = () => {
        openAddProcessModalDom(unref(dataSource));
    };

    const getProcessInfo = (val: any) => {
        dataSource.value = [...unref(dataSource), val];
    };
    const formatVersionOption = (list: any[]) =>
        list.map(item => ({ value: item, label: `v${item}` }));

    const submit = async () => {
        if (unref(dataSource).length) {
            const hasDefaultFlag = unref(dataSource).some(item => Number(item.defaultFlag) === 1);
            if (!hasDefaultFlag) {
                const { message } = await import('ant-design-vue');
                message.error('请选择一个默认工艺');
                return Promise.reject();
            }
        }
        return { productionOrderProcessVoList: unref(dataSource) };
    };

    defineExpose({ submit, setMaterialProcessList });
</script>

<style lang="less">
    .processInfo {
        &.tpf-collapse {
            .tpf-collapse-content {
                padding: 12px;
                box-sizing: border-box;
                height: 280px;

                .tpf-table {
                    height: 100%;
                }
            }
        }
    }
</style>
