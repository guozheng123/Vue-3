<!-- 生产 -->
<template>
    <div class="content-box">
        <div class="header-h1">
            <h2>{{ title }}</h2>
        </div>

        <div class="item-box" v-for="(item, index) in dataInfo" :key="index">
            <div class="text-box"
                ><h2>{{ item.parameterName }}</h2> <span>{{ item.parameterDescription }}</span></div
            >
            <div class="set-box" v-if="item.valueTypeEcode === '4'">
                <a
                    v-if="item.defaultValue === true"
                    style="margin-right: 5px"
                    @click="visible = true"
                    >设置</a
                >
                <a-switch v-model:checked="item.defaultValue" @change="openDialog"
            /></div>
            <!-- 普通组件的封装 -->
            <configurationItem v-if="!(item.parameterName == '库存齐套卡控')" :objectItem="item" />
        </div>
        <!-- 弹窗 -->
        <div ref="mod">
            <a-modal
                :getContainer="():any => $refs.mod"
                :bodyStyle="{ width: '520px', height: '200px' }"
                v-model:visible="visible"
                title="库存齐套率设置"
                :centered="true"
                @ok="handleOk"
            >
                <div style="width: 400px; margin: 30px auto">
                    <a-form-item
                        style="margin-left: 14px"
                        label="标准件件数齐套率（%）"
                        name="title"
                        ><a-input-number
                            :formatter="(value:any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value:any) => `${value}`.replace(/\$\s?|(,*)/g, '')"
                            :precision="1"
                            :max="100"
                            :min="0.1"
                            :controls="false"
                            v-model:value.trim="dataInfo[0].parameterValues[0].value"
                            placeholder="请输入..."
                            :maxlength="30"
                            style="width: 200px"
                        />
                    </a-form-item>
                    <a-form-item label="非标准件件数齐套率（%）" name="description"
                        ><a-input-number
                            :formatter="(value:any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value:any) => `${value}`.replace(/\$\s?|(,*)/g, '')"
                            :precision="1"
                            :max="100"
                            :min="0.1"
                            :controls="false"
                            v-model:value.trim="dataInfo[0].parameterValues[1].value"
                            placeholder="请输入..."
                            :maxlength="30"
                            style="width: 200px"
                        />
                    </a-form-item>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import { message } from 'ant-design-vue';
    import { ref, onMounted, toRefs } from 'vue';
    import configurationItem from '../configurationItem/index.vue';
    const visible = ref<boolean>(false);

    interface Props {
        dataInfo: any;
        title: string;
    }

    const props = defineProps<Props>();
    const { dataInfo, title } = toRefs(props);

    const handleOk = (e: MouseEvent) => {
        console.log(e);
        message.success('暂存成功！');
        visible.value = false;
    };

    const openDialog = () => {
        console.log(dataInfo.value);
        if (dataInfo.value[0].defaultValue === true) {
            visible.value = true;
        }
    };
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
