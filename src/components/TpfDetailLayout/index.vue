<template>
    <div>
        <slot name="header"></slot>
        <slot name="content"></slot>

        <slot name="bottom">
            <a-card class="bottom_card">
                <div class="right" style="position: fixed; right: 20px">
                    <a-space>
                        <a-button v-if="isShow" class="formBtn" @click="back">取消</a-button>
                        <a-button v-if="isShow" class="formBtn" type="primary" @click="onSave">
                            保存
                        </a-button>
                        <a-button v-if="!isShow" class="formBtn" @click="back">关闭</a-button>
                    </a-space>
                </div>
            </a-card>
        </slot>
    </div>
</template>

<script setup lang="ts" name="TpfDetailLayout">
    import { useRouteBackTab } from '@/hooks';
    const { routeBackTab } = useRouteBackTab();

    const emits = defineEmits(['onSave']);

    type Props = {
        title?: string;
        href?: string;
        isShow?: boolean;
    };
    withDefaults(defineProps<Props>(), {
        title: '',
        href: '',
        isShow: true
    });
    const back = () => {
        routeBackTab();
    };
    const onSave = () => {
        emits('onSave');
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

    .bottom_card {
        width: 100%;
        height: 50px;
        position: fixed !important;
        bottom: 0;
        z-index: 999;

        .ant-btn {
            border-radius: 4px;
        }
        // .formBtn {
        //     margin-left: 10px;
        // }
    }
</style>
