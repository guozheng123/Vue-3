<template>
    <div>
        <TpfCollapse title="质量信息" gap="0">
            <a-form
                ref="qualityRef"
                :model="formState"
                name="advanced_search"
                :label-col="labelCol"
            >
                <a-card style="width: 100%">
                    <a-row :gutter="24">
                        <a-col :span="24">
                            <a-form-item label="自检">
                                <a-switch
                                    :disabled="isAddReson"
                                    v-model:checked="
                                        formState.operationInspectionList[0].selfSpecialChecking
                                    "
                                    @change="specialCheckingSelectFun"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" v-if="isSelf">
                            <a-form-item
                                label="质检类型"
                                name="inspectionTypeId0"
                                :rules="[
                                    {
                                        required:
                                            formState.operationInspectionList[0]
                                                .selfSpecialChecking,
                                        message: '请选择质检类型'
                                    }
                                ]"
                            >
                                <a-select
                                    v-model:value="formState.inspectionTypeId0"
                                    show-search
                                    :options="selfType"
                                    :filter-option="filterOption"
                                    :field-names="{
                                        label: 'inspectionTypeName',
                                        value: 'inspectionTypeId'
                                    }"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" v-if="isSelf">
                            <a-form-item
                                label="质检方案"
                                name="inspectionSchemeId0"
                                :rules="[
                                    {
                                        required:
                                            formState.operationInspectionList[0]
                                                .selfSpecialChecking,
                                        message: '请选择质检方案'
                                    }
                                ]"
                            >
                                <a-select
                                    v-model:value="formState.inspectionSchemeId0"
                                    show-search
                                    :options="selfFun"
                                    :filter-option="filterOption2"
                                    :field-names="{
                                        label: 'inspectionSchemeName',
                                        value: 'inspectionSchemeId'
                                    }"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item label="专检">
                                <a-switch
                                    v-model:checked="
                                        formState.operationInspectionList[1].selfSpecialChecking
                                    "
                                    @change="specialCheckingSelectFun"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" v-if="isMajor">
                            <a-form-item
                                label="质检类型"
                                name="inspectionTypeId1"
                                :rules="[
                                    {
                                        required:
                                            formState.operationInspectionList[1]
                                                .selfSpecialChecking,
                                        message: '请选择质检类型'
                                    }
                                ]"
                            >
                                <a-select
                                    v-model:value="formState.inspectionTypeId1"
                                    show-search
                                    :options="selfType"
                                    :filter-option="filterOption3"
                                    :field-names="{
                                        label: 'inspectionTypeName',
                                        value: 'inspectionTypeId'
                                    }"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" v-if="isMajor">
                            <a-form-item
                                label="质检方案"
                                name="inspectionSchemeId1"
                                :rules="[
                                    {
                                        required:
                                            formState.operationInspectionList[1]
                                                .selfSpecialChecking,
                                        message: '请选择质检方案'
                                    }
                                ]"
                            >
                                <a-select
                                    v-model:value="formState.inspectionSchemeId1"
                                    show-search
                                    :options="selfFun"
                                    :filter-option="filterOption4"
                                    :field-names="{
                                        label: 'inspectionSchemeName',
                                        value: 'inspectionSchemeId'
                                    }"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" v-if="isMajor">
                            <a-form-item
                                label="类型"
                                name="specialCheckingType1"
                                :rules="[
                                    {
                                        required:
                                            formState.operationInspectionList[1]
                                                .selfSpecialChecking,
                                        message: '请选择类型'
                                    }
                                ]"
                            >
                                <a-select
                                    @change="selectSpecialCheckingType"
                                    v-model:value="formState.specialCheckingType1"
                                    :options="areas"
                                />
                            </a-form-item>
                        </a-col>

                        <a-col
                            :span="24"
                            v-if="
                                formState.operationInspectionList[0].selfSpecialChecking ||
                                formState.operationInspectionList[1].selfSpecialChecking
                            "
                        >
                            <div
                                v-if="reasonList?.length > 0"
                                class="reason"
                                @mouseenter="inReason"
                                @mouseleave="leaveReason"
                            >
                                <a-tag
                                    v-for="item in reasonList"
                                    :key="item.defectCauseId"
                                    closable
                                    @close="closeLog(item.defectCauseId)"
                                    >{{ item.defectCauseName }}
                                </a-tag>

                                <SvgIcon
                                    :class="{ isShow: isShow, noShow: !isShow }"
                                    cursor
                                    shadow
                                    @click="deleteReason"
                                    type="icon-shanchu"
                                    size="20"
                                />
                            </div>
                        </a-col>
                        <a-col
                            :span="24"
                            v-if="
                                formState.operationInspectionList[0].selfSpecialChecking ||
                                formState.operationInspectionList[1].selfSpecialChecking
                            "
                        >
                            <div>
                                <!-- <a-button
                                    :disabled="isAddReson"
                                    type="dashed"
                                    ghost
                                    @click="openReasonModelFun"
                                    >+ 添加缺陷原因</a-button
                                > -->
                                <a-button
                                    @click="openReasonModelFun"
                                    v-if="!isAddReson"
                                    type="dashed"
                                    >+ 添加缺陷原因</a-button
                                >
                            </div>
                        </a-col>
                    </a-row>
                </a-card>
            </a-form>
        </TpfCollapse>
        <ReasonModel :ids="ids" @get-reason="getReasonData" ref="reasonModel" />
    </div>
