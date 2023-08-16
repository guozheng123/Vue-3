<template>
    <a-dropdown
        overlayClassName="tpf-dropdown"
        :trigger="['hover']"
        v-model:visible="visible"
        @click.prevent
    >
        <a class="ant-dropdown-link line1">
            {{ userInfo.tpfUser.enterpriseName }}
            <DownOutlined />
        </a>
        <template #overlay>
            <a-menu @click="handleMenuClick">
                <a-input
                    allowClear
                    @change="change"
                    v-model:value="userName"
                    placeholder="Basic usage"
                >
                    <template #prefix>
                        <SvgIcon type="icon-sousuo" cursor shadow :size="16" />
                    </template>
                </a-input>
                <a-menu-item v-for="item in selectOption" :key="item.title">
                    <a href="javascript:;">{{ item.title }}</a>
                    <SvgIcon
                        v-if="item.check"
                        style="float: right; color: var(--ant-primary-color)"
                        type="icon-xuanzhong"
                        class="icon-xuanzhong"
                        :size="16"
                    />
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { DownOutlined } from '@ant-design/icons-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useStore } from '@/store/index';
    import { storeToRefs } from 'pinia';
    const { userStore } = useStore();
    const { userInfo } = storeToRefs(userStore);

    const userName = ref('');

    const change = () => {
        return false;
    };
    const visible = ref(false);
    const selectOption = ref([
        { title: '1st menu item', check: false },
        { title: '2st menu item', check: true },
        { title: '3st menu item', check: false }
    ]);

    const handleMenuClick = () => {
        // console.log(key);
        visible.value = true;
    };
</script>

<style lang="less" scoped>
    .ant-dropdown-link {
        color: black;
    }

    .ant-input-affix-wrapper {
        position: relative;
        width: 96%;
        min-width: 0;
        margin-left: 2%;
        padding: 4px 11px;
        color: #666;
        font-size: 14px;
        line-height: 1.5715;
        background-color: #fff;
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        transition: all 0.3s;
        display: inline-flex;
    }

    .tpf-dropdown {
        &.ant-dropdown {
            .ant-dropdown-menu-item {
                &:hover {
                    .icon-xuanzhong {
                        color: #fff !important;
                    }
                }
            }
        }
    }
</style>
