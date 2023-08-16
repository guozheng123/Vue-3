<template>
    <TpfModal
        class="QCMultipleValuesModal"
        v-model:visible="visible"
        title="实际值详情"
        height="350px"
        width="600px"
    >
        <div class="modalBox">
            <div class="boxInfo">
                <a-form ref="formRef" :model="formState">
                    <a-row>
                        <a-col v-for="item in formList" :key="item.filedName" :span="item.span">
                            <a-form-item :label="item.label" :name="item.filedName">
                                <span>{{
                                    formState[item.filedName] ? formState[item.filedName] : '--'
                                }}</span>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="boxTable" style="height: 210px">
                <TpfTable
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :seq="true"
                    rowKey="id"
                />
            </div>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">关闭</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="QCMultipleValuesModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, defineAsyncComponent, computed } from 'vue';

    import { useRef } from '@/hooks';
    import { getTpfOptionEnum } from '@/config';

    const { IQCCheckResult, getLabel } = getTpfOptionEnum();

    const [visible, setVisible] = useRef(false);

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const formList = computed(() => {
        return [
            { label: '质检项目名称', filedName: 'projectName', span: 20 },
            { label: '质检标准', filedName: 'standard', span: 20 },
            {
                label: '上限',
                filedName: 'upValue',
                span: 8
            },
            { label: '标准值', filedName: 'standardValue', span: 8 },
            { label: '下限', filedName: 'downValue', span: 8 }
        ] as { label: string; filedName: string; span: number }[];
    });
    const columns = ref<any[]>([
        { title: '实际值', dataIndex: 'actualValue' },
        {
            title: '结论',
            dataIndex: 'result',
            customRender: ({ record, text }: { record: any; text: string }) => {
                return getLabel(text, IQCCheckResult);
            }
        }
    ]);
    const formState = ref<{ [key: string]: string }>({});
    const tableData = ref<any[]>([]);
    const open = (data: { [key: string]: any }) => {
        onSetInfo(data);
        setVisible(!visible.value);
    };
    const onSetInfo = (data: { [key: string]: any }) => {
        tableData.value = Array.isArray(data.inspectProjectDetailVos)
            ? data.inspectProjectDetailVos
            : [];
        formState.value = data;
    };
    defineExpose({ open });
</script>

<style lang="less">
    .QCMultipleValuesModal {
        .modalBox {
            .boxInfo {
                padding: 10px;
            }

            .ant-form .ant-form-item {
                margin-bottom: 0;
            }

            .boxTable {
                padding: 10px;

                .tpf-table {
                    height: 100%;
                }

                .ant-btn-primary {
                    border-color: #d9d9d9;
                    background: #fafafa;
                    color: #666;
                }
            }
        }
    }
</style>