</template>

<script setup lang="ts">
    import { ref, unref, defineAsyncComponent, onMounted, computed, watch } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { useOpenAntdModal } from '@/hooks';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useWorkingProcedure } from '@/api';
    import { cloneDeep } from 'lodash-es';
    import { useRouter } from 'vue-router';

    const $router = useRouter();

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const ReasonModel = defineAsyncComponent(
        () => import('../workingProcedureModel/reasonModel.vue')
    );
    const [reasonModel, onOpenReasonModel] = useOpenAntdModal();
    const workingProcedure = useWorkingProcedure();
    const labelCol = { style: { width: '120px' } };
    const routerType = computed(() => $router.currentRoute.value.query.type);
    const qualityRef = ref();
    const isAddReson = ref(false);
    const reasonList = ref<any[]>([]);
    const ids: any = ref([]);
    const isShow = ref(false);
    const areas = [
        { label: '常用', value: 1 },
        { label: '装配调试', value: 2 }
    ];
    const selfType: any = ref([]);
    const selfFun: any = ref([]);
    const isSelf = ref(false); //是否自检
    const isMajor = ref(false); //是否专检
    const formState = ref({
        //----------自检
        inspectionTypeId0: '', //类型
        inspectionSchemeId0: '', //方案
        //----------专检
        inspectionTypeId1: '', //类型
        inspectionSchemeId1: '', //方案
        specialCheckingType1: 1,
        operationDefectList: [],
        operationFileList: [],
        operationInspectionList: [
            {
                selfSpecialChecking: false,
                inspectionTypeId: '',
                inspectionSchemeId: ''
            },
            {
                selfSpecialChecking: false,
                inspectionTypeId: '',
                inspectionSchemeId: '',
                specialCheckingType: '1'
            }
        ]
    });
    // watch(
    //     () => routerType,
    //     val => {
    //         if (val !== '0') {
    //             const { operationDefectList, operationInspectionList } = props.data;
    //             reasonList.value = operationDefectList;
    //             if (operationInspectionList?.length) {
    //                 for (let i = 0; i < operationInspectionList.length; i++) {
    //                     const e = operationInspectionList[i];
    //                     if (e.selfSpecialChecking == '0' && e.selfSpecialCheckingFlag == '1') {
    //                         //自检
    //                         formState.value.operationInspectionList[0].selfSpecialChecking = true;
    //                         formState.value.inspectionTypeId0 = e.inspectionTypeId;
    //                         formState.value.inspectionSchemeId0 = e.inspectionSchemeId;
    //                         isSelf.value = true;
    //                     } else if (
    //                         e.selfSpecialChecking == '1' &&
    //                         e.selfSpecialCheckingFlag == '1'
    //                     ) {
    //                         //专检
    //                         isMajor.value = true;
    //                         formState.value.operationInspectionList[1].selfSpecialChecking = true;
    //                         formState.value.inspectionTypeId1 = e.inspectionTypeId;
    //                         formState.value.inspectionSchemeId1 = e.inspectionSchemeId;
    //                         formState.value.specialCheckingType1 = Number(e.specialCheckingType);
    //                     }
    //                 }
    //             }
    //             const oldData = cloneDeep(props.data);
    //             const newData = Object.assign(props.data, formState.value);
    //             oldData.operationInspectionList = newData.operationInspectionList;
    //             formState.value = Object.assign(newData, oldData);
    //         }
    //     },
    //     {
    //         deep: true,
    //         immediate: true
    //     }
    // );
    const specialCheckingSelectFun = () => {
        //自检
        if (formState.value.operationInspectionList[0].selfSpecialChecking) {
            isSelf.value = true;
            // isMajor.value = true;
        } else {
            isSelf.value = false;
            formState.value.inspectionTypeId0 = '';
            formState.value.inspectionSchemeId0 = '';
        }
        //专检
        if (formState.value.operationInspectionList[1].selfSpecialChecking) {
            isMajor.value = true;
        } else {
            isMajor.value = false;
        }
    };
    const selectSpecialCheckingType = (value?: any) => {
        if (value === 2) {
            isAddReson.value = true;
            formState.value.inspectionSchemeId0 = '';
            formState.value.inspectionTypeId0 = '';
            formState.value.operationInspectionList[0].selfSpecialChecking = false;
            reasonList.value = [];
            isSelf.value = false;
        } else {
            isAddReson.value = false;
            formState.value.operationInspectionList[0].selfSpecialChecking = false;
            isSelf.value = false;
        }
    };
    const inReason = () => {
        if (reasonList.value) {
            if (reasonList.value.length) {
                isShow.value = true;
            }
        }
    };
    const leaveReason = () => {
        isShow.value = false;
    };
    const filterOption = (input: string, option: any) => {
        return option.inspectionTypeName.indexOf(input) >= 0;
    };
    const filterOption2 = (input: string, option: any) => {
        return option.inspectionSchemeName.indexOf(input) >= 0;
    };

    const filterOption3 = (input: string, option: any) => {
        return option.inspectionTypeName.indexOf(input) >= 0;
    };
    const filterOption4 = (input: string, option: any) => {
        return option.inspectionSchemeName.indexOf(input) >= 0;
    };
    const closeLog = (defectCauseId: string) => {
        reasonList.value = reasonList.value.filter((e: any) => {
            return e.defectCauseId !== defectCauseId;
        });
    };
    const deleteReason = () => {
        reasonList.value = [];
        reasonList.value.length = 0;
        isShow.value = false;
    };
    const openReasonModelFun = () => {
        ids.value = reasonList.value?.map((e: any) => {
            return e.defectCauseId;
        });
        onOpenReasonModel(unref(ids));
    };
    const getReasonData = (list: any) => {
        console.log(list);

        reasonList.value = unref(list) as any;
    };
    const getQualityInspectionTypeList = async () => {
        const res = await workingProcedure.getQualityInspectionTypeList({});
        selfType.value = res.data.object.list;
    };
    const getQualityInspectionSchemeList = async () => {
        const res = await workingProcedure.getQualityInspectionSchemeList({});
        selfFun.value = res.data.object.list;
    };
    const save = () => {
        formState.value.operationDefectList = reasonList.value as any;

        let selfObj: any = {}; //自检对象
        let special: any = {}; //专检对象
        let newOperationInspectionList = JSON.parse(
            JSON.stringify(formState.value.operationInspectionList)
        );
        //自检选中
        if (newOperationInspectionList[0].selfSpecialChecking) {
            selfObj.selfSpecialChecking = '0';
            selfObj.selfSpecialCheckingFlag = '1';
            selfObj.inspectionTypeId = formState.value.inspectionTypeId0;
            selfObj.inspectionSchemeId = formState.value.inspectionSchemeId0;
        } else {
            selfObj = {};
        }
        //专检选中
        if (newOperationInspectionList[1].selfSpecialChecking) {
            special.selfSpecialChecking = '1';
            special.selfSpecialCheckingFlag = '1';
            special.inspectionTypeId = formState.value.inspectionTypeId1;
            special.inspectionSchemeId = formState.value.inspectionSchemeId1;
            special.specialCheckingType = formState.value.specialCheckingType1;
        } else {
            special = {};
        }
        // formState.value.operationDefectList = reasonList.value;
        if (JSON.stringify(selfObj) !== '{}' && JSON.stringify(special) === '{}') {
            newOperationInspectionList = [];
            newOperationInspectionList.length = 0;
            newOperationInspectionList.push(selfObj);
        }
        if (JSON.stringify(selfObj) === '{}' && JSON.stringify(special) !== '{}') {
            newOperationInspectionList = [];
            newOperationInspectionList.length = 0;
            newOperationInspectionList.push(special);
        }
        if (JSON.stringify(selfObj) === '{}' && JSON.stringify(special) === '{}') {
            newOperationInspectionList = [];
            newOperationInspectionList.length = 0;
        }
        if (JSON.stringify(selfObj) !== '{}' && JSON.stringify(special) !== '{}') {
            newOperationInspectionList = [];
            newOperationInspectionList.length = 0;
            newOperationInspectionList.push(selfObj);
            newOperationInspectionList.push(special);
        }
        const ids = formState.value.operationDefectList?.map((e: any) => {
            const params = {
                defectCauseId: e.defectCauseId
            };

            return params;
        });
        return {
            operationInspectionList: newOperationInspectionList,
            operationDefectList: ids
        };
    };
    const load = () => {
        if (routerType.value !== '0') {
            const { operationDefectList, operationInspectionList } = props.data;
            reasonList.value = operationDefectList;
            if (operationInspectionList?.length) {
                for (let i = 0; i < operationInspectionList.length; i++) {
                    const e = operationInspectionList[i];
                    if (e.selfSpecialChecking === '0' && e.selfSpecialCheckingFlag === '1') {
                        //自检
                        formState.value.operationInspectionList[0].selfSpecialChecking = true;
                        formState.value.inspectionTypeId0 = e.inspectionTypeId;
                        formState.value.inspectionSchemeId0 = e.inspectionSchemeId;
                        isSelf.value = true;
                    } else if (e.selfSpecialChecking === '1' && e.selfSpecialCheckingFlag === '1') {
                        //专检
                        isMajor.value = true;
                        formState.value.operationInspectionList[1].selfSpecialChecking = true;
                        formState.value.inspectionTypeId1 = e.inspectionTypeId;
                        formState.value.inspectionSchemeId1 = e.inspectionSchemeId;
                        formState.value.specialCheckingType1 = Number(e.specialCheckingType);
                    }
                }
            }
            const oldData = cloneDeep(props.data);
            const newData = Object.assign(props.data, formState.value);
            oldData.operationInspectionList = newData.operationInspectionList;
            formState.value = Object.assign(newData, oldData);
        }
    };
    watch(
        () => formState.value.specialCheckingType1,
        val => {
            if (val) {
                if (val === 2) {
                    isAddReson.value = true;
                    isSelf.value = false;
                }
            }
        },
        {
            deep: true,
            immediate: true
        }
    );
    onMounted(() => {
        getQualityInspectionTypeList();
        getQualityInspectionSchemeList();
        load();
    });
    defineExpose({
        formState,
        qualityRef,
        save
    });
</script>

<style scoped lang="less">
    :deep(.ant-input-number-group-wrapper) {
        width: 100%;
    }

    .isShow {
        display: block;
        float: right;
    }

    .noShow {
        display: none;
        float: right;
    }

    .ant-input-number {
        width: 100%;
    }

    :deep(.ant-btn-dashed) {
        color: #4e5969;
        border-color: #d9d9d9;
        width: 100%;
        height: 52px;
        background-color: #f2f8ea;

        span {
            color: var(--ant-primary-color);
        }
    }

    :deep(.ant-form-item-label) {
        text-overflow: ellipsis;
        padding-top: 5px;
    }

    :deep(.ant-form-item-label) > label {
        display: inline;
    }

    .btn {
        width: 33px;
        background: #f7f8fa;
        text-align: center;
        padding: 0 !important;
    }

    .reason:hover {
        background: #f7f8fa;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
    }

    .reason {
        padding: 10px;

        .ant-tag {
            padding: 3px;
        }
    }
</style>
