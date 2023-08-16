<!-- 通用 -->
<template>
    <div class="content-box">
        <div class="header-h1">
            <h2>{{ title }}</h2>
        </div>
        <div class="item-box" v-for="(item, index) in dataInfo" :key="index">
            <div class="text-box"
                ><h2>{{ item.parameterName }}</h2> <span>{{ item.parameterDescription }}</span></div
            >
            <!-- 文字 -->
            <div class="set-box" v-if="item.valueTypeEcode === '2'">
                <a>
                    {{ item.defaultValue }}
                    <SvgIcon type="icon-a-Frame629" style="margin-right: 5px" />
                </a>
            </div>
            <!-- 开关 -->
            <div class="set-box" v-if="item.valueTypeEcode === '1'">
                <a-switch v-model:checked="item.defaultValue" />
            </div>
            <!-- 下拉框 -->
            <div class="set-box" v-if="item.valueTypeEcode === '3'">
                <a-select ref="select" v-model:value="item.defaultValue" style="width: 110px">
                    <a-select-option
                        v-for="(it, inx) in item.parameterValues"
                        :key="inx"
                        :value="it.value"
                    >
                        {{ it.valueText }}</a-select-option
                    >
                </a-select>
            </div>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import { message, FormInstance } from 'ant-design-vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, onMounted, toRefs } from 'vue';

    const visible = ref<boolean>(false);
    interface Props {
        dataInfo: any;
        title: string;
    }
    const props = defineProps<Props>();
    const { dataInfo, title } = toRefs(props);

    onMounted(() => {
        console.log(dataInfo.value, '更新成功');
    });
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

        .header-h1 {
            font-size: 20px;
            font-weight: 500;
            color: #000;
            line-height: 28px;
        }

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
