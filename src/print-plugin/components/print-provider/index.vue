<template>
    <VNode />
</template>

<script setup lang="tsx">
    import { ResQueryPrintTemplateFields } from '@/api';
    import { ref, useCssModule, onMounted, nextTick } from 'vue';
    import { hiprint } from 'vue-plugin-hiprint';
    type Props = {
        allRenderPrintFields?: ResQueryPrintTemplateFields;
        renderHelpName: string;
        renderHeaderListName: string;
    };
    const props = defineProps<Props>();

    const providerContainerDom = ref<HTMLDivElement>({} as HTMLDivElement);

    const providerContainerDom2 = ref<HTMLDivElement>({} as HTMLDivElement);

    const buildLeftElement = () => {
        providerContainerDom.value.innerHTML = '';

        hiprint.PrintElementTypeManager.build(
            providerContainerDom.value,
            props.renderHeaderListName
        );
    };

    const renderHelp = () => {
        providerContainerDom2.value.innerHTML = '';
        hiprint.PrintElementTypeManager.build(providerContainerDom2.value, props.renderHelpName);
    };

    onMounted(async () => {
        await nextTick();
        buildLeftElement();
        renderHelp();
    });

    const styles = useCssModule('provider');
    const VNode = () => {
        return (
            <div class={styles.contentProvider}>
                <div class="field-layout scrollbarColor" ref={providerContainerDom} />
                <div class="common-layout" ref={providerContainerDom2} />
            </div>
        );
    };
</script>

<style lang="less" module="provider">
    .contentProvider {
        display: flex;
        flex-direction: column;
        :global {
            .field-layout {
                flex: 1 0 0;
                overflow: auto;
            }
            .common-layout,
            .field-layout {
                > .hiprint-printElement-type {
                    display: flex;
                    flex-direction: column;
                    ul {
                        display: flex;
                        flex-wrap: wrap;
                        margin-top: 10px;
                        width: 100%;
                        justify-content: flex-start;
                        > li {
                            padding: 5px;
                            width: 48%;
                            margin-bottom: 5px;
                            text-align: center;
                            border: 1px solid var(--ant-primary-color);
                            &:nth-child(odd) {
                                margin-right: 5px;
                            }
                            .ep-draggable-item {
                                height: 100%;
                                width: 100%;
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
