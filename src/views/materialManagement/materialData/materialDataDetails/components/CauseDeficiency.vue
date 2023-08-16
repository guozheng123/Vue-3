<template>
    <TpfCollapse title="缺陷原因">
        <template #right>
            <a-button
                v-if="routerType !== '2'"
                class="tpf-button"
                ghost
                type="primary"
                @click="onAddCauseDeficiency"
            >
                <SvgIcon type="icon-insert" /> 添加
            </a-button>
            <a-button
                v-if="routerType !== '2'"
                class="tpf-button"
                ghost
                type="primary"
                @click="delSelectRow()"
                :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
            >
                <SvgIcon type="icon-shanchu" /> 删除
            </a-button>
        </template>
        <TpfTable
            class="t-p-[10px] t-box-border t-h-[300px]"
            v-bind="{ ...tableInfo, seq: true, pagination, columns }"
        />
        <AddCauseDeficiency ref="addCauseDeficiency" @submitAdd="submitAdd" />
    </TpfCollapse>
</template>

<script setup lang="tsx">
    import { unref, watchEffect, watch, ref, computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { TpfColumnType } from '@/types';
    import TpfTable from '@/components/TpfTable/index.vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import AddCauseDeficiency from './AddCauseDeficiency.vue';
    import { useOpenAntdModal } from '@/hooks';
    import { useAntdTable } from '@/hooks';
    import { isEmpty, uniqBy } from 'lodash-es';
    import { useMaterialApi } from '@/api';

    type Props = {
        list?: any[];
        routerType: string;
        materialTypeCode: string;
    };
    const props = withDefaults(defineProps<Props>(), {
        list: () => [],
        materialTypeCode: ''
    });
    const materialApi = useMaterialApi();

    const materialTypeCodeId = ref('');

    type dataValue = {
        defectCauseCode: string;
        defectCauseName: string;
        iqcFlag: string;
        ipqcFlag: string;
        fqcFlag: string;
        oqcFlag: string;
        defectCauseId: number;
        causeId: number;
    };
    const [addCauseDeficiency, onOpenAddCauseDeficiency] = useOpenAntdModal();

    const columns = computed<TpfColumnType[]>(() => {
        return [
            {
                title: '缺陷原因编号',
                dataIndex: 'defectCauseCode'
            },
            {
                title: '缺陷原因名称',
                dataIndex: 'defectCauseName'
            },
            {
                title: 'IQC',
                dataIndex: 'iqcFlag',
                customRender: ({ text }) =>
                    text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
            },
            {
                title: 'IPQC',
                dataIndex: 'ipqcFlag',
                customRender: ({ text }) =>
                    text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
            },
            {
                title: 'FQC',
                dataIndex: 'fqcFlag',
                customRender: ({ text }) =>
                    text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
            },
            {
                title: 'OQC',
                dataIndex: 'oqcFlag',
                customRender: ({ text }) =>
                    text === '1' ? <SvgIcon type="icon-xuanzhong" class="t-text-primary" /> : null
            }
        ];
    });

    const onAddCauseDeficiency = () => {
        onOpenAddCauseDeficiency(getSubmitList());
    };

    const { tableInfo, pagination, getDataList, selectedRowInfo, setTableList, delSelectRow } =
        useAntdTable({
            api: async () => {
                return { list: [] as dataValue[] };
            },
            rowKey: 'defectCauseCode',
            isPageAble: false,
            hasRowSelection: props.routerType !== '2'
        });

    const submitAdd = (v: any[]) => {
        const list = unref(v).map(item => ({ ...item, causeId: item.defectCauseId }));
        const newList = [...(unref(tableInfo).dataSource || []), ...list];
        setTableList(uniqBy(newList, 'defectCauseCode'));
    };

    const getSubmitList = () => {
        return unref(tableInfo).dataSource || [];
    };

    watch(
        () => [props.list, props.materialTypeCode],
        async val => {
            if (val[0] && !isEmpty(val[0])) {
                setTableList(val[0] as any);
            }
            materialTypeCodeId.value = props.materialTypeCode;

            if (val[1]) {
                const res = await materialApi.queryMaterialTypeCauseList({
                    id: materialTypeCodeId.value
                });
                const list = res.data.object.list.map((item: any) => ({
                    ...item,
                    causeId: item.defectCauseId
                }));
                setTableList(list);
            }
        },
        {
            deep: true,
            immediate: true
        }
    );

    // watchEffect(() => {
    //     if (props.list && !isEmpty(props.list)) {
    //         setTableList(props.list || []);
    //     }
    // });

    defineExpose({ getSubmitList });
</script>
