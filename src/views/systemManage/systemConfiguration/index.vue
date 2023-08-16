<!-- 系统配置 -->
<template>
    <div class="warp-inner">
        <div class="body-inner">
            <a-layout style="height: 100%" v-if="leftNavData.length">
                <a-layout-sider class="left-nov">
                    <a-menu
                        v-model:openKeys="formData.openKeys"
                        v-model:selectedKeys="formData.selectedKeys"
                        style="width: 100%"
                        :selectable="true"
                        :mode="formData.mode"
                        :theme="formData.theme"
                    >
                        <a-menu-item
                            v-for="item in leftNavData"
                            :key="item.sysParameterFolderId"
                            @click="
                                changeItem(
                                    item.folderCode,
                                    item.sysParameterFolderId,
                                    item.folderName
                                )
                            "
                            >{{ item.folderName }}</a-menu-item
                        >
                    </a-menu>
                </a-layout-sider>

                <a-layout class="item-box">
                    <!-- 特殊处理的配置也就是功能性配置需在此新增组件 -->
                    <basicInformation
                        v-if="itemName === 'base' && dataList.length"
                        :title="itemTitle"
                        :dataInfo="dataList"
                    />

                    <productionSettings
                        :title="itemTitle"
                        :dataInfo="dataList"
                        v-else-if="itemName === 'production' && dataList.length"
                    />
                    <a-result v-else-if="!dataList.length" status="404" sub-title="暂无数据！" />
                    <!-- 通用配置 -->
                    <general v-else :dataInfo="dataList" :title="itemTitle" />
                </a-layout>
            </a-layout>
            <a-result v-else status="404" sub-title="暂无数据！" style="margin-top: 110px" />
        </div>
        <div class="bottom-submit">
            <div class="buttons" v-if="leftNavData.length">
                <a-button class="tpf-button" type="primary" @click="submitData">保存</a-button>
            </div>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import type { MenuMode, MenuTheme } from 'ant-design-vue';
    import { message } from 'ant-design-vue';
    import { ref, onMounted, unref } from 'vue';
    import basicInformation from './components/basicInformation/index.vue';
    import general from './components/general/index.vue';
    import productionSettings from './components/productionSettings/index.vue';
    import { useSysParameterApi } from '@/api';
    import type { ResGetSysParameterFolderList, ResGetSysParameterListByFolderId } from '@/api';
    import { useUserStore } from '@/store/modules/user';
    import { cloneDeep } from 'lodash-es';
    const sysParameterApi = useSysParameterApi();
    const userStore = useUserStore();
    const formData = ref({
        mode: 'inline' as MenuMode,
        theme: 'light' as MenuTheme,
        selectedKeys: [1],
        openKeys: ['sub1']
    });
    const itemName = ref<string>('');
    const itemTitle = ref<string>('');

    const leftNavData = ref<ResGetSysParameterFolderList[]>([]);
    const dataList = ref<ResGetSysParameterListByFolderId[]>([]);

    const changeItem = async (name: any, code: any, title: any) => {
        dataList.value = [];
        const info = code;
        itemName.value = name;
        itemTitle.value = title;
        const res = await sysParameterApi.getSysParameterListByFolderId({
            sysParameterFolderId: info
        });
        dataList.value = res.data.object.parameterValues;
        filterData();
    };

    const filterData = () => {
        // 主要是用于把字符串true换成true
        dataList.value.map((item: any) => {
            if (['1', '4'].includes(item.valueTypeEcode)) {
                item.defaultValue = item.defaultValue === 'true';
            }
            if (item.valueTypeEcode === '4' && !item.parameterValues.length) {
                //后台需要塞进来这组数据
                item.parameterValues = [
                    {
                        sysParameterValueId: 13,
                        value: '',
                        valueText: 'non_standard_quantity'
                    },
                    {
                        sysParameterValueId: 12,
                        value: '',
                        valueText: 'standard_quantity'
                    }
                ];
            }
        });
    };

    const submitData = async () => {
        console.log(dataList.value);
        await sysParameterApi.editSysParameter(cloneDeep(unref(dataList)));
        await userStore.getSysParameterByTenantId();
        // 重新获取一遍系统配置;
        message.success('保存成功！');
    };

    const getSysParameterFolderList = async () => {
        const res = await sysParameterApi.getSysParameterFolderList();
        leftNavData.value = res.data.list;
        if (leftNavData.value.length) {
            formData.value.selectedKeys[0] = leftNavData.value[0].sysParameterFolderId;
            itemName.value = leftNavData.value[0].folderCode;
            const resData = await sysParameterApi.getSysParameterListByFolderId({
                sysParameterFolderId: formData.value.selectedKeys[0]
            });
            dataList.value = resData.data.object.parameterValues;
            // filterData();
        }
    };

    onMounted(() => {
        getSysParameterFolderList();
    });
</script>

<style scoped lang="less">
    .warp-inner {
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        padding-bottom: 75px;

        .body-inner {
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
        }

        .left-nov {
            width: 145px;
            height: 100%;
            background: #fff;
            padding-top: 20px;
            box-sizing: border-box;
            border-right: 1px solid #f0f0f0;
        }

        .item-box {
            background: #fff;
            overflow: auto;
        }
    }

    :deep(.ant-menu .ant-menu-item.ant-menu-item-selected::after) {
        opacity: 0.2;
        border: 0;
    }

    :deep(.ant-menu-inline) {
        border: 0;
    }

    :deep(.ant-menu-title-content) {
        text-align: center;
    }

    .bottom-submit {
        width: 100%;
        height: 55px;
        background: #fff;
        position: fixed;
        bottom: 0;
        margin-left: -20px;

        .buttons {
            height: 100%;
            width: 100%;
            position: relative;
            background: #fff;

            .tpf-button {
                position: absolute;
                right: 200px;
                top: 13px;
            }
        }
    }
</style>
