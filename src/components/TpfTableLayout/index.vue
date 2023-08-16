<template>
    <div class="tpf-table-layout">
        <div class="operate-line" v-if="!hiddenOperate">
            <div class="operate-left">
                <a-space :size="10">
                    <slot name="operateLeft"> </slot>
                </a-space>
            </div>
            <div class="operate-right">
                <a-space :size="10">
                    <slot name="operateRightLeft"></slot>
                    <ChangeTableFontSize
                        v-if="showChangeTableFontSize"
                        v-model:fontSize="getInnerFontSize"
                    />
                    <ChangeTableGap v-if="showChangeTableGap" v-model:size="getInnerSize" />

                    <ChangeTableColumnFields @click="openColumnDialog" v-if="!!pageCode" />
                    <slot name="operateRight"></slot>
                </a-space>
            </div>
        </div>
        <slot :size="getInnerSize" :fontSize="getInnerFontSize" :pageCode="pageCode"></slot>
        <TpfColumnDialog
            v-if="showTpfColumnDialog"
            v-model:visible="showTpfColumnDialog"
            title="设置列"
            v-bind="$attrs"
            :pageCode="pageCode"
            :fontSize="getInnerFontSize"
            :size="getInnerSize"
        />
    </div>
</template>

<script setup lang="ts" name="TpfTableLayout">
    import { SizeType } from 'ant-design-vue/lib/config-provider';
    import { defineAsyncComponent, ref, computed, unref } from 'vue';
    import { PageCodeEnum } from '@/config';
    import { useStore } from '@/store';

    import { storeToRefs } from 'pinia';

    const TpfColumnDialog = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfColumnDialog.vue')
    );

    const ChangeTableFontSize = defineAsyncComponent(
        () => import('./OperateAction/ChangeTableFontSize.vue')
    );

    const ChangeTableGap = defineAsyncComponent(() => import('./OperateAction/ChangeTableGap.vue'));

    const ChangeTableColumnFields = defineAsyncComponent(
        () => import('./OperateAction/ChangeTableColumnFields.vue')
    );

    type Props = {
        showChangeTableFontSize?: boolean;
        showChangeTableGap?: boolean;
        pageCode?: PageCodeEnum; //每一个表对应的唯一code 不可有重复
        hiddenOperate?: boolean;
    };

    const props = withDefaults(defineProps<Props>(), {});

    const { cacheSearchStore } = useStore();
    const { cacheList } = storeToRefs(cacheSearchStore);
    const storeSize = computed(() => {
        if (!props.pageCode) return undefined;
        return unref(cacheList)[props.pageCode]?.pageJson?.size;
    });
    const storeFontSize = computed(() => {
        if (!props.pageCode) return 0;
        if (!unref(cacheList)[props.pageCode]) return 0;
        return unref(cacheList)[props.pageCode]?.pageJson?.fontSize;
    });

    const showTpfColumnDialog = ref(false);

    const innerFontSize = ref<14 | 18>(14);
    const innerSize = ref<SizeType>('small');

    const getInnerSize = computed({
        get() {
            if (unref(storeSize)) {
                return unref(storeSize);
            } else {
                return innerSize.value;
            }
        },
        set(val: SizeType) {
            if (unref(storeSize)) {
                if (!props.pageCode) return;
                // cacheSearchStore.$patch(state => {
                //     state.cacheList[props.pageCode!].pageJson.size = val;
                // });
                const newPageJson = {
                    ...cacheSearchStore.getPageJson(props.pageCode),
                    size: val
                };
                cacheSearchStore.savePageJson(props.pageCode, newPageJson);
            } else {
                innerSize.value = val;
            }
        }
    });
    const getInnerFontSize = computed({
        get() {
            if (unref(storeFontSize)) {
                return unref(storeFontSize) as 14 | 18;
            } else {
                return innerFontSize.value;
            }
        },
        set(val: 14 | 18) {
            if (unref(storeFontSize)) {
                if (!props.pageCode) return;
                // cacheSearchStore.$patch(state => {
                //     state.cacheList[props.pageCode!].pageJson.fontSize = val;
                // });

                const newPageJson = {
                    ...cacheSearchStore.getPageJson(props.pageCode),
                    fontSize: val
                };
                cacheSearchStore.savePageJson(props.pageCode, newPageJson);
            } else {
                innerFontSize.value = val;
            }
        }
    });

    const openColumnDialog = () => {
        showTpfColumnDialog.value = true;
    };
</script>

<style lang="less" scoped>
    .tpf-table-layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 12px;
        padding-right: 12px;
        box-sizing: border-box;

        .operate-line {
            box-sizing: border-box;
            height: 52px;
            line-height: 52px;
            display: flex;
            justify-content: space-between;
        }
    }
</style>
