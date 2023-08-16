<!-- 新增方案 -->
<template>
    <TpfAddInfoLayout title="新增质检方案" class="productionOrderDetail">
        <a-form
            :model="formList"
            name="basic"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <div>
                <TpfCollapse title="基本信息">
                    <a-card style="width: 100%; height: 68px">
                        <a-row :gutter="24">
                            <a-col :span="6">
                                <a-form-item
                                    label="质检方案编号"
                                    name="inspectionSchemeCode"
                                    :rules="[
                                        { required: true, message: '请输入质检方案编号' },
                                        {
                                            validator: validatePassChange,
                                            trigger: 'blur'
                                        }
                                    ]"
                                >
                                    <a-input
                                        v-model:value.trim="formList.inspectionSchemeCode"
                                        :maxlength="30"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item
                                    label="质检方案名称"
                                    name="inspectionSchemeName"
                                    :rules="[{ required: true, message: '请输入质检方案名称' }]"
                                >
                                    <a-input
                                        v-model:value.trim="formList.inspectionSchemeName"
                                        :maxlength="30"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                </TpfCollapse>
                <TpfCollapse title="项目信息" style="margin-bottom: 65px">
                    <LoadingSkeleton>
                        <a-card style="width: 100%" v-if="!expandClose">
                            <div class="item-box" v-for="(item, index) in itemArry" :key="index">
                                <a-form name="advanced_search" class="ant-advanced-search-form">
                                    <a-row :gutter="24">
                                        <a-col :span="6">
                                            <a-form-item
                                                label="质检项目编号"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: 'Please input your username!'
                                                    }
                                                ]"
                                            >
                                                <a-input
                                                    :maxlength="30"
                                                    v-model:value.trim="item.qualityInspectionCode"
                                                    :disabled="true"
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item
                                                label="质检项目名称"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: 'Please input your username!'
                                                    }
                                                ]"
                                            >
                                                <a-input
                                                    :maxlength="30"
                                                    v-model:value.trim="item.qualityInspectionName"
                                                    :disabled="true"
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item
                                                label="质检标准"
                                                :rules="[
                                                    {
                                                        required: true,
                                                        message: 'Please input your username!'
                                                    }
                                                ]"
                                            >
                                                <a-input
                                                    :maxlength="30"
                                                    v-model:value.trim="
                                                        item.qualityInspectionStandard
                                                    "
                                                    :disabled="true"
                                                />
                                            </a-form-item>
                                        </a-col>
                                        <div class="icon-colse" @click="colseArr(index)">
                                            <SvgIcon type="icon-guanbi" size="22" color="#B0B4B7"
                                        /></div>
                                    </a-row>
                                    <a-row style="height: 32px">
                                        <div style="margin: 25px 0 0 38px">
                                            <a-form-item
                                                label="质检属性"
                                                :rules="[
                                                    {
                                                        required: false,
                                                        message: 'Please input your username!'
                                                    }
                                                ]"
                                            >
                                                <a-radio-group
                                                    v-model:value="item.qualityInspectionAttribute"
                                                >
                                                    <a-radio
                                                        :value="1"
                                                        v-if="item.qualityInspectionAttribute == 1"
                                                        >逻辑</a-radio
                                                    >
                                                    <a-radio
                                                        :value="2"
                                                        v-if="item.qualityInspectionAttribute == 2"
                                                        >数值</a-radio
                                                    >
                                                    <a-radio
                                                        :value="3"
                                                        v-if="item.qualityInspectionAttribute == 3"
                                                        >文本</a-radio
                                                    >
                                                </a-radio-group>
                                            </a-form-item>
                                        </div>
                                    </a-row>
                                </a-form>
                            </div>

                            <div class="add-box" @click="addItem">
                                <div style="color: var(--ant-primary-color)">
                                    <SvgIcon
                                        type="icon-insert"
                                        size="16"
                                        class="nav-icon icon-cont"
                                    />
                                    <span
                                        style="font-size: #4e5969; color: var(--ant-primary-color)"
                                        >添加</span
                                    >
                                    <div class="touming"> </div>
                                </div>
                            </div>
                        </a-card>
                    </LoadingSkeleton>
                </TpfCollapse>
            </div>
            <div class="nav-top top1">
                <div class="buttons-po">
                    <div class="buttons">
                        <a-space>
                            <a-button @click="routerNext">取消</a-button>
                            <a-button html-type="submit" type="primary">保存</a-button>
                        </a-space>
                    </div>
                </div>
            </div>
        </a-form>
        <filterDialog ref="dialog" @clickFu="receive" />
    </TpfAddInfoLayout>
