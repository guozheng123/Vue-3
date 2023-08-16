<template>
    <div>
        <TpfDetailTitle title="工序详情" href="/processManagement/workingProcedure">
            <template #right>
                <a-button @click="toEdit" class="tpf-button to_edit" type="primary">编辑</a-button>
            </template>
        </TpfDetailTitle>
        <div class="main">
            <!-- <a-card style="width: 100%; height: 60px">
           <SvgIcon
               @click="back()"
               type="icon-shangyiyehoutuifanhui-xianxingyuankuang"
               size="20"
               cursor
           /><span class="title_name">工序详情</span>
           <a-button @click="toEdit" class="tpf-button to_edit" type="primary">编辑</a-button>
       </a-card> -->
            <TpfAnchor :anchorList="anchorList" />
            <div class="content">
                <a-form
                    ref="formRef"
                    :model="formState"
                    name="advanced_search"
                    :label-col="labelCol"
                    :class="{ edit: isEdit }"
                >
                    <div id="a">
                        <TpfCollapse gap="0" title="基础信息">
                            <a-card style="width: 100%" v-if="!basicInformation">
                                <a-row :gutter="24">
                                    <a-col :span="6">
                                        <a-form-item label="工序编号" name="operationCode">
                                            <span>
                                                {{ formState.operationCode }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="工序名称" name="operationName">
                                            <span>
                                                {{ formState.operationName }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="工序类型" name="operationTypeCode">
                                            <a-select
                                                disabled
                                                v-model:value="formState.operationTypeCode"
                                                :options="addOperationTypeNameListOptions"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="所属工厂" name="factoryCode">
                                            <a-tree-select
                                                v-model:value="formState.factoryCode"
                                                show-search
                                                style="width: 100%"
                                                allow-clear
                                                tree-default-expand-all
                                                :tree-data="treeData"
                                                :field-names="{
                                                    children: 'branchTree',
                                                    label: 'rootName',
                                                    value: 'rootCode'
                                                }"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="启用">
                                            <a-switch
                                                disabled
                                                :checkedValue="'1'"
                                                :unCheckedValue="'0'"
                                                v-model:checked="formState.forbidden"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="备注">
                                            <span>
                                                {{ formState.remark ? formState.remark : '--' }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-card>
                        </TpfCollapse>
                    </div>

                    <div id="b">
                        <TpfCollapse gap="0" title="生产信息">
                            <a-card style="width: 100%" v-if="!productionInformation">
                                <a-row :gutter="24">
                                    <a-col :span="6">
                                        <a-form-item
                                            label="作业单元类型编号"
                                            name="workUnitTypeCode"
                                        >
                                            <span>
                                                {{ formState.workUnitTypeCode }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="作业单元类型名称">
                                            <span>
                                                {{
                                                    formState.workUnitTypeName
                                                        ? formState.workUnitTypeName
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="标准产能" name="standardCapacity">
                                            <span>
                                                {{
                                                    formState.standardCapacity
                                                        ? formState.standardCapacity
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="标准工时" name="standardTime">
                                            <span>
                                                {{
                                                    formState.standardTime
                                                        ? formState.standardTime +
                                                          getLabel(
                                                              formState.standardTimeUnit,
                                                              timeUnitOption
                                                          )
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="最大产能">
                                            <span>
                                                {{
                                                    formState.maxCapacity
                                                        ? formState.maxCapacity
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="最小产能">
                                            <span>
                                                {{
                                                    formState.minCapacity
                                                        ? formState.minCapacity
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="辅助工时" name="auxiliaryTime">
                                            <span>
                                                {{
                                                    formState.auxiliaryTime
                                                        ? formState.auxiliaryTime +
                                                          getLabel(
                                                              formState.auxiliaryTimeUnit,
                                                              timeUnitOption
                                                          )
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="计时单价" name="pricePerTimeUnit">
                                            <span>
                                                {{
                                                    formState.pricePerTime
                                                        ? formState.pricePerTime +
                                                          '元/' +
                                                          getLabel(
                                                              formState.pricePerTimeUnit,
                                                              timeUnitOption
                                                          )
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="计件单价(元)">
                                            <span>
                                                {{
                                                    formState.pricePerQuantity
                                                        ? formState.pricePerQuantity
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="工段">
                                            <span>
                                                {{
                                                    formState.workshopSectionName
                                                        ? formState.workshopSectionName
                                                        : '--'
                                                }}
                                            </span>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-card>
                        </TpfCollapse>
                    </div>

                    <div id="c">
                        <TpfCollapse gap="0" title="质量信息">
                            <a-card style="width: 100%" v-if="!qualityInformation">
                                <a-row :gutter="24">
                                    <a-col :span="24">
                                        <a-form-item label="自检">
                                            <a-switch
                                                disabled
                                                v-model:checked="
                                                    formState.operationInspectionList[0]
                                                        .selfSpecialChecking
                                                "
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="isSelf">
                                        <a-form-item label="质检类型" name="inspectionTypeId0">
                                            <a-select
                                                disabled
                                                v-model:value="formState.inspectionTypeId0"
                                            >
                                                <a-select-option
                                                    v-for="item in selfType"
                                                    :value="item.inspectionTypeId"
                                                    :key="item.inspectionTypeId"
                                                    >{{ item.inspectionTypeName }}</a-select-option
                                                >
                                            </a-select>
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
                                                disabled
                                                v-model:value="formState.inspectionSchemeId0"
                                            >
                                                <a-select-option
                                                    v-for="item in selfFun"
                                                    :value="item.inspectionSchemeId"
                                                    :key="item.inspectionSchemeId"
                                                    >{{
                                                        item.inspectionSchemeName
                                                    }}</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="24">
                                        <a-form-item label="专检">
                                            <a-switch
                                                disabled
                                                v-model:checked="
                                                    formState.operationInspectionList[1]
                                                        .selfSpecialChecking
                                                "
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="isMajor">
                                        <a-form-item label="质检类型" name="inspectionTypeId1">
                                            <a-select
                                                disabled
                                                v-model:value="formState.inspectionTypeId1"
                                            >
                                                <a-select-option
                                                    v-for="item in selfType"
                                                    :value="item.inspectionTypeId"
                                                    :key="item.inspectionTypeId"
                                                    >{{ item.inspectionTypeName }}</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="isMajor">
                                        <a-form-item label="质检方案" name="inspectionSchemeId1">
                                            <a-select
                                                disabled
                                                v-model:value="formState.inspectionSchemeId1"
                                            >
                                                <a-select-option
                                                    v-for="item in selfFun"
                                                    :value="item.inspectionSchemeId"
                                                    :key="item.inspectionSchemeId"
                                                    >{{
                                                        item.inspectionSchemeName
                                                    }}</a-select-option
                                                >
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6" v-if="isMajor">
                                        <a-form-item label="类型" name="specialCheckingType1">
                                            <a-select
                                                disabled
                                                v-model:value="formState.specialCheckingType1"
                                                :options="areas"
                                            />
                                        </a-form-item>
                                    </a-col>

                                    <a-col
                                        :span="24"
                                        v-if="
                                            formState.operationInspectionList[0]
                                                .selfSpecialChecking ||
                                            formState.operationInspectionList[1].selfSpecialChecking
                                        "
                                    >
                                        <div class="reason">
                                            <a-tag v-for="item in reasonList" :key="item.id"
                                                >{{ item.defectCauseName }}
                                            </a-tag>
                                        </div>
                                    </a-col>
                                </a-row>
                            </a-card>
                        </TpfCollapse>
                    </div>

                    <div id="d" v-if="fileList.length > 0">
                        <TpfCollapse gap="0" title="导入文件">
                            <a-card style="width: 100%" v-if="!expand">
                                <a-row :gutter="24">
                                    <a-col :span="10">
                                        <a-upload
                                            disabled
                                            :file-list="fileList"
                                            name="file"
                                            accept=".word,.excel,.pdf,.png,.jpg,.jpeg"
                                        >
                                            <!-- <a-button class="tpf-button">
                                                <SvgIcon
                                                    type="icon-daochu"
                                                    style="margin-right: 5px"
                                                />
                                                上传文件
                                            </a-button> -->
                                        </a-upload>
                                    </a-col>
                                    <!-- <a-col class="upload_title" :span="8">
                                        <div
                                            >1、支持扩展名：doc、docx、xlsx、xls、ppt、pptx、dwg、jpg、png、pdf</div
                                        >
                                        <div>2、支持文件大小10M以内</div>
                                    </a-col> -->
                                </a-row>
                            </a-card>
                        </TpfCollapse>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="WorkingProcedureDetail">
    import { ref, defineAsyncComponent, onMounted } from 'vue';
    import type { FormInstance } from 'ant-design-vue';
    import { addOperationTypeNameListOptions } from '@/config';
    import { useWorkingProcedure } from '@/api';
    import router from '@/router';
    import { cloneDeep } from 'lodash-es';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import { getTpfOptionEnum } from '@/config';

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const TpfDetailTitle = defineAsyncComponent(
        () => import('@/components/TpfDetailTitle/index.vue')
    );
    const { timeUnitOption, getLabel } = getTpfOptionEnum();

    const anchorList = ref([
        { href: 'a', title: '基础信息', visible: true },
        { href: 'b', title: '生产信息', visible: true },
        { href: 'c', title: '质量信息', visible: true },
        { href: 'd', title: '导入文件', visible: true }
    ]);
    const labelCol = { style: { width: '150px' } };
    const workingProcedure = useWorkingProcedure();
    const operationId = ref();
    const fileList = ref([]);
    const expand = ref(false);
    const basicInformation = ref(false);
    const productionInformation = ref(false);
    const qualityInformation = ref(false);
    const reasonList = ref();
    const areas = [
        { label: '常用', value: 1 },
        { label: '装配调试', value: 2 }
    ];
    const treeData = ref<any[]>([]);

    const selfType: any = ref([]);
    const selfFun: any = ref([]);
    const isSelf = ref(false); //是否自检
    const isMajor = ref(false); //是否专检
    const isEdit = ref(false);
    const formRef = ref<FormInstance>() as any;
    const formState = ref({
        operationCode: '',
        operationName: '',
        operationTypeCode: 'PRODUCTION',
        forbidden: 0,
        remark: '',
        factoryCode: '',
        workUnitTypeCode: '',
        workUnitTypeName: '',
        standardCapacity: '',
        standardTime: '',
        standardTimeUnit: 'MINUTE',
        maxCapacity: '',
        minCapacity: '',
        auxiliaryTime: '',
        auxiliaryTimeUnit: 'MINUTE',
        pricePerTime: '',
        pricePerTimeUnit: 'MINUTE',
        pricePerQuantity: '',
        workshopSectionName: '',
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

    const toEdit = () => {
        router.push({
            path: '/processManagement/workingProcedure/editWorkingProcedure',
            query: { type: '1', operationId: operationId.value }
        });
    };

    const load = async () => {
        isEdit.value = true;
        operationId.value = router.currentRoute.value.query.operationId;
        const params = { operationId: operationId.value };
        let res;
        if (router.currentRoute.value.query.type === 'route') {
            res = await workingProcedure.runtimeOperationInfo({ ...params });
        } else {
            res = await workingProcedure.getOperationInfoById({ ...params });
        }

        if (res.success === true) {
            for (let i = 0; i < res.data.object.operationFileList.length; i++) {
                const e = res.data.object.operationFileList[i];
                e.name = e.fileName;
                e.uid = e.id;
                fileList.value.push(e as never);
            }
            anchorList.value = [
                { href: 'a', title: '基础信息', visible: true },
                { href: 'b', title: '生产信息', visible: true },
                { href: 'c', title: '质量信息', visible: true },
                { href: 'd', title: '导入文件', visible: fileList.value.length > 0 }
            ];
            const { operationDefectList, operationInspectionList } = res.data.object;
            reasonList.value = operationDefectList;
            if (operationInspectionList.length) {
                for (let i = 0; i < operationInspectionList.length; i++) {
                    const e = operationInspectionList[i];
                    if (e.selfSpecialChecking == '0' && e.selfSpecialCheckingFlag == '1') {
                        //自检
                        formState.value.operationInspectionList[0].selfSpecialChecking = true;
                        formState.value.inspectionTypeId0 = e.inspectionTypeId;
                        formState.value.inspectionSchemeId0 = e.inspectionSchemeId;
                        isSelf.value = true;
                    } else if (e.selfSpecialChecking == '1' && e.selfSpecialCheckingFlag == '1') {
                        //专检
                        isMajor.value = true;
                        formState.value.operationInspectionList[1].selfSpecialChecking = true;
                        formState.value.inspectionTypeId1 = e.inspectionTypeId;
                        formState.value.inspectionSchemeId1 = e.inspectionSchemeId;
                        formState.value.specialCheckingType1 = Number(e.specialCheckingType);
                    }
                }
            }
            const oldData = cloneDeep(res.data.object);
            const newData = Object.assign(res.data.object, formState.value);
            oldData.operationInspectionList = newData.operationInspectionList;
            formState.value = Object.assign(newData, oldData);
            console.log(formState.value);
        }
    };
    const getQualityInspectionTypeList = async () => {
        const res = await workingProcedure.getQualityInspectionTypeList({});
        selfType.value = res.data.object.list;
    };
    const getQualityInspectionSchemeList = async () => {
        const res = await workingProcedure.getQualityInspectionSchemeList({});
        selfFun.value = res.data.object.list;
    };

    onMounted(async () => {
        const res = await workingProcedure.getCompanyFactoryTreeList();
        const data = res.data.list;
        treeData.value = data.map((e: any) => {
            if (e.branchTree || e.branchTree === null) {
                e.selectable = false;
            }
            return e;
        });
        getQualityInspectionTypeList();
        getQualityInspectionSchemeList();

        load();
    });
</script>

<style scoped lang="less">
    .main {
        position: relative;

        .to_edit {
            float: right;
        }

        :deep(.ant-select-selector) {
            color: black !important;
            background: white !important;
        }

        .bottom_card {
            width: 100%;
            height: 60px;
            position: fixed !important;
            bottom: 0;
            // right: 0;
            .formBtn {
                // float: right;
                margin-left: 20px;
            }
        }

        .upload_title div {
            font-size: 8px;
            height: 16px;
            line-height: 16px;
            color: #b0b4b7;
        }

        .upload_title {
            height: 24px !important;
            left: 120px;
            position: absolute;
        }

        :deep(.ant-form-item-label) {
            text-overflow: ellipsis;
            padding-top: 5px;
            // width: 95px !important;
        }

        :deep(.ant-form-item-label) > label {
            display: inline;
        }

        :deep(.edit) {
            // .ant-input {
            //     border: 0 !important;
            //     resize: none;
            // }
            .ant-select-selector {
                border: 0 !important;
            }

            .ant-select-arrow {
                display: none;
            }

            .ant-input-disabled {
                background-color: white;
            }

            // .ant-input-group-addon {
            //     display: none;
            // }
            // .ant-select-show-arrow {
            //     display: none;
            // }

            // .ant-btn {
            //     display: none;
            // }
        }

        .ant-btn.ant-btn-background-ghost {
            color: #4e5969;

            /* border-color: #fff; */
            border-color: #d9d9d9;
            width: 100%;
            height: 74px;
        }

        :deep(.ant-upload-list-item-info) {
            width: 450px;
            border-radius: 4px;
        }

        .tpf-button {
            background-color: var(--ant-primary-color);
            color: white;
        }

        .upload_title div {
            font-size: 8px;
            height: 16px;
            line-height: 16px;
            color: #b0b4b7;
        }

        .upload_info {
            margin-top: 10px;
            width: 393px;
            // height: 36px;
            padding: 10px;
            border-radius: 4px 4px 4px 4px;

            .delete {
                float: right;
            }
        }

        .upload_info:hover {
            background: #f7f8fa;
            border-radius: 4px 4px 4px 4px;
            opacity: 1;
        }

        // .reason:hover {
        //     background: #f7f8fa;
        //     border-radius: 4px 4px 4px 4px;
        //     opacity: 1;
        // }
        .reason {
            padding: 10px;

            .ant-tag {
                padding: 3px;
            }
        }

        .btn {
            width: 33px;
            background: #f7f8fa;
            text-align: center;
            padding: 0 !important;
        }

        :deep(.ant-card) {
            .ant-card-body {
                padding: 16px !important;

                .title_name {
                    padding-left: 18px !important;
                    color: #1d2129;
                    font-size: 18px;
                }
            }
        }

        .content {
            // padding: 0 20px 12px;
        }

        .ant-space {
            margin: 20px 0 20px 0;

            .gang {
                width: 4px;
                height: 20px;
                background: #7fb92d;
                border-radius: 0 0 0 0;
                opacity: 1;
            }

            .ant-form-item {
                margin-right: 70px;
            }

            .title {
                font-size: 18px;
                font-weight: 500;
                color: #1d2129;
                line-height: 24px;
            }
        }
    }
</style>
