<template>
    <div>
        <TpfModal
            class="DelModal"
            v-model:visible="visible"
            height="280px"
            title="详细报告"
            :footer="null"
        >
            <a-table
                :dataSource="dataSource"
                :columns="columns"
                :scroll="{ y: 200 }"
                :pagination="false"
                rowKey="workshopCode"
                size="small"
            />
        </TpfModal>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import type { TpfColumnType } from '@/types';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';
    const [visible, setVisible] = useRef(false);
    type DataItem = {
        workshopCode: string;
        deleteType: number;
        message: string;
    };
    const columns: TpfColumnType[] = [
        {
            title: '消息',
            width: 100,
            dataIndex: 'workshopCode',
            key: 'workshopCode',
            fixed: 'left'
        },
        {
            title: '结果',
            width: 60,
            dataIndex: 'deleteType',
            key: 'deleteType',
            fixed: 'left',
            customRender: ({ text }) => (text === 1 ? '删除成功' : '删除失败')
        },
        { title: '原因', dataIndex: 'message', width: 150 }
    ];
    const dataSource = ref<DataItem[]>();
    const open = (v: any) => {
        dataSource.value = v;
        setVisible(!visible.value);
    };
    defineExpose({
        open
    });
</script>

<style scoped lang="less">
    .DelModal {
        .ant-modal-body {
            padding-top: 24px !important;
        }
    }
</style>
