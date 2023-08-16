<template> <VNode /> </template>

<script setup lang="tsx">
    import { TabPane, Tabs } from 'ant-design-vue';
    import { useAttrs, useSlots, useCssModule } from 'vue';
    type Props = {
        tabPaneList: any[];
        fieldNames?: { key: string; tab: string };
    };
    const props = withDefaults(defineProps<Props>(), {
        fieldNames: () => ({ key: 'key', tab: 'tab' })
    });
    const emit = defineEmits<{
        (e: 'tabChange', val: any): void;
    }>();

    const attrs = useAttrs();

    const slots = useSlots();

    const style = useCssModule('tpfTab');

    const VNode = () => {
        const { tabPaneList = [], fieldNames, ...argsProps } = props;
        return (
            <div class={style.tpfTab}>
                <Tabs {...attrs} {...argsProps} onChange={val => emit('tabChange', val)}>
                    {tabPaneList.map(item => {
                        return <TabPane key={item[fieldNames.key]} tab={item[fieldNames.tab]} />;
                    })}
                </Tabs>
                {slots.default && slots.default()}
            </div>
        );
    };
</script>

<style lang="less" module="tpfTab">
    .tpfTab {
        height: 100%;
        display: flex;
        flex-direction: column;
        :global {
            .ant-tabs {
                background-color: #fff;
                .ant-tabs-nav {
                    margin: 0;
                }
                .ant-tabs-nav-wrap {
                    padding-left: 46px;

                    .ant-tabs-tab {
                        padding-left: 13px;
                        padding-right: 13px;
                    }
                }
            }
        }
    }
</style>
