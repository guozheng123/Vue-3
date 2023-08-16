<template>
    <div>
        <TpfSubmitForm
            :formList="formList"
            @onSubmit="onSubmit"
            ref="tpfForm"
            :labelCol="{ style: { width: '110px' } }"
        />
        <AddProcessFromMaterielModal
            v-if="showAddProcessFromMaterielModalDom"
            ref="addProcessFromMaterielModalDom"
            :unHasRowSelection="true"
            @getMaterialCode="getMaterialCode"
        />
    </div>
</template>

<script setup lang="tsx" name="moveInventoryForm">
    import { ref } from 'vue';
    import { useTpfSubmitForm } from '@/components';
    import { useAddProcessFromMaterielModal } from '@/components';
    import { useWarehouseApi, useProjectApi, useMaterialApi } from '@/api';
    import { unref, computed } from 'vue';
    import { useSearchSelect } from '@/hooks';
    import { debounce } from 'lodash-es';

    const warehouseApi = useWarehouseApi();
    const projectApi = useProjectApi();
    const materialApi = useMaterialApi();
    const { TpfSubmitForm } = useTpfSubmitForm();
    const {
        AddProcessFromMaterielModal,
        addProcessFromMaterielModalDom,
        openAddProcessFromMaterielModalDom,
        showAddProcessFromMaterielModalDom
    } = useAddProcessFromMaterielModal();
    const tpfForm = ref<InstanceType<typeof TpfSubmitForm> | null>(null);
    const fromData = ref<{ [key: string]: any }>({});
    const materialList = ref<any[]>([]);
    const allFromData = ref<{ [key: string]: any }>({});
    const setMap = async (k: string, val: Record<string, any>, value: string) => {
        if (k === 'outPositionCode') {
            await getTpfFromData();
            onSetKWData({ key: 'outStoreLocationCode', value, listKey: 'outPositionList' });
            allFromData.value['outPositionList'] = [val];
        }
        if (k === 'inPositionCode') {
            await getTpfFromData();
            onSetKWData({ key: 'inStoreLocationCode', value, listKey: 'inPositionList' });
            allFromData.value['inPositionList'] = [val];
        }
        if (k === 'outStoreLocationCode') {
            allFromData.value['outStoreLocationList'] = [val];
        }
        if (k === 'inStoreLocationCode') {
            allFromData.value['inStoreLocationList'] = [val];
        }
        if (k === 'outProjectCode') {
            allFromData.value['outProjectList'] = [val];
        }
        if (k === 'inProjectCode') {
            allFromData.value['inProjectList'] = [val];
        }
    };
    const formDataList = ref<any[]>([
        {
            type: 'Select',
            field: 'outPositionCode',
            label: '调出仓位名称',
            ...useSearchSelect(
                ({ value }: any) =>
                    warehouseApi.queryPositionListByParam({
                        page: 1,
                        pageSize: 20,
                        name: value
                    }),
                'outPositionCode'
            ),
            fieldNames: { label: 'name', value: 'code' }
        },
        {
            type: 'Select',
            field: 'outStoreLocationCode',
            label: '调出库位名称',
            disabled: true,
            fieldNames: { label: 'storeLocationName', value: 'storeLocationCode' },
            ...useSearchSelect(
                ({ value }: any) =>
                    warehouseApi.queryStoreLocationByParam({
                        page: 1,
                        pageSize: 20,
                        isUsed: 1,
                        storeLocationName: value,
                        positionCode: unref(fromData).outPositionCode
                    }),
                'outStoreLocationCode',
                'object'
            )
        },
        {
            type: 'Select',
            field: 'outProjectCode',
            label: '调出项目名称',
            fieldNames: { label: 'projectName', value: 'projectCode' },
            ...useSearchSelect(
                ({ value }: any) =>
                    projectApi.queryProjectListByPage({
                        page: 1,
                        pageSize: 20,
                        projectName: value,
                        tt: new Date(),
                        forbidden: '1'
                    }),
                'outProjectCode',
                'object'
            )
        },
        {
            type: 'TpfAutoComplete',
            field: 'materialCode',
            label: '物料编号',
            placeholder: '',
            showSearch: true,
            options: materialList,
            fieldNames: { label: 'materialCode', value: 'materialCode' },
            onSearchInput: (value: string) => {
                onGetMaterialList(value);
            },
            onClickIcon: () => {
                materialList.value = [];
                openAddProcessFromMaterielModalDom();
            },
            onSelectValue: (row: any, text: string) => {
                tpfForm.value?.setNewState({ materialCode: text });
            }
        },
        {
            type: 'Select',
            field: 'inPositionCode',
            label: '调入仓位名称',
            fieldNames: { label: 'name', value: 'code' },
            ...useSearchSelect(
                ({ value }: any) =>
                    warehouseApi.queryPositionListByParam({
                        page: 1,
                        pageSize: 20,
                        name: value
                    }),
                'inPositionCode'
            )
        },
        {
            type: 'Select',
            field: 'inStoreLocationCode',
            label: '调入库位名称',
            disabled: true,
            fieldNames: { label: 'storeLocationName', value: 'storeLocationCode' },
            ...useSearchSelect(
                ({ value }: any) =>
                    warehouseApi.queryStoreLocationByParam({
                        page: 1,
                        pageSize: 20,
                        isUsed: 1,
                        storeLocationName: value,
                        positionCode: unref(fromData).inPositionCode
                    }),
                'inStoreLocationCode',
                'object'
            )
        },
        {
            type: 'Select',
            field: 'inProjectCode',
            label: '调入项目名称',
            fieldNames: { label: 'projectName', value: 'projectCode' },
            ...useSearchSelect(
                ({ value }: any) =>
                    projectApi.queryProjectListByPage({
                        page: 1,
                        pageSize: 20,
                        projectName: value,
                        forbidden: '1'
                    }),
                'inProjectCode',
                'object'
            )
        }
    ]);
    const formList = computed(() => unref(formDataList) as any[]);
    const onSubmit = (data: any) => {
        fromData.value = data;
    };
    const getTpfFromData = async () => {
        await tpfForm.value?.onSubmit();
    };
    const onSetKWData = ({
        key,
        value,
        listKey
    }: {
        key: string;
        value: string;
        listKey: string;
    }) => {
        tpfForm.value?.setNewState({ [key]: '' });
        formDataList.value.forEach(item => {
            if (item.field === key) {
                item.disabled = value ? false : true;
                item.options = [];
            }
        });
        allFromData.value[listKey] = [];
    };
    // 获取  物料
    const countId = {
        materialCountId: 0
    };
    const onGetMaterialList = async (name?: string) => {
        try {
            countId.materialCountId++;
            const id = countId.materialCountId;
            const { data } = await materialApi.queryMaterialPopoutListByPage({
                page: 1,
                pageSize: 20,
                materialCode: name
            });
            if (id !== countId.materialCountId) return;
            materialList.value =
                data?.object?.list.map(item => {
                    return {
                        materialName: item.materialName,
                        materialCode: item.materialCode,
                        materialUnitName: item.materialUnitName,
                        materialUnitCode: item.materialUnitCode,
                        supervisorModeCode: item.supervisorModeCode
                    };
                }) || [];
        } catch (error) {
            console.log(error);
        }
    };
    const onGetSearchData = () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            await getTpfFromData();
            res({
                ...unref(fromData),
                ...unref(allFromData),
                materialList: unref(materialList)
            });
        });
    };
    // const reset = () => {
    //     for (const key in unref(fromData)) {
    //         tpfForm.value?.setNewState({ [key]: '' });
    //     }
    //     for (const key in unref(allFromData)) {
    //         unref(allFromData)[key] = [];
    //     }
    //     formList.value.forEach(item => {
    //         if (['outStoreLocationCode', 'inStoreLocationCode'].includes(item.field))
    //             item.disabled = true;
    //     });
    //     materialList.value = [];
    // };
    const getMaterialCode = (data: { [key: string]: any }) => {
        materialList.value = [data];
        tpfForm.value?.setNewState({ materialCode: data.materialCode });
    };

    defineExpose({ setMap, onGetSearchData });
</script>
