<template> <VNode /> </template>

<script setup lang="tsx">
    import { Space, Button, Menu, MenuItem, Dropdown } from 'ant-design-vue';
    import { filterHidden } from '@/utils';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { isEmpty } from 'lodash-es';
    import { renderTitle } from '@/hooks';
    import { DownOutlined } from '@ant-design/icons-vue';

    type Props = {
        btnList: { icon?: Record<string, any>; title: string | (() => any) }[];
    };
    const props = defineProps<Props>();
    const VNode = () => {
        const { btnList } = props;
        return (
            <Space size={10}>
                {filterHidden(btnList).map((item, inx) => {
                    const {
                        type = 'Button',
                        title,
                        slots = {},
                        icon = {},
                        props = {},
                        ...args
                    } = item;
                    if (type === 'Button') {
                        return (
                            <Button
                                key={inx}
                                class="tpf-button"
                                v-slots={slots}
                                {...args}
                                {...props}
                            >
                                {!isEmpty(icon) && <SvgIcon {...icon} />}
                                {renderTitle(title)}
                            </Button>
                        );
                    }
                    if (type === 'Dropdown') {
                        return (
                            <Dropdown
                                v-slots={{
                                    ...slots,
                                    overlay: () => {
                                        if (!slots.overlay) return null;
                                        const overlay = slots.overlay();
                                        return (
                                            <Menu onClick={overlay.onClick}>
                                                {overlay.menu.map((menu: any, inx: number) => {
                                                    return (
                                                        <MenuItem key={menu.key}>
                                                            {renderTitle(menu.title)}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Menu>
                                        );
                                    }
                                }}
                            >
                                <Button key={inx} class="tpf-button" {...args} {...props}>
                                    {renderTitle(title)}
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        );
                    }
                })}
            </Space>
        );
    };
</script>

<style lang="less" scoped></style>
