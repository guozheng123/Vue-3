<template> <vNode /></template>

<script setup lang="tsx" name="TpfDescriptions">
    import { Descriptions, Tooltip } from 'ant-design-vue';
    import { filterHidden, getDescText } from '@/utils';
    import type { DescriptionsItemProp, DescriptionsProps } from 'ant-design-vue/es/descriptions';
    import { computed, unref } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import type { TpfDescColumnType } from '@/types';
    import { isArray, isEmpty } from 'lodash-es';

    type Props = {
        descriptionsProps?: DescriptionsProps;
        descriptionsItemProps?: DescriptionsItemProp;
        originalDate: Record<string, any>;
        renderList: TpfDescColumnType[];
    };

    const defaultDescriptionsProps = () =>
        ({
            column: 4,
            labelStyle: { width: '120px' }
        } as DescriptionsProps);

    const props = withDefaults(defineProps<Props>(), {
        renderList: () => [],
        originalDate: () => ({})
    });

    const innerRenderList = computed(() => {
        return filterHidden(props.renderList);
    });

    const renderFiled = (row: TpfDescColumnType) => {
        if (isEmpty(props.originalDate)) return '--';
        const { slots = {}, field = '', customRender } = row;

        if (slots.default) {
            return slots.default({
                record: props.originalDate,
                text: props.originalDate[field as any]
            });
        }
        if (typeof customRender === 'function') {
            return customRender({
                record: props.originalDate,
                text: props.originalDate[field as any]
            });
        }
        let res = '';
        if (typeof field === 'function') {
            res = field(props.originalDate);
        } else {
            res = getDescText(props.originalDate, field);
        }

        return isArray(res) ? res.join(',') : res;
    };

    const vNode = () => {
        return (
            <Descriptions
                class="tpf-descriptions"
                {...{ ...defaultDescriptionsProps(), ...props.descriptionsProps }}
            >
                {unref(innerRenderList).map((row, inx) => {
                    const { label, description } = row;
                    const { descriptionsItemProps = {}, originalDate } = props;
                    return (
                        <Descriptions.Item
                            key={inx}
                            {...descriptionsItemProps}
                            v-slots={{
                                label: () => (
                                    <>
                                        <Tooltip placement="topRight" title={label}>
                                            {label}
                                        </Tooltip>
                                        {!!description &&
                                            (originalDate[description] || description) && (
                                                <div style={{ marginLeft: '3px' }}>
                                                    <Tooltip
                                                        placement="top"
                                                        title={
                                                            originalDate[description] || description
                                                        }
                                                    >
                                                        <SvgIcon
                                                            type="icon-jieshishuoming"
                                                            size="16"
                                                            cursor
                                                        />
                                                    </Tooltip>
                                                </div>
                                            )}
                                    </>
                                )
                            }}
                        >
                            {renderFiled(row)}
                        </Descriptions.Item>
                    );
                })}
            </Descriptions>
        );
    };
</script>

<style lang="less">
    .tpf-descriptions {
        background-color: #fff;

        &.ant-descriptions {
            .ant-descriptions-view {
                padding: 10px 12px 0;
                box-sizing: border-box;
            }

            .ant-descriptions-item-label {
                > span {
                    .line(1);

                    text-align: right;
                    padding-left: 5px;
                    box-sizing: border-box;
                    width: 100%;
                }
            }
        }
    }
</style>
