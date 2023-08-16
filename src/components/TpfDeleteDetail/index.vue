<template>
    <TpfModal
        v-model:visible="visible"
        title="详细报告"
        class="TpfDeleteDetail"
        height="300px"
        :footer="null"
        v-bind="$attrs"
    >
        <LoadingSkeleton>
            <TpfTable
                :dataSource="dataSource"
                :columns="tableColumns"
                :pagination="false"
                :rowKey="rowKey"
            />
        </LoadingSkeleton>
    </TpfModal>
</template>

<script setup lang="tsx" name="TpfDeleteDetail">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { tableResizable } from '@/config';
    import { useRef } from '@/hooks';
    import type { TpfColumnType, TpfDelInfo } from '@/types';
    import { Badge } from 'ant-design-vue';
    import type { GetRowKey } from 'ant-design-vue/es/table/interface';
    import { ref, unref, defineAsyncComponent, computed } from 'vue';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    type Props = {
        columns?: TpfColumnType<TpfDelInfo>[];
        rowKey?: string | GetRowKey<any>;
    };

    const props = withDefaults(defineProps<Props>(), {
        rowKey: 'message'
    });
    const delColumns = computed(() => {
        return [
            { title: '消息', dataIndex: 'message', ...tableResizable() },
            {
                title: '状态结果',
                dataIndex: 'result',
                ...tableResizable(),
                width: 100,
                customRender: ({ text }) => {
                    if (text === '失败') {
                        return <Badge color="#f00" text={text ? text : '失败'} />;
                    }
                    return <Badge color="#0f0" text={text ? text : '成功'} />;
                }
            },
            { title: '原因', dataIndex: 'reason', ...tableResizable(), width: 300 }
        ] as TpfColumnType<TpfDelInfo>[];
    });

    const tableColumns = computed(() => {
        return props.columns || unref(delColumns);
    });

    const [visible, setVisible] = useRef(false);

    const dataSource = ref<TpfDelInfo[]>([]);

    const open = (val: TpfDelInfo[]) => {
        dataSource.value = unref(val) || [];
        setVisible(true);
    };

    defineExpose({ open });
</script>
