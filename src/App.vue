<template>
    <ConfigProvider
        :locale="getAntdLocale"
        :input="{ autocomplete: 'off' }"
        :transformCellText="transformCellText"
        virtual
    >
        <router-view #="{ Component }">
            <component :is="Component" />
        </router-view>
    </ConfigProvider>
</template>

<script setup lang="tsx">
    import { watchEffect, unref } from 'vue';
    import { useRoute } from 'vue-router';
    import { ConfigProvider } from 'ant-design-vue';
    import { transformI18n } from './hooks/useI18n';
    import { useLocale } from '@/locales/useLocale';
    import 'dayjs/locale/zh-cn';
    import 'dayjs/locale/en-gb';
    import { useStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import type { TransformCellTextProps } from 'ant-design-vue/es/table/interface';
    import { useCheckNewVision } from '@/hooks';

    const route = useRoute();
    const { getAntdLocale } = useLocale();
    const { themeStore } = useStore();
    const { primaryColor } = storeToRefs(themeStore);

    ConfigProvider.config({
        theme: {
            primaryColor: unref(primaryColor) //'#7FB92D'
        }
    });

    useCheckNewVision();

    const transformCellText = ({ text }: TransformCellTextProps) => {
        if ([null, undefined, ''].includes(text)) {
            return '--';
        }
        return text;
        // return (
        //     <Tooltip placement="top" title={text}>
        //         {text}
        //     </Tooltip>
        // );
    };

    // const renderEmpty = () => {
    //     return <Empty />;
    // };

    watchEffect(() => {
        if (route.meta?.title) {
            // 翻译网页标题
            document.title = transformI18n(route.meta.title);
        }
    });
</script>

<style lang="less">
    @import url('ant-design-vue/dist/antd.variable.less');
</style>
