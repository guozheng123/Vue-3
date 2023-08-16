<template>
    <a-dropdown :trigger="['hover']">
        <span class="userList">
            <a-avatar size="small">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
            <div class="useName"> {{ userInfo.tpfUser.userText }} </div>
            <SvgIcon type="icon-xialajiantou" size="16" cursor />
        </span>
        <template #overlay>
            <a-menu>
                <a-menu-item>
                    <a href="javascript:;">1st menu item</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script lang="ts" setup name="userList">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { UserOutlined } from '@ant-design/icons-vue';
    import { useStore } from '@/store/index';
    import { storeToRefs } from 'pinia';
    const { userStore } = useStore();
    const { userInfo } = storeToRefs(userStore);
</script>

<style lang="less" scoped>
    .userList {
        width: 140px;
        display: flex;
        align-items: center;
        height: 24px;

        .useName {
            font-size: 14px;
            color: #333;
            margin: 0 8px;
            flex: 1;
            .line(1);
        }
    }
</style>
