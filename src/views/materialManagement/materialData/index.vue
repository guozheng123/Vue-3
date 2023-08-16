<template>
    <div class="materiaDataList">
        <TpfIndentation>
            <template #left>
                <LoadingSkeleton>
                    <TpfOperateTree
                        :treeData="treeData"
                        @selectTree="selectTree"
                        @onAdd="onAddTree"
                        @onDel="onDelTree"
                        @onEditTree="onEditTree"
                        :fieldNames="{
                            children: 'children',
                            title: 'label',
                            key: 'id',
                            rootCode: 'id'
                        }"
                    />
                </LoadingSkeleton>
            </template>
            <template #right>
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="MaterialMainData" tab="物料数据">
                        <LoadingSkeleton>
                            <MaterialMainData
                                ref="MaterialMainDataDom"
                                v-if="activeKey === 'MaterialMainData'"
                            />
                        </LoadingSkeleton>
                    </a-tab-pane>
                    <a-tab-pane key="MainDateBadReason" tab="缺陷原因" force-render>
                        <LoadingSkeleton>
                            <MainDateBadReason
                                ref="MainDateBadReasonDom"
                                v-if="activeKey === 'MainDateBadReason'"
                            />
                        </LoadingSkeleton>
                    </a-tab-pane>
                </a-tabs>
            </template>
        </TpfIndentation>
    </div>
</template>

<script setup lang="tsx" name="materiaDataList">
    import { ref, defineAsyncComponent } from 'vue';
    import { getMaterialTypeTree, useMaterialTypeApi } from '@/api';
    import { message } from 'ant-design-vue';

    import TpfOperateTree from '@/components/TpfOperateTree/index.vue';

    const MainDateBadReason = defineAsyncComponent(
        () => import('./components/MainDateBadReason.vue')
    );
    const MaterialMainData = defineAsyncComponent(
        () => import('./components/MaterialMainData.vue')
    );

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const activeKey = ref('MaterialMainData');

    const materialTypeApi = useMaterialTypeApi();

    const MaterialMainDataDom = ref<InstanceType<typeof MaterialMainData> | null>(null);

    const MainDateBadReasonDom = ref<InstanceType<typeof MainDateBadReason> | null>(null);

    const { treeData, fetchApi } = getMaterialTypeTree();

    const selectTree = (select: any) => {
        console.log('select: ', select);
        const val = select.selected ? '' : select.id;
        MaterialMainDataDom.value?.updateTableList(val);

        MainDateBadReasonDom.value?.updateTableList(val);
    };

    const onAddTree = async (v: string, s: any) => {
        if (s.label === '未分类') {
            message.error('不可新增');
            treeData.value = [...treeData.value];
            return;
        }
        if (!/^[\u4e00-\u9fa5]+$/.test(v)) {
            message.error('请填写中文分类');
            treeData.value = [...treeData.value];

            return;
        }
        if (v.length > 10 || v.length === 0) {
            message.error('长度不能超过10');
            treeData.value = [...treeData.value];

            return;
        }
        const obj = {
            materialTypeName: v,
            materialTypeParentCode: s.fatherCode
        };
        try {
            const res = await materialTypeApi.addMaterialType(obj);
            if (res.data.value) {
                message.success('信息保存成功！');
                fetchApi();
            }
        } catch (error) {
            console.log('error: ', error);
            treeData.value = [...treeData.value];
        }
    };

    const onEditTree = async (v: string, s: any) => {
        if (s.level === 1 || s.id === 0 || s.id === 'SYFL') {
            message.error('不可编辑');
            treeData.value = [...treeData.value];

            return;
        }
        if (s.label === '未分类') {
            message.error('不可编辑');
            treeData.value = [...treeData.value];

            return;
        }
        if (!/^[\u4e00-\u9fa5]+$/.test(v)) {
            message.error('请填写中文分类');
            treeData.value = [...treeData.value];

            return;
        }
        if (v.length === 0) {
            message.error('不能为空');
            treeData.value = [...treeData.value];

            return;
        }
        if (v.length > 10) {
            message.error('长度不能超过10');
            treeData.value = [...treeData.value];

            return;
        }
        const obj = {
            id: s.id,
            materialTypeName: v,
            materialTypeCode: s.id
        };
        try {
            const res = await materialTypeApi.editMaterialType(obj);
            if (res.data.value) {
                message.success('信息保存成功！');
                fetchApi();
            } else {
                message.error('信息保存失败！');
                fetchApi();
            }
        } catch (error) {
            console.log('error: ', error);
            treeData.value = [...treeData.value];
        }
    };
    const onDelTree = async (v: any) => {
        if (v.label === '未分类') {
            message.error('不可删除');
            treeData.value = [...treeData.value];
            return;
        }
        let content = '';
        if (v.level === 1) {
            message.warning('顶层节点，不可删除');
            return;
        } else {
            if (v.children?.length > 0) {
                content = '节点下有子节点，是否一并删除';
            } else {
                content = '是否确认删除？';
            }
        }
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content });
        const res = await materialTypeApi.deleteMaterialTypeByCode({ code: v.id });
        if (res.data.value) {
            message.success('删除成功！');
            fetchApi();
        } else {
            message.error(res.data.errorMessage);
        }
    };
</script>

<style lang="less">
    .materiaDataList {
        padding: 10px 12px;
        height: 100%;
        background-color: #f7f8fa;

        .ant-tabs {
            background-color: #fff;
            display: flex;
            height: 100%;
            flex-direction: column;

            .ant-tabs-content-holder {
                flex: 1;

                .ant-tabs-content {
                    height: 100%;
                }
            }

            .ant-tabs-nav {
                margin: 0;
                padding-left: 31px;
            }

            .ant-layout {
                padding-top: 10px;
                padding-right: 0;
                padding-bottom: 0;
                height: 100%;
                background-color: #f7f8fa;
            }
        }
    }
</style>
