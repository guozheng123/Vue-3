<template>
    <TpfCollapse :title="`${index}-下拉菜单带高亮选中 - TpfDropdownOverlay`" isHidden>
        <a-dropdown :trigger="['click']" placement="bottom" overlayClassName="tpf-dropdown">
            <a-button>按钮</a-button>
            <template #overlay>
                <TpfDropdownOverlay
                    v-model:active="currentFontSize"
                    :optionList="changeFountSizeList"
                />
            </template>
        </a-dropdown>
        <pre>{{ html }}</pre>

        <a-table :data-source="dataSource" :columns="getColumns()" :pagination="false" />
    </TpfCollapse>
</template>

<script setup lang="tsx" name="TestTpfDropdownOverlay">
    import { defineAsyncComponent, ref } from 'vue';
    import { getColumns } from '@/components/config';
    import TpfDropdownOverlay from '@/components/TpfDropdown/TpfDropdownOverlay.vue';
    const TpfCollapse = defineAsyncComponent(() => import('@/components/TpfCollapse/index.vue'));

    defineProps<{ index?: number }>();

    const currentFontSize = ref(14);

    const changeFountSizeList = [
        { type: 'jack', icon: 'icon-biaozhunziti', key: 14 },
        { type: 'rose', icon: 'icon-jiaodaziti', key: 18 }
    ];

    const dataSource = ref([
        {
            params: 'active',
            introduce: '当前高亮的 key',
            type: 'string|number',
            defaultValue: ''
        },
        {
            params: 'optionList',
            introduce: '渲染下拉框的列表',
            type: '{ type: string, icon: string, key: string|number }[]',
            defaultValue: ''
        }
    ]);

    const html = `
            <a-dropdown :trigger="['click']" placement="bottom" overlayClassName="tpf-dropdown">
                <a-button>按钮</a-button>
                <template #overlay>
                    <TpfDropdownOverlay
                        v-model:active="currentFontSize"
                        :optionList="changeFountSizeList"
                    />
                </template>
            </a-dropdown>

            const TpfDropdownOverlay = defineAsyncComponent(
                    () => import('@/components/TpfDropdown/TpfDropdownOverlay.vue')
                );
            const currentFontSize = ref(14);

            const changeFountSizeList = [
                    { type: 'jack', icon: 'icon-biaozhunziti', key: 14 },
                    { type: 'rose', icon: 'icon-jiaodaziti', key: 18 }
                ];
        `;
</script>
