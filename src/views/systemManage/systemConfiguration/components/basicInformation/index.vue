<!-- 基础 -->
<template>
    <div class="content-box">
        <div class="header-h1">
            <h2>{{ title }}</h2>
        </div>
        <div class="item-box" v-for="(item, index) in dataInfo" :key="index">
            <div class="text-box"
                ><h2>{{ item.parameterName }}</h2> <span>{{ item.parameterDescription }}</span></div
            >
            <div class="set-box" v-if="item.valueTypeEcode === '2'"
                ><a @click="showModal"
                    >{{ item.defaultValue }}
                    <SvgIcon type="icon-a-Frame629" style="margin-right: 5px" /></a
            ></div>
            <!-- 普通组件的封装 -->
            <configurationItem v-if="!(item.parameterName == '初始化密码')" :objectItem="item" />
        </div>
        <!-- 弹窗 -->
        <div ref="mod">
            <a-modal
                :bodyStyle="{
                    width: '520px',
                    height: '200px'
                }"
                :getContainer="():any => $refs.mod"
                v-model:visible="visible"
                title="初始化密码设置"
                :centered="true"
                @ok="handleOk"
            >
                <a-form ref="formRef" :rules="rules" :model="updataMi">
                    <div style="width: 270px; margin: 60px auto">
                        <a-form-item label="初始化密码" name="qualityInspectionName"
                            ><a-input
                                onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
                                placeholder="请输入..."
                                :maxlength="30"
                                v-model:value.trim="updataMi.qualityInspectionName"
                                style="width: 170px"
                            />
                        </a-form-item>
                    </div>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import configurationItem from '../configurationItem/index.vue';
    import { Rule } from 'ant-design-vue/es/form';
    import { checkSpecial, checkNumLetter } from '@/formRuleConfig/Tpfrules';
    import { message, FormInstance } from 'ant-design-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, onMounted, toRefs } from 'vue';
    import type { TpfValidateRule } from '@/types';

    const visible = ref<boolean>(false);
    interface Props {
        dataInfo: any;
        title: string;
    }
    const props = defineProps<Props>();
    const { dataInfo, title } = toRefs(props);
    const updataMi = ref<any>({ qualityInspectionName: '' });

    const formRef = ref<FormInstance>() as any;

    const showModal = () => {
        visible.value = true;
    };

    const handleOk = async (e: MouseEvent) => {
        await formRef.value.validateFields();
        if (updataMi.value) {
            dataInfo.value[0].defaultValue = updataMi.value.qualityInspectionName;
            message.success('暂存成功！');
        }
        visible.value = false;
    };
    const rules = {
        qualityInspectionName: [
            checkSpecial(),
            checkNumLetter(),
            {
                validator: async (_rule: Rule, value: string) => {
                    if (value.length < 6) {
                        return Promise.reject('密码长度需大于六位！');
                    }
                },
                trigger: ['blur']
            }
        ]
    } as TpfValidateRule;

    onMounted(() => {
        console.log(dataInfo.value, '更新成功');
    });
</script>

<style scoped lang="less">
    :deep(.ant-modal) {
        border-radius: 8px !important;
        overflow: hidden !important;
    }

    .content-box {
        padding: 16px;
        box-sizing: border-box;
        padding-bottom: 0;

        .header-h1 {
            font-size: 20px;
            font-weight: 500;
            color: #000;
            line-height: 28px;
        }

        .item-box {
            width: 100%;
            height: 89px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;

            .text-box {
                h2 {
                    margin-top: 24px;
                    font-size: 16px;
                    color: #4e5969;
                }

                span {
                    font-size: 12px;
                    color: #999;
                    line-height: 45px;
                }
            }

            .set-box {
                margin-top: 40px;
            }
        }
    }
</style>
