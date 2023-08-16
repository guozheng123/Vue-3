<template>
    <Drawer v-model:visible="visible" placement="right" :closable="false">
        <Descriptions title="主题色" :column="9">
            <Descriptions.Item v-for="item in themeColors" :key="item.key">
                <div class="style-checbox-item">
                    <Tooltip :title="item.title">
                        <Tag
                            :color="item.value"
                            @click="setThemeColor({ primaryColor: item.value })"
                        >
                            <span :style="{ visibility: getThemeColorVisible(item.value) }">
                                ✔
                            </span>
                        </Tag>
                    </Tooltip>
                </div>
            </Descriptions.Item>
            <Descriptions.Item key="custom">
                <div class="style-checbox-item">
                    <Tooltip title="自定义">
                        <Tag :color="customColor" style="position: relative; overflow: hidden">
                            <input
                                v-model="customColor"
                                type="color"
                                style="position: absolute; overflow: hidden"
                                class="inset-0"
                                :style="colorPickerStyle"
                                @input="setThemeColor({ primaryColor: customColor })"
                            />
                            <span
                                :style="{
                                    visibility: !NoDIYColor ? 'visible' : 'hidden',
                                    position: 'relative'
                                }"
                            >
                                ✔
                            </span>
                        </Tag>
                    </Tooltip>
                </div>
            </Descriptions.Item>
        </Descriptions>
    </Drawer>
</template>

<script lang="ts" setup name="ProjectSetting">
    import { ref, computed, type StyleValue } from 'vue';
    import { Drawer, Descriptions, Tag, Tooltip } from 'ant-design-vue';
    import { themeColors } from './constant';
    import type { Theme } from '@/store/modules/projectConfig';
    import { useThemeStore } from '@/store/modules/projectConfig';

    const themeStore = useThemeStore();

    const customColor = ref(themeStore.primaryColor);

    const visible = ref(false);

    const colorPickerStyle = computed(
        () => ({ '--custom-color': customColor.value } as StyleValue)
    );

    const NoDIYColor = computed(() =>
        themeColors.some(item => item.value === themeStore.primaryColor)
    );

    const setThemeColor = ({ primaryColor }: Theme) => {
        themeStore.fillColor({ primaryColor });
        visible.value = false;
    };

    const getThemeColorVisible = (color: string) =>
        themeStore.primaryColor === color ? 'visible' : 'hidden';

    const open = () => {
        visible.value = true;
    };

    defineExpose({ open });
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
</style>
