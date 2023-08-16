<template>
    <div class="tpf-addInfoLayout">
        <div class="addInfoLayout-header">
            <a-space class="left" :size="3">
                <div>
                    <SvgIcon
                        type="icon-shangyiyehoutuifanhui-xianxingyuankuang"
                        :size="24"
                        cursor
                        shadow
                        style="color: #1d2129"
                        @click="goBack"
                    />
                </div>
                <div class="title">{{ title }}</div>
            </a-space>
            <a-space class="right">
                <slot name="headerRight"></slot>
            </a-space>
        </div>
        <div class="addInfoLayout-content">
            <slot></slot>
        </div>
        <div class="addInfoLayout-footer">
            <a-space class="footerLeft" :size="10">
                <slot name="footerLeft">
                    <div></div>
                </slot>
            </a-space>
            <a-space class="footerRight" :size="10">
                <slot name="footerRight" :goBack="goBack"> </slot>
            </a-space>
        </div>
    </div>
</template>

<script setup lang="ts" name="TpfAddInfoLayout">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useRouteBackTab } from '@/hooks';
    const { routeBackTab } = useRouteBackTab();
    type Props = {
        title?: string;
        backAction?: () => void;
    };

    const props = withDefaults(defineProps<Props>(), {
        title: 'title'
    });

    const goBack = () => {
        if (typeof props.backAction === 'function') {
            props.backAction();
        } else {
            routeBackTab();
        }
    };
</script>

<style lang="less" scoped>
    .tpf-addInfoLayout {
        height: 100%;
        display: flex;
        flex-direction: column;

        .addInfoLayout-header {
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            background-color: #fff;

            .title {
                font-size: 16px;
                color: #1d2129;
            }
        }

        .addInfoLayout-content {
            flex: 1;
            overflow: auto;
            padding-bottom: 10px !important;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
        }

        .addInfoLayout-footer {
            padding: 10px 12px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            background-color: #fff;
        }
    }
</style>
