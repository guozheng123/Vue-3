<template>
    <TpfCollapse title="报工时间" gap="0">
        <a-form
            ref="reportingTimeRef"
            :model="formState"
            name="advanced_search"
            :label-col="labelCol"
            :rules="rules"
        >
            <a-card style="width: 100%">
                <a-row :gutter="24">
                    <a-col :span="6">
                        <a-form-item label="开始时间" name="startTime">
                            <a-date-picker
                                v-model:value="formState.startTime"
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="结束时间" name="endTime">
                            <a-date-picker
                                v-model:value="formState.endTime"
                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
    </TpfCollapse>
</template>

<script setup lang="ts" name="Information">
    import { ref, onMounted, computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import dayjs, { Dayjs } from 'dayjs';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import type { TpfValidateRule } from '@/types';

    import { Rule } from 'ant-design-vue/es/form';

    type Props = {
        data: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({})
    });
    const labelCol = { style: { width: '120px' } };
    const reportingTimeRef = ref();
    const formState = ref({
        startTime: '',
        endTime: ''
        // operationCode: dayjs('2023-04-24 22:00:18'),
        // operationName: dayjs('2023-04-25 22:00:18')
    });

    // console.log('isAfter', dayjs('2022-04-21 22:00:19').isAfter(dayjs('2022-04-21 22:00:18'))); // false
    // console.log('isBefore', dayjs('2022-04-21 22:00:17').isBefore(dayjs('2022-04-21 22:00:18'))); // false
    // console.log('isSame', dayjs('2022-04-20').isSame(dayjs('2022-04-20'))); // true
    const rules = computed(() => {
        return {
            startTime: [
                checkRequired({ message: '请选择开始时间' }),
                {
                    validator: async (_rule: Rule, value: string) => {
                        if (value && formState.value.endTime) {
                            if (dayjs(value).isAfter(dayjs(formState.value.endTime))) {
                                return Promise.reject('开始时间不得大于结束时间');
                            }
                            return Promise.resolve();
                        }
                    },
                    trigger: ['change']
                }
            ],
            endTime: [
                checkRequired({ message: '请选择结束时间' }),
                {
                    validator: async (_rule: Rule, value: string) => {
                        if (value && formState.value.startTime) {
                            if (dayjs(value).isBefore(dayjs(formState.value.startTime))) {
                                return Promise.reject('结束时间不得小于开始时间');
                            }
                            return Promise.resolve();
                        }
                    },
                    trigger: ['change']
                }
            ]
        } as TpfValidateRule;
    });

    const load = async () => {
        Object.keys(formState.value).forEach(key => {
            formState.value[key] = props.data[key];
        });
    };
    // const disabledDate = (current: Dayjs) => {
    //     return current && current < dayjs('2023-04-23 22:20:18').startOf('day');
    // };

    onMounted(async () => {
        load();
    });
    defineExpose({
        formState,
        reportingTimeRef
    });
</script>

<style></style>
