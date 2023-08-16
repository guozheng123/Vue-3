<template>
    <TpfModal
        v-model:visible="visible"
        title="确定强制完工"
        class="forcedCompleteModal"
        height="300px"
        v-bind="$attrs"
    >
        <!-- <div>
            <span style="color: red">
                以下生产订单存在未完工的工单，此操作 会导致其下的作业工单全部完工 <br />
                此操作不可回退，对生产影响较大，请谨慎操作！
            </span>
        </div> -->
        <TpfTable
            :dataSource="dataSource"
            :columns="tableColumns"
            :pagination="false"
            :rowKey="rowKey"
        />

        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="sure">确定</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx" name="forcedCompleteModal">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { tableResizable } from '@/config';
    import { useRef } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import type { GetRowKey } from 'ant-design-vue/es/table/interface';
    import { ref, unref, defineAsyncComponent, computed } from 'vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    type Props = {
        columns?: TpfColumnType[];
        rowKey?: string | GetRowKey<any>;
    };

    const props = withDefaults(defineProps<Props>(), {
        rowKey: 'message'
    });

    const emit = defineEmits<{
        (e: 'sure'): void;
    }>();
    const delColumns = computed(() => {
        return [
            { title: '生产订单号', dataIndex: 'productionOrderCode', ...tableResizable() },
            { title: '未完工的工单数量', dataIndex: 'count', ...tableResizable() }
        ] as TpfColumnType[];
    });

    const tableColumns = computed(() => {
        return props.columns || unref(delColumns);
    });

    const [visible, setVisible] = useRef(false);

    const dataSource = ref<any[]>([]);

    const open = (val: any[]) => {
        dataSource.value = unref(val) || [];
        setVisible(true);
    };

    const sure = () => {
        emit('sure');
        setVisible(false);
    };

    defineExpose({ open });
</script>
