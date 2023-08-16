<template>
    <TpfModal
        class="editBoard"
        v-model:visible="visible"
        title="修改看板显示"
        height="150px"
        width="500px"
    >
        <div class="modalBox">
            <a-row :gutter="24">
                <a-col :span="15">
                    <a-form-item name="boardShowFlag" label="看板显示" :labelCol="{ span: 8 }">
                        <a-select v-model:value="boardShowFlag">
                            <a-select-option value="1">是</a-select-option>
                            <a-select-option value="0">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="setVisible(false)">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="onSave">保存</a-button>
        </template>
    </TpfModal>
</template>

<script lang="tsx" setup name="editBoard">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';
    import { ref } from 'vue';
    import { message } from 'ant-design-vue';
    import { useProjectApi } from '@/api';
    const boardShowFlag = ref('1');
    const [visible, setVisible] = useRef(false);
    const projectApi = useProjectApi();
    const arr = ref<Array<number>>([]);
    const emits = defineEmits(['editBoardUpdata']);
    const open = (v: Array<number>) => {
        setVisible(!visible.value);
        arr.value = v;
    };
    const onSave = async () => {
        console.log(boardShowFlag.value);
        console.log(arr.value);
        const obj = {
            boardShowFlag: boardShowFlag.value,
            ids: arr.value
        };
        const res = await projectApi.editBoardShowByIds(obj);
        if (res.data.value) {
            message.success('更新成功！');
            setVisible(!visible.value);
            emits('editBoardUpdata');
        }
    };
    defineExpose({ open });
</script>

<style lang="less" scoped>
    .editBoard {
        &.tpf-model {
            .ant-modal-body {
                padding: 16px 20px !important;
                box-sizing: border-box;
            }
        }

        .modalBox {
            padding: 20px;
        }
    }
</style>
