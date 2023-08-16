<template>
    <a-dropdown placement="bottom" :trigger="['click']" overlayClassName="tpf-dropdown">
        <a class="ant-dropdown-link" @click.prevent>
            <SvgIcon type="icon-diandiandian" size="24" shadow />
        </a>
        <template #overlay>
            <a-menu @click="clickMenu">
                <!-- <a-menu-item>
                    <Space :size="5">
                        <SvgIcon type="icon-guanwang" size="20" />
                        <span>智造家官网</span>
                    </Space>
                </a-menu-item> -->
                <a-menu-item>
                    <Space :size="5">
                        <SvgIcon type="icon-xinshouyindao" size="20" />
                        <span>新手引导</span>
                    </Space>
                </a-menu-item>
                <a-menu-item key="changeColor">
                    <Space :size="5">
                        <SvgIcon type="icon-qiehuanzhuti" size="20" />
                        <span>切换主题</span>
                    </Space>
                </a-menu-item>
                <a-sub-menu key="sub2" title="切换语言" placement="left">
                    <template #icon>
                        <SvgIcon type="icon-qiehuanyuyan" size="20" />
                    </template>
                    <a-menu-item @click="toggleLocale('zh-CN')">中文</a-menu-item>
                    <a-menu-item @click="toggleLocale('en-US')">英文</a-menu-item>
                </a-sub-menu>
                <a-menu-item>
                    <Space :size="5">
                        <SvgIcon type="icon-xiugaimima" size="20" />
                        <span>修改密码</span>
                    </Space>
                </a-menu-item>
                <a-menu-item>
                    <Space :size="5">
                        <SvgIcon type="icon-qingchuhuancun" size="20" />
                        <span>清除缓存</span>
                    </Space>
                </a-menu-item>
                <a-menu-item key="logout">
                    <Space :size="5">
                        <SvgIcon type="icon-zhuxiaoxitong" size="20" />
                        <span>注销系统</span>
                    </Space>
                </a-menu-item>
                <a-menu-item key="admin">
                    <Space :size="5">
                        <SvgIcon type="icon-zhuxiaoxitong" size="20" />
                        <span>管理中台</span>
                    </Space>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ProjectSetting ref="target" />
</template>

<script lang="ts" setup name="OperateMenu">
    import { useRouter } from 'vue-router';

    import { Space } from 'ant-design-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import type { LocaleType } from '@/locales/config';
    import { useLocale } from '@/locales/useLocale';
    import { ProjectSetting } from '../index';
    import { useOpenAntdModal } from '@/hooks';
    import { useStore } from '@/store/index';

    const [target, onOpenModal] = useOpenAntdModal<InstanceType<typeof ProjectSetting>>();

    const router = useRouter();

    const { userStore } = useStore();

    const clickMenu = (val: any) => {
        if (val.key === 'changeColor') {
            onOpenModal();
            return;
        }
        if (val.key === 'logout') {
            userStore.logout();
            return;
        }
        if (val.key === 'admin') {
            userStore.logout(false);
            router.push({ path: '/admin' });
            return;
        }
    };

    const { changeLocale } = useLocale();
    const toggleLocale = async (lang: LocaleType) => {
        await changeLocale(lang as LocaleType);
        router.go(0);
    };
</script>

<style lang="less" scoped>
    .style-checbox-item {
        position: relative;
        cursor: pointer;

        &.active::after {
            content: '✔';
            position: absolute;
            bottom: 10px;
            right: 12px;
            color: var(--ant-primary-color);
        }
    }

    input[type='color'] {
        width: 20px;
        height: 20px;
        border: 0;
        padding: 0;
        outline: none;
        appearance: none;
        position: relative;

        &::-webkit-color-swatch-wrapper {
            background: var(--custom-color);
        }

        &::-webkit-color-swatch {
            display: none;
        }
    }

    .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .space-align-block {
        margin: 8px 4px;
        border: 1px solid #40a9ff;
        padding: 4px;
        flex: none;
    }

    .space-align-block .mock-block {
        display: inline-block;
        padding: 32px 8px 16px;
        background: rgba(150, 150, 150, 0.2);
    }
</style>
