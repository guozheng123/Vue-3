<template>
    <vNode />
</template>

<script setup lang="tsx" name="TpfTableOperateColumn">
    import { DownOutlined } from '@ant-design/icons-vue';
    import { Dropdown, Menu, MenuItem, MenuDivider } from 'ant-design-vue';
    import { computed, unref, useAttrs } from 'vue';
    import { isEmpty } from 'lodash-es';
    import { filterHidden } from '@/utils';
    import { TpfOperateBtn } from '@/types';

    type Props = {
        defaultBtn?: TpfOperateBtn[];
        moreBtn?: TpfOperateBtn[];
    };
    const props = withDefaults(defineProps<Props>(), {
        defaultBtn: () => [] as TpfOperateBtn[],
        moreBtn: () => [] as TpfOperateBtn[]
    });
    const attrs = useAttrs();

    const showMoreBtn = computed(() => {
        if (isEmpty(props.moreBtn)) return [];
        return filterHidden(props.moreBtn);
    });

    const showDefaultBtn = computed(() => {
        if (isEmpty(props.defaultBtn)) return [];
        return filterHidden(props.defaultBtn);
    });

    const vNode = () => {
        if (isEmpty(unref(showDefaultBtn)) && isEmpty(unref(showMoreBtn))) {
            return '--';
        }
        return (
            <ul class="tpf-operateColumn">
                {!isEmpty(unref(showDefaultBtn)) &&
                    unref(showDefaultBtn).map((item, inx) => {
                        const { title, onClick, disabled } = item;
                        const renderTitle = typeof title === 'function' ? title() : title;
                        return (
                            <li
                                key={inx}
                                class="tpf-operateColumn-item"
                                style={{
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    color: disabled ? '#bbb' : 'var(--ant-primary-color)'
                                }}
                                onClick={() => {
                                    if (disabled) return;
                                    onClick(attrs, renderTitle);
                                }}
                            >
                                {renderTitle}
                            </li>
                        );
                    })}
                {!isEmpty(unref(showMoreBtn)) && (
                    <Dropdown
                        trigger={['hover']}
                        placement="bottom"
                        v-slots={{
                            overlay: () => (
                                <Menu>
                                    {unref(showMoreBtn).map((item, inx) => {
                                        const { title, onClick, disabled } = item;
                                        const renderTitle =
                                            typeof title === 'function' ? title() : title;
                                        return (
                                            <>
                                                <MenuItem key={inx}>
                                                    <a
                                                        href="javascript:;"
                                                        style={{
                                                            cursor: disabled
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                            color: disabled
                                                                ? '#bbb'
                                                                : 'var(--ant-primary-color)'
                                                        }}
                                                        onClick={() => {
                                                            if (disabled) return;
                                                            onClick(attrs, renderTitle);
                                                        }}
                                                    >
                                                        {renderTitle}
                                                    </a>
                                                </MenuItem>
                                                <MenuDivider />
                                            </>
                                        );
                                    })}
                                </Menu>
                            )
                        }}
                    >
                        <li class="tpf-operateColumn-item">
                            <span style={{ marginRight: '7px' }}>更多</span>
                            <DownOutlined />
                        </li>
                    </Dropdown>
                )}
            </ul>
        );
    };
</script>

<style lang="less">
    .tpf-operateColumn {
        display: flex;
        justify-content: center;

        .tpf-operateColumn-item {
            // flex: 1 auto auto;
            padding: 0 10px;
            box-sizing: border-box;
            white-space: nowrap;
            cursor: pointer;
            color: var(--ant-primary-color);
            box-sizing: border-box;

            & + .tpf-operateColumn-item {
                position: relative;

                &::after {
                    position: absolute;
                    left: 0;
                    content: '';
                    height: 60%;
                    width: 1px;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color: var(--ant-primary-color);
                }
            }
        }
    }

    .ant-dropdown-menu-item {
        transition: all 0s !important;
    }
</style>
