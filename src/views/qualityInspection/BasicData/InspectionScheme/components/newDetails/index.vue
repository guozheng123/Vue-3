<!-- 方案详情 -->
<template>
    <TpfAddInfoLayout title="质检方案详情" class="productionOrderDetail">
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
                                    :rules="[{ required: false, message: '请输入编号' }]"
                                >
                                    <!-- <a-input
                                        v-model:value="formList.inspectionSchemeCode"
                                        :disabled="true"
                                    >
                                    </a-input> -->
                                    {{ formList.inspectionSchemeCode }}
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item
                                    label="质检方案名称"
                                    name="inspectionSchemeName"
                                    :rules="[{ required: false, message: '请输入名称' }]"
                                >
                                    <!-- <a-input v-model:value="formList.inspectionSchemeName">
                                    </a-input> -->
                                    {{ formList.inspectionSchemeName }}
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                </TpfCollapse>

                <div class="center-title" v-if="itemArry.length">
                    <TpfCollapse title="项目信息">
                        <div class="item-box" v-for="(item, index) in itemArry" :key="index">
                            <a-form name="advanced_search" class="ant-advanced-search-form">
                                <a-row :gutter="24">
                                    <a-col :span="6">
                                        <a-form-item
                                            label="质检项目编号"
                                            :rules="[
                                                {
                                                    required: false,
                                                    message: 'Please input your username!'
                                                }
                                            ]"
                                        >
                                            <!-- <a-input
                                            v-model:value="item.qualityInspectionCode"
                                            :disabled="true"
                                        >
                                        </a-input> -->
                                            {{ item.qualityInspectionCode }}
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item
                                            label="质检项目名称"
                                            :rules="[
                                                {
                                                    required: false,
                                                    message: 'Please input your username!'
                                                }
                                            ]"
                                        >
                                            <!-- <a-input
                                            v-model:value="item.qualityInspectionName"
                                            :disabled="true"
                                        >
                                        </a-input> -->
                                            {{ item.qualityInspectionName }}
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item
                                            label="质检标准"
                                            :rules="[
                                                {
                                                    required: false,
                                                    message: 'Please input your username!'
                                                }
                                            ]"
                                        >
                                            <!-- <a-input
                                            v-model:value="item.qualityInspectionStandard"
                                            :disabled="true"
                                        >
                                        </a-input> -->
                                            {{ item.qualityInspectionStandard }}
                                        </a-form-item>
                                    </a-col>
                                    <div class="icon-colse" v-if="false">
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
                                                    v-if="item.qualityInspectionAttribute === 1"
                                                    >逻辑</a-radio
                                                >
                                                <a-radio
                                                    :value="2"
                                                    v-if="item.qualityInspectionAttribute === 2"
                                                    >数值</a-radio
                                                >
                                                <a-radio
                                                    :value="3"
                                                    v-if="item.qualityInspectionAttribute === 3"
                                                    >文本</a-radio
                                                >
                                            </a-radio-group>
                                        </a-form-item>
                                    </div>
                                </a-row>
                            </a-form>
                        </div></TpfCollapse
                    >
                </div>
            </div>
            <div class="nav-top top1" v-if="false">
                <div class="buttons-po">
                    <div class="buttons">
                        <a-space>
                            <a-button size="small" @click="routerNext">取消</a-button>
                            <a-button html-type="submit" type="primary" size="small">保存</a-button>
                        </a-space>
                    </div>
                </div>
            </div>
        </a-form>
    </TpfAddInfoLayout>
</template>

<script lang="tsx" setup>
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { message } from 'ant-design-vue';
    import router from '@/router';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, onMounted } from 'vue';
    import { useQualityApi } from '@/api';
    const qualityApi = useQualityApi();

    const formList = ref({
        inspectionSchemeCode: '',
        inspectionSchemeName: ''
    });
    const itemArry: any = ref([]);
    const indexInfo: any = ref([]);

    onMounted(async () => {
        let result: any = localStorage.getItem('newDetailsInfo');
        result = JSON.parse(result);
        const data = {
            inspectionSchemeId: result.inspectionSchemeId,
            inspectionSchemeCode: result.inspectionSchemeCode
        };
        const res = await qualityApi.getQualityInspectionSchemeDetails(data);
        formList.value = res.data.object;
        itemArry.value = res.data.object.qualityInspectionVos;
        itemArry.value.map((item: any) => {
            item.qualityInspectionAttribute = Number(item.qualityInspectionAttribute);
            indexInfo.value.push(item.qualityInspectionId);
        });
    });
    const dialog = ref<null | HTMLElement | any>(null);
    const onFinish = async (values: any) => {
        console.log('Success:', values); //收集到的数据
        const indexId = [...indexInfo.value];
        const data = { ...values, qualityInspectionIds: indexId };
        await qualityApi.createQualityInspectionScheme(data);
        message.success('保存成功！');
        router.push({ path: '/qualityInspection/BasicData/InspectionScheme' });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        return;
    };

    const routerNext = () => {
        router.push({ path: '/qualityInspection/BasicData/InspectionScheme' });
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

    .tabs-view-content {
        padding: 0;
    }

    .nav-top {
        width: 100%;
        height: 60px;
        background: #fff;
        line-height: 60px;
        padding-left: 5px;

        .nav-icon {
            margin-top: -4px;
            margin-right: 5px;
        }

        span {
            font-size: 18px;
            font-weight: 500;
            color: #1d2129;
            line-height: 28px;
        }
    }

    .before-icon {
        width: 4px;
        height: 20px;
        background: #7fb92d;
        margin: 0 5px 0 8px;
        cursor: pointer;
    }

    .center-title {
        width: 100%;
        height: 44px;
        // background: #bfa;
        line-height: 44px;

        .title {
            font-size: 18px;
            font-weight: 500;
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
        // background: #fafafa;
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

    .add-box {
        text-align: center;
        width: 100%;
        height: 80px;
        border-radius: 4px 4px 4px 4px;
        opacity: 1;
        // border: 1px dashed #fff;
        cursor: pointer;
    }
</style>
