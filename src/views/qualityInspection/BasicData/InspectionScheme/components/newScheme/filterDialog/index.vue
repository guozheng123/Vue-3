<template>
    <TpfModal
        class="WorknModel"
        v-model:visible="visible"
        width="800px"
        title="新增项目信息"
        height="500px"
        :bodyStyle="{ overflow: 'hidden', height: '300px' }"
    >
        <a-form layout="inline" :model="formState" style="width: 92%; margin: 0 auto">
            <a-form-item label="质检项目编号">
                <a-input v-model:value.trim="formState.qualityInspectionCode" :maxlength="30" />
            </a-form-item>
            <a-form-item label="质检项目名称">
                <a-input v-model:value.trim="formState.qualityInspectionName" :maxlength="30" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" @click="onCheck">查询</a-button>
            </a-form-item>
        </a-form>
        <TpfTable v-bind="{ ...tableInfo, pagination, columns }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submit">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="WorknModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { message } from 'ant-design-vue';
    import { ref, defineAsyncComponent, unref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { tableResizable } from '@/config';
    import { useAntdTable, useRef } from '@/hooks';
    import { useQualityApi } from '@/api';
    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);
    const qualityApi = useQualityApi();
    const [visible, setVisible] = useRef(false);
    const emit = defineEmits(['clickFu']);

    const open = () => {
        unref(pagination).current = 1;

        getDataList();
        setVisible(!visible.value);
    };

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        qualityInspectionCode: '',
        qualityInspectionName: '',
        createUser: '',
        qualityInspectionAttribute: '',
        startDatetime: '',
        endDatetime: ''
    });

    const filterParameters = ref<any>(['', '逻辑', '数值', '文本']);
    const infoData = ref([]);

    const onCheck = () => {
        unref(pagination).current = 1;

        getDataList();
    };

    const submit = () => {
        const data = [...infoData.value];
        const indexId = unref(selectedRowInfo).selectedRowKeys;
        console.log(indexId);
        const dataArry: any = [];
        indexId.forEach(it => {
            data.forEach((item: any) => {
                if (it === item.qualityInspectionId) {
                    item.qualityInspectionAttribute = Number(item.qualityInspectionAttribute);
                    dataArry.push(item);
                }
            });
        });
        console.log(dataArry, 'dataArry');
        emit('clickFu', dataArry, indexId);
        message.success('保存成功');
        setVisible(false);
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '质检项目编号',
            dataIndex: 'qualityInspectionCode',
            key: 'qualityInspectionCode',
            ...tableResizable()
        },
        {
            title: '质检项目',
            dataIndex: 'qualityInspectionName',
            key: 'qualityInspectionName',
            ...tableResizable(),
            resizable: true
        },
        {
            title: '质检标准',
            dataIndex: 'qualityInspectionStandard',
            key: 'qualityInspectionStandard',
            ...tableResizable(),
            resizable: true
        },
        {
            title: '上限',
            dataIndex: 'upperlimitValue',
            key: 'upperlimitValue',
            ...tableResizable()
        },
        {
            title: '标准值',
            dataIndex: 'standardValue',
            key: 'standardValue',
            ...tableResizable()
        },
        {
            title: '下限',
            dataIndex: 'lowerlimitValue',
            key: 'lowerlimitValue',
            ...tableResizable()
        },
        {
            title: '质检属性',
            dataIndex: 'qualityInspectionAttribute',
            key: 'qualityInspectionAttribute',
            ...tableResizable(),
            customRender: (val: any) => {
                return <span>{filterParameters.value[Number(val.value)]}</span>;
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            ...tableResizable()
        },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            key: 'createDatetime',
            ...tableResizable()
        }
    ]);

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize } = unref(pageInfo);
            const res = await qualityApi.getQualityInspectionList({
                ...formState.value,
                page,
                pageSize: pageSize
            });
            infoData.value = res.data.object.list;
            return res.data.object;
        },
        rowKey: 'qualityInspectionId',
        isPageAble: true,
        hasRowSelection: true
    });

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-table-layout) {
        height: 90% !important;
    }

    :deep(.tpf-layout-content) {
        margin-top: 0 !important;

        .operate-line {
            height: 0 !important;
        }
    }
</style>
