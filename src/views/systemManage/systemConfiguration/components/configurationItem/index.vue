<!-- 通用 -->
<template>
    <!-- 文字 -->
    <div class="set-box" v-if="objectItem.valueTypeEcode === '2'">
        <a>
            {{ objectItem.defaultValue }}
            <SvgIcon type="icon-a-Frame629" style="margin-right: 5px" />
        </a>
    </div>
    <!-- 开关 -->
    <div class="set-box" v-if="objectItem.valueTypeEcode === '1'">
        <a-switch v-model:checked="objectItem.defaultValue" />
    </div>
    <!-- 下拉框 -->
    <div class="set-box" v-if="objectItem.valueTypeEcode === '3'">
        <a-select ref="select" v-model:value="objectItem.defaultValue" style="width: 110px">
            <a-select-option
                v-for="(it, inx) in objectItem.parameterValues"
                :key="inx"
                :value="it.value"
            >
                {{ it.valueText }}</a-select-option
            >
        </a-select>
    </div>
</template>

<script lang="tsx" setup>
    import { message, FormInstance } from 'ant-design-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, onMounted, toRefs } from 'vue';

    interface Props {
        objectItem: any;
    }
    const props = defineProps<Props>();
    const { objectItem } = toRefs(props);
</script>

<style scoped lang="less">
    :deep(.ant-modal) {
        border-radius: 8px !important;
        overflow: hidden !important;
    }

    .content-box {
        padding: 16px;
        box-sizing: border-box;
        padding-bottom: 0;

        .item-box {
            width: 100%;
            height: 89px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;

            .text-box {
                h2 {
                    margin-top: 24px;
                    font-size: 16px;
                    color: #4e5969;
                }

                span {
                    font-size: 12px;
                    color: #999;
                    line-height: 45px;
                }
            }

            .set-box {
                margin-top: 40px;
            }
        }
    }
</style>
