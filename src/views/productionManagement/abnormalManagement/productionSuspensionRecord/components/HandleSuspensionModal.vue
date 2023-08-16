<template>
    <TpfModal
        v-model:visible="visible"
        :title="modalType === 'start' ? '开始处理-生产暂停记录' : '结束处理-生产暂停记录'"
        height="345px"
        width="800px"
    >
        <a-form
            layout="inline"
            ref="formRef"
            :model="formState"
            class="tpf-form"
            :rules="rules"
            :labelCol="{ style: { width: '98px' } }"
        >
            <a-row style="width: 100%">
                <a-col :span="12">
                    <a-form-item label="处理人">
                        <a-input :value="userInfo.tpfUser.userText" disabled />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label="modalType === 'start' ? '开始处理时间' : '结束处理时间'"
                        name="operateTime"
                    >
                        <a-date-picker
                            class="t-w-full"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            format="YYYY-MM-DD HH:mm:ss"
                            v-model:value="formState.operateTime"
                            show-time
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="解决方案" name="solution">
                        <a-textarea v-model:value="formState.solution" :rows="4" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveHandle"> 保存 </a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { useRef, useAntdForm } from '@/hooks';
    import { useReportProgressPauseApi } from '@/api';
    import type { ReqStart } from '@/api';
    import type { TpfValidateRule } from '@/types';
    import { ref, unref } from 'vue';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import dayjs from 'dayjs';

    const { userStore } = useStore();
    const { userInfo } = storeToRefs(userStore);

    type Props = {
        selectedRowKeys: (number | string)[];
    };

    const props = defineProps<Props>();

    const modalType = ref<'start' | 'finish'>('start');

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const reportProgressPauseApi = useReportProgressPauseApi();

    const rules = {
        operateTime: [checkRequired()]
    } as TpfValidateRule;

    const [visible, setVisible] = useRef(false);
    const { formRef, submitForm } = useAntdForm<ReqStart>();

    const formState = ref<ReqStart>({} as ReqStart);

    const saveHandle = async () => {
        const res = await submitForm();
        const params = (props.selectedRowKeys as number[]).map(id => ({
            ...res,
            id,
            operator: userInfo.value.tpfUser.userId
        }));
        if (unref(modalType) === 'start') {
            await reportProgressPauseApi.start(params);
        } else {
            await reportProgressPauseApi.finish(params);
        }
        const { message } = await import('ant-design-vue');
        message.success('操作成功');

        emit('updateTable');

        setVisible(false);
    };

    const open = (type: 'start' | 'finish', solution = '') => {
        formState.value = {
            operateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            solution
        } as ReqStart;
        modalType.value = type;
        setVisible(true);
    };

    defineExpose({ open });
</script>
