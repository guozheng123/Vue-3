<template>
    <TpfAddInfoLayout :title="title" class="workmanshipRoute">
        <div class="productBOMDetail">
            <TpfIndentation>
                <template #left>
                    <LoadingSkeleton>
                        <div>
                            <div class="left_title">BOM结构图</div>
                            <div class="left_title">
                                <a-tree
                                    defaultExpandAll
                                    v-if="treeData.length"
                                    :selectable="false"
                                    :tree-data="treeData"
                                    :fieldNames="{
                                        children: 'branchTree',
                                        title: 'materialName',
                                        key: 'materialCode'
                                    }"
                            /></div>
                        </div>
                    </LoadingSkeleton>
                </template>
                <template #right>
                    <div>
                        <Parentmaterial
                            @on-submit="getParent"
                            :originalInfo="originData.parentMaterial"
                            ref="parentmaterialRef"
                        />
                        <SonMaterial
                            :originalInfo="originData.childMaterials"
                            ref="sonMaterialRef"
                            :materialCode="materialCode"
                            @on-submit="getTable"
                        />
                    </div>
                </template>
            </TpfIndentation>
        </div>
        <template #footerRight>
            <a-button class="tpf-button" @click="routeBackTab()"> 取消 </a-button>
            <a-button type="primary" v-if="type !== 'DETAIL'" class="tpf-button" @click="onSave()">
                {{ type === 'update' ? ' 更新' : '保存' }}
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="tsx" name="ProductBOMDetail">
    import { defineAsyncComponent, ref, unref, computed } from 'vue';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { useMaterialProductBOMApi } from '@/api';
    import { message } from 'ant-design-vue';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import { onMounted } from 'vue';
    import { isEmpty } from 'lodash';
    import { watch } from 'vue';

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );
    const Parentmaterial = defineAsyncComponent(() => import('../component/ParentmaterialCom.vue'));
    const SonMaterial = defineAsyncComponent(() => import('../component/SonMaterial.vue'));
    const { routeBackTab } = useRouteBackTab();
    const { type, bomId } = useRouteQuery<{
        type: string;
        bomId: string;
    }>();
    const originData = ref<Record<string, any>>({});

    const parentmaterialRef = ref<InstanceType<typeof Parentmaterial> | null>(null);
    const sonMaterialRef = ref<InstanceType<typeof SonMaterial> | null>(null);
    const materialCode = ref<string>('');
    const useMaterialProductBOM = useMaterialProductBOMApi();
    const sonMaterialList = ref<any[]>([]);

    const treeData = ref<any[]>([]);

    const onSave = async () => {
        const obj = {
            ...(await unref(parentmaterialRef)?.getSubmitInfo()),
            ...(await unref(sonMaterialRef)?.getSubmitInfo())
        };
        if (obj.childMaterials?.length === 0) {
            return message.warn('产品BOM必须添加子级物料!');
        }
        if (type === 'add') {
            const res = await useMaterialProductBOM.add(obj);
            if (res.data.value) {
                message.success('保存成功');
                routeBackTab();
            }
        }
        if (type === 'COPY') {
            const res = await useMaterialProductBOM.copyProductBom(obj);
            if (res.data.value) {
                message.success('复制成功');
                routeBackTab();
            }
        }

        if (type === 'edit') {
            obj.parentMaterial.bomId = bomId;
            const res = await useMaterialProductBOM.editProductBom(obj);
            if (res.data.value) {
                message.success('编辑成功');
                routeBackTab();
            }
        }
        if (type === 'UPGRADES') {
            obj.parentMaterial.bomId = bomId;
            const res = await useMaterialProductBOM.upgradeProductBom(obj);
            if (res.data.value) {
                message.success('升版成功');
                routeBackTab();
            }
        }
        if (type === 'update') {
            const res = await useMaterialProductBOM.updateProductBom(obj);
            if (res.data.value) {
                message.success('更新成功');
                routeBackTab();
            }
        }
    };

    const getTable = (val: any[]) => {
        if (type !== 'update') {
            val.forEach(async e => {
                const res = await useMaterialProductBOM.getBomTree({
                    materialCode: e.materialCode,
                    bomVersion: e.bomVersion
                });
                if (!isEmpty(res.data)) {
                    e['branchTree'] = [res.data.object];
                } else {
                    e['branchTree'] = [];
                }
            });

            sonMaterialList.value = val;
        } else {
            sonMaterialList.value = val;
        }
    };
    watch(
        () => sonMaterialList.value,
        val => {
            if (type !== 'update') {
                if (treeData.value.length > 0) {
                    treeData.value[0].branchTree = val;
                }
            } else {
                treeData.value = [];
                originData.value.parentMaterial['branchTree'] = val;
                treeData.value.push(originData.value.parentMaterial);
            }
        },
        {
            deep: true
        }
    );
    const getParent = (val: any) => {
        materialCode.value = val.materialCode;
        treeData.value = [];
        treeData.value.push(val);
        treeData.value[0]['branchTree'] = unref(sonMaterialList);
    };

    const title = computed(() => {
        if (type === 'edit') {
            return '编辑产品BOM';
        } else if (type === 'COPY') {
            return '复制产品BOM';
        } else if (type === 'DETAIL') {
            return '产品BOM详情';
        } else if (type === 'update') {
            return '更新产品BOM';
        } else if (type === 'UPGRADES') {
            return '升版产品BOM';
        } else {
            return '新增产品BOM';
        }
    });
    const init = async () => {
        if (type !== 'add' && type !== 'update') {
            const params = {
                bomId: bomId,
                typeEnums: type === 'COPY' || type === 'UPGRADES' ? type : 'DETAIL'
            };
            const res = await useMaterialProductBOM.getByBomId(params);
            const { bomTree } = res.data.object;
            originData.value = res.data.object;
            treeData.value = [bomTree] as any;
            unref(sonMaterialRef)!.setTableListFun(originData.value.childMaterials);
        }
        if (type === 'update') {
            const params = {
                bomId: bomId
            };
            const res = await useMaterialProductBOM.updateDetail(params);
            const { bomTree } = res.data.object;
            originData.value = {
                parentMaterial: res.data.object,
                childMaterials: res.data.object.updateParentMaterialVoList
            };
            unref(sonMaterialRef)!.setTableListFun(originData.value.childMaterials);
            if (bomTree) {
                treeData.value = [bomTree] as any;
            }
        }
    };
    onMounted(async () => {
        init();
    });
</script>

<style lang="less" scoped>
    .productBOMDetail {
        padding: 10px 12px;
        height: 100%;
        background-color: #f7f8fa;

        .left_title {
            text-align: center;
            padding-top: 20px;
        }

        :deep(.parentMaterial) {
            .tpf-collapse-header {
                background-color: #fff !important;
            }
        }
    }
</style>
