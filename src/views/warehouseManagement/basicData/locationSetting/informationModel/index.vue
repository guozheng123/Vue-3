<template>
    <TpfModal
        class="InformationModel"
        v-model:visible="visible"
        title="选择仓位信息"
        height="300px"
        width="1000px"
    >
        <TpfLayout>
            <template #content>
                <TpfTableLayout>
                    <template #default="args">
                        <TpfTable
                            :scroll="{ y: 300, x: 300 }"
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                columns,
                                seq: true
                            }"
                        />
                    </template>
                </TpfTableLayout>
            </template>
        </TpfLayout>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="InformationModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWarehouseApi } from '@/api';
    import { getTpfOptionEnum } from '@/config';

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    // type Props = {
    //     code: string;
    //     orgName: string;
    // };
    const { getLabel, storePosition } = getTpfOptionEnum();

    // const props = withDefaults(defineProps<Props>(), {
    //     code: '',
    //     orgName: ''
    // });
    const code = ref('');
    const orgName = ref('');

    const warehouseApi = useWarehouseApi();

    const emit = defineEmits(['getData']);
    const [visible, setVisible] = useRef(false);

    const open = (params: { code: string; orgName: string }) => {
        code.value = params.code;
        orgName.value = params.orgName;

        getDataList();
        setVisible(!visible.value);
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '所属组织名称',
            dataIndex: 'orgName',
            key: 'orgName',
            align: 'center',
            width: 150
        },
        {
            title: '仓位代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 100
        },
        { title: '仓位名称', dataIndex: 'name', key: 'name', align: 'center', width: 100 },
        {
            title: '仓位类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 100
        },
        {
            title: '仓位属性',
            dataIndex: 'attribute',
            key: 'attribute',
            align: 'center',
            width: 80,
            customRender: val => {
                return getLabel(val.value, storePosition);
            }
        },
        {
            title: '是否启用',
            dataIndex: 'isUsed',
            key: 'isUsed',
            align: 'center',
            width: 80,
            customRender: val => {
                return val.value === 0 ? '否' : '是';
            }
        }
    ]);

    const { tableInfo, loading, getDataList, selectRow } = useAntdTable({
        api: async () => {
            const res = await warehouseApi.queryPositionListByParam({
                code: code.value,
                isUsed: '1',
                orgName: orgName.value
            });

            return res.data;
        },
        rowKey: 'id',
        isPageAble: false,
        colorRow: true
    });
    const onSave = () => {
        emit('getData', selectRow.value);
        setVisible(!visible.value);
    };
    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
