<template>
    <TpfCollapse :title="`${index}-表格主体 - TpfTableLayout`" isHidden>
        <TpfTableLayout showChangeTableFontSize showChangeTableGap>
            <template #operateLeft>
                <a-button>按钮1</a-button>
                <a-button>按钮2</a-button>
                <a-button>按钮3</a-button>
            </template>
            <template #operateRight>
                <a-button>operateRight</a-button>
            </template>
            <template #default="args">
                {{ args }}
                这里是表格区域
            </template>
        </TpfTableLayout>

        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfTableLayout">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    defineProps<{ index?: number }>();

    const dataSource = ref([
        {
            params: 'showChangeTableFontSize',
            introduce: '展示改变字体的组件',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'showChangeTableGap',
            introduce: '展示改变列高的组件',
            type: 'boolean',
            defaultValue: ''
        },
        {
            params: 'pageCode',
            introduce: '后台配置项',
            type: 'string',
            defaultValue: ''
        },
        {
            params: 'default',
            introduce: '默认插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'operateLeft',
            introduce: '左侧插槽',
            type: 'slot',
            defaultValue: ''
        },
        {
            params: 'operateRight',
            introduce: '右侧插槽',
            type: 'slot',
            defaultValue: ''
        }
    ]);

    const html = `
            <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                <template #operateLeft>
                    <a-button>按钮1</a-button>
                    <a-button>按钮2</a-button>
                    <a-button>按钮3</a-button>
                </template>
                <template #operateRight>
                    <a-button>operateRight</a-button>
                </template>
                <template #default="args">
                    {{ args }}
                    这里是表格区域
                </template>
            </TpfTableLayout>

            const TpfTableLayout = defineAsyncComponent(
                () => import('@/components/TpfTableLayout/index.vue')
            );
        `;
</script>
