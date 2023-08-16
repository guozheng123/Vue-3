<template>
    <a-menu class="tpf-dropdown-overlay" @click="clickMenu">
        <a-menu-item
            v-for="item in optionList"
            :key="item.key"
            :class="[active === item.key && 'active']"
        >
            <SvgIcon :type="item.icon" :size="15" />
            <span>{{ item.type }}</span>
        </a-menu-item>
    </a-menu>
</template>

<script setup lang="ts" name="TpfDropdownOverlay">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    type Props = {
        optionList: { type: string; icon: string; key: number | string }[];
        active: any;
    };

    defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:active', val: number | string): void;
    }>();
    const clickMenu = (row: any) => {
        // console.log('row', row);
        emit('update:active', row.key);
    };
</script>

<style lang="less">
    .tpf-dropdown-overlay {
        &.ant-dropdown-menu {
            .ant-dropdown-menu-item {
                padding: 10px;
                box-sizing: border-box;
                line-height: 16px;

                &.active {
                    color: var(--ant-primary-color);
                    background-color: #f2f2f2;
                }
            }

            .ant-dropdown-menu-title-content {
                width: 88px;
                font-size: 14px;
                display: flex;
                align-items: center;

                .icon {
                    margin-right: 8px;
                }
            }
        }
    }
</style>
