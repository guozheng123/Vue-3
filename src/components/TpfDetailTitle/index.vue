<template>
    <a-card style="width: 100%; height: 44px">
        <a-space size="small">
            <SvgIcon
                @click="back()"
                type="icon-shangyiyehoutuifanhui-xianxingyuankuang"
                size="24"
                cursor
                shadow
                style="color: #1d2129"
            /><div class="title_name">{{ title }} </div>
        </a-space>

        <slot name="right"> </slot>
    </a-card>
</template>

<script lang="ts" setup name="TpfDetailTitle">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useRouteBackTab } from '@/hooks';

    const { routeBackTab } = useRouteBackTab();

    type Props = {
        title?: string;
        href?: string;
    };
    withDefaults(defineProps<Props>(), {
        title: '',
        href: ''
    });
    const back = () => {
        routeBackTab();
    };
</script>

<style lang="less" scoped>
    :deep(.ant-card-body) {
        padding: 8px 12px 8px 12px;

        .icon {
            // padding-top: 3px;
        }

        .title_name {
            // padding-left: 16px !important;
            color: #1d2129;
            font-size: 16px;
            padding-bottom: 4px;
        }

        .to_edit {
            float: right;
        }
    }
</style>
