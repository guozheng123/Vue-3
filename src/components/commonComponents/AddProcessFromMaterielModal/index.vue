<template>
    <TpfModal v-model:visible="visible" title="添加物料" height="500px" width="800px">
        <TpfModalForm :loading="loading" :formList="formList" :searchForm="searchForm" />
        <TpfTable v-bind="{ ...tableInfo, pagination, columns }" />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button
                class="tpf-button"
                type="primary"
                @click="saveProcess"
                :disabled="isEmpty(sendSelect)"
            >
                保存
            </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="AddProcessFromMaterielModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useAntdTable, useRef } from '@/hooks';
    import TpfTable from '@/components/TpfTable/index.vue';
    import { ref, computed, unref } from 'vue';
    import { getTpfOptionEnum } from '@/config';
    import { useMaterialApi, useMaterialTypeApi, useSysPageFieldDiyApi } from '@/api';
    import { TpfColumnType } from '@/types';
    import { isEmpty } from 'lodash-es';
    import TpfModalForm from '@/components/TpfModal/TpfModalForm.vue';
    import { Select } from 'ant-design-vue';

    const props = defineProps<{
        unHasRowSelection?: boolean;
        isMaterialProductBOM?: boolean; //产品bom父级
        isAddMaterialProductBOM?: boolean; //产品bom子级
    }>();

    const useSysPageFieldDiy = useSysPageFieldDiyApi();

    const { managementOpt, getLabel } = getTpfOptionEnum();

    const emit = defineEmits<{
        (e: 'getMaterialCode', val: any): void;
    }>();

    const materialApi = useMaterialApi();

    const materialTypeApi = useMaterialTypeApi();

    const currentMaterialList = ref<any[]>([]);
    const materialMoldList = ref<any[]>([]);

    const [visible, setVisible] = useRef(false);

    const columns = [
        { title: '物料编码', dataIndex: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName' },
        { title: '图号', dataIndex: 'figureNum' },
        { title: '基本单位', dataIndex: 'materialUnitName' },
        { title: '物料规格', dataIndex: 'materialSpec' },
        { title: '物料类型', dataIndex: 'materialMoldName' },
        { title: '物料分类', dataIndex: 'materialTypeName' },
        { title: '生产单位', dataIndex: 'productUnitCodeName' },
        { title: '备注', dataIndex: 'remark' },
        {
            title: '产品BOM版本',
            dataIndex: 'bomVersion',
            visible: props.isAddMaterialProductBOM,
            customRender: ({ record }) => {
                if (!record.bomVersions) return null;
                record.bomVersion = record.bomVersions.find((e: any) => e.latest).bomVersion;
                return (
                    <Select
                        options={record.bomVersions}
                        fieldNames={{ label: 'bomVersionName', value: 'bomVersion' }}
                        v-model={[record.bomVersion, 'value']}
                        style={{ width: '90%' }}
                        onChange={(val: any) => {
                            unref(getTableList()).forEach(item => {
                                if (item.materialCode === record.materialCode) {
                                    record.bomVersions.forEach((item2: any) => {
                                        if (item2.bomVersion === val) {
                                            item2.latest = true;
                                        } else {
                                            item2.latest = false;
                                        }
                                    });
                                }
                            });
                            console.log(unref(getTableList()));
                        }}
                    />
                );
            }
        }
    ] as TpfColumnType[];

    const formList = computed(() => {
        return [
            { type: 'Input', field: 'materialCode', label: '物料编码', allowClear: true },
            { type: 'Input', field: 'materialName', label: '物料名称', allowClear: true },
            {
                type: 'Select',
                field: 'materialMold',
                label: '物料类型',
                allowClear: true,
                showSearch: true,
                fieldNames: { label: 'dictLabel', value: 'dictValue' },
                options: materialMoldList.value
            },
            {
                type: 'TreeSelect',
                field: 'materialTypeCode',
                label: '物料分类',
                dropdownMatchSelectWidth: false,
                allowClear: true,
                fieldNames: {
                    children: 'children',
                    label: 'label',
                    value: 'id'
                },
                treeData: materialList.value
            }
        ];
    });

    const filterCodes = computed(() => {
        return unref(currentMaterialList)
            .map(item => item.materialCode)
            .filter(o => o);
    });

    const searchForm = (val: any) => {
        pagination.value.current = 1;
        getDataList({ searchInfo: val });
    };

    const dataCallBack = (list: any[]) => {
        return list.map(item => ({
            ...item,
            supervisorModeCode: getLabel(item.supervisorModeCode, managementOpt)
        }));
    };
    const getSysDictType = async () => {
        const res = await useSysPageFieldDiy.getSysDictType({ dictType: 'material_mold' });
        materialMoldList.value = res.data.object.dictValueVos;
    };

    const {
        tableInfo,
        pagination,
        loading,
        getDataList,
        selectedRowInfo,
        selectRow,
        getTableList
    } = useAntdTable({
        api: async pageInfo => {
            const { current = 1, pageSize, searchInfo = {} } = unref(pageInfo);
            let { materialTypeCode } = searchInfo;
            materialTypeCode = materialTypeCode === 'SYFL' ? '' : materialTypeCode;
            const params = {
                ...searchInfo,
                filterCodes: unref(filterCodes),
                pageSize,
                page: current,
                materialTypeCode
            };
            if (props.isMaterialProductBOM) {
                // 是产品bom父级走这个接口
                const res = await materialApi.queryProductBomMaterialByPage(params);
                return res.data.object;
            } else if (props.isAddMaterialProductBOM) {
                // 是产品bom子级走这个接口
                const res = await materialApi.queryProductBomChildMaterialByPage(params);
                return res.data.object;
            } else {
                // 默认接口
                const res = await materialApi.queryMaterialPopoutListByPage(params);
                return res.data.object;
            }
        },
        rowKey: 'materialCode',
        hasRowSelection: !props.unHasRowSelection,
        colorRow: props.unHasRowSelection,
        dataCallBack
    });

    const materialList = ref<any[]>([]);

    const queryMaterialListByPage = async () => {
        try {
            materialList.value = await materialTypeApi
                .getMaterialTypeTree()
                .then(res => res.data.list || []);
        } catch (error) {
            console.log('error: ', error);
        }
    };
    const sendSelect = computed(() => {
        return props.unHasRowSelection ? unref(selectRow) : unref(selectedRowInfo).selectedRows;
    });

    const saveProcess = () => {
        if (!isEmpty(unref(sendSelect))) {
            emit('getMaterialCode', unref(sendSelect));
        }
        setVisible(false);
    };
    const init = () => {
        unref(tableInfo).dataSource = [];
        selectedRowInfo.value = {
            selectedRowKeys: [],
            selectedRows: []
        };
        queryMaterialListByPage();
    };

    const open = (list: any[] = [], selectMaterialCodeArr?: any[]) => {
        currentMaterialList.value = list;
        init();
        setVisible(true);
        getSysDictType();
        getDataList();

        if (selectMaterialCodeArr && selectMaterialCodeArr.length > 0) {
            selectedRowInfo.value.selectedRowKeys = selectMaterialCodeArr.map(
                (e: any) => e.materialCode
            );
            selectedRowInfo.value.selectedRows = selectMaterialCodeArr as any;
        }
    };

    defineExpose({ open });
</script>