</template>

<script lang="tsx" setup>
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { message } from 'ant-design-vue';
    import type { Rule } from 'ant-design-vue/es/form';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, defineAsyncComponent } from 'vue';
    import { useQualityApi } from '@/api';
    import { useRouteBackTab } from '@/hooks';
    const { routeBackTab } = useRouteBackTab();

    const qualityApi = useQualityApi();

    const filterDialog = defineAsyncComponent(() => import('./filterDialog/index.vue'));
    const expandClose = ref<boolean>(false);

    const formList = ref({
        inspectionSchemeCode: '',
        inspectionSchemeName: ''
    });
    const itemArry: any = ref([]);
    const indexInfo: any = ref([]);

    const receive = (info: any, index: any) => {
        const dataInfoList = info;
        const arrInfoList = index;
        if (itemArry.value.length === 0) {
            itemArry.value = dataInfoList;
            indexInfo.value = arrInfoList;
        } else {
            dataInfoList.forEach((item: any) => {
                const info = indexInfo.value.indexOf(item.qualityInspectionId);
                console.log(info);
                if (info === -1) {
                    itemArry.value.push(item);
                    indexInfo.value.push(item.qualityInspectionId);
                } else {
                    console.log('重复新增');
                }
            });
        }
    };

    const dialog = ref<null | HTMLElement | any>(null);
    const addItem = () => {
        dialog.value.open();
    };

    const onFinish = async (values: any) => {
        const indexId = [...indexInfo.value];
        const data = { ...values, qualityInspectionIds: indexId };
        await qualityApi.createQualityInspectionScheme(data);
        message.success('保存成功！');
        routerNext();
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        return;
    };

    const colseArr = (index: number) => {
        itemArry.value.splice(index, 1);
        indexInfo.value = itemArry.value.map((item: any) => {
            return item.qualityInspectionId;
        });
        console.log(indexInfo.value);
        message.success('删除成功！');
    };

    const routerNext = () => {
        routeBackTab();
    };

    const validatePassChange = async (_rule: Rule, value: any) => {
        try {
            if (!value) return Promise.resolve();
            if (/[\u4e00-\u9fa5]/.test(value)) {
                return Promise.reject('只允许数字字母组合!');
            }
            const info = { inspectionSchemeCode: value };
            const res = await qualityApi.checkQualityInspectionSchemeCodeUnique(info);
            if (res.data.value === false) {
                return Promise.reject('方案编号重复！');
            }
            return Promise.resolve();
        } catch (error) {
            console.log('error: ', error);
        }
    };
</script>

<style scoped lang="less">
    .productionOrderDetail {
        :deep(.addInfoLayout-content) {
            // padding: 0 12px;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }

    :deep(.ant-card-body) {
        padding: 18px;
        box-sizing: border-box;
    }

    .top1 {
        position: fixed;
        bottom: 0;
    }

    .buttons-po {
        width: 100%;
        height: 100%;
        position: relative;

        .buttons {
            position: absolute;
            right: 220px;
        }
    }

    .nav-top {
        width: 100%;
        height: 60px;
        background: #fff;
        line-height: 60px;
        padding-left: 5px;
    }

    .icon-cont {
        cursor: pointer;
    }

    .icon-colse {
        position: absolute;
        right: 10px;
        top: 6px;
        cursor: pointer;
    }

    .item-box {
        background: #fafafa;
        padding: 20px;
        height: 128px;
        box-sizing: border-box;
        position: relative;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
    }

    :deep(.ant-col-6) {
        height: 32px;
    }

    .add-box,
    .touming {
        text-align: center;
        line-height: 52px;
        width: 100%;
        height: 52px;
        border-radius: 4px 4px 4px 4px;
        border: 1px dashed var(--ant-primary-color);
        cursor: pointer;
    }

    .add-box {
        position: relative;
    }

    .touming {
        position: absolute;
        top: 0;
        width: 100%;
        background: var(--ant-primary-color);
        opacity: 0.09;
        border: none;
        z-index: -99px;
    }
</style>
