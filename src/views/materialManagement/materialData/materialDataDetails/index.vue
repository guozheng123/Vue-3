<template>
    <TpfAddInfoLayout :title="title" class="materialDataDetails">
        <TpfAnchor :anchorList="anchorList" />

        <!-- 基本信息 -->
        <LoadingSkeleton>
            <BasicInfo
                :routerType="routerType"
                v-model:materialUnitInfo="materialUnitInfo"
                :originalInfo="originData"
                @update:change-material-type-code="changeMaterialTypeCode"
                id="basicInfo"
                ref="basicInfoDom"
            />
        </LoadingSkeleton>

        <!-- 辅助单位 -->
        <LoadingSkeleton>
            <AuxiliaryUnit
                :routerType="routerType"
                :materialUnitInfo="materialUnitInfo"
                ref="auxiliaryUnitDom"
                id="auxiliaryUnit"
                :list="originData.materialAuxiliaryUnitList || []"
            />
        </LoadingSkeleton>

        <!-- 业务属性 -->
        <LoadingSkeleton>
            <AttributeSetting
                :productUnitCodeList="productUnitCodeList"
                :routerType="routerType"
                :originalInfo="originData"
                id="attributeSetting"
                ref="attributeSettingDom"
            />
        </LoadingSkeleton>

        <!-- 工艺 -->
        <LoadingSkeleton>
            <Craft
                :routerType="routerType"
                id="craft"
                ref="craftDom"
                :list="originData.materialProcessList || []"
            />
        </LoadingSkeleton>

        <!-- 自定义字段 -->
        <LoadingSkeleton>
            <TpfCollapse title="自定义字段" id="collapseDIYField">
                <!-- 详情 -->
                <TpfDescField
                    :pageCode="pageCode"
                    :originalDate="originData"
                    v-if="routerType === '2'"
                />
                <!-- 新增-编辑 -->
                <TpfDIYFieldForm
                    v-if="!!pageCode && ['0', '1'].includes(routerType)"
                    :pageCode="pageCode"
                    submitName="diyFieldData"
                    :diyFieldData="originData"
                    ref="TpfDIYFieldFormDom"
                />
            </TpfCollapse>
        </LoadingSkeleton>

        <!-- 制造BOMBOm -->
        <LoadingSkeleton>
            <ManufactureBom
                id="manufactureBom"
                ref="manufactureBom"
                :list="originData.materialMbomList || []"
            />
        </LoadingSkeleton>

        <!-- 缺陷原因 -->
        <LoadingSkeleton>
            <CauseDeficiency
                :materialTypeCode="materialTypeCode"
                :routerType="routerType"
                id="causeDeficiency"
                ref="causeDeficiencyDom"
                :list="originData.materialCauseList || []"
            />
        </LoadingSkeleton>

        <!-- 图纸 -->
        <!-- <LoadingSkeleton>
            <Drawing id="drawing" ref="drawing" v-if="routerType !== '0'" />
        </LoadingSkeleton> -->

        <!-- 附件 -->
        <TpfCollapse title="附件" id="attachment">
            <TpfUpload
                class="t-p-[10px] t-box-border t-block"
                ref="TpfUploadDom"
                :file-list="originData.materialFileList || []"
                multiple
                v-noData="routerType === '2' && isEmpty(originData.materialFileList)"
                accept=".doc,.docx,.xlsx,.xls,.pdf,.png,.jpg,.jpeg"
                :is-readonly="routerType === '2'"
            />
        </TpfCollapse>

        <template #footerRight>
            <a-button v-if="routerType !== '2'" class="tpf-button" @click="back">取消</a-button>
            <a-button
                v-if="routerType !== '2'"
                class="tpf-button"
                type="primary"
                v-debounce="onSave"
            >
                保存
            </a-button>

            <a-button v-if="routerType === '2'" class="tpf-button" @click="back">关闭</a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="materialDataDetails">
    import { ref, onMounted, defineAsyncComponent, unref } from 'vue';
    import { useMaterialApi } from '@/api';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import { PageCodeEnum } from '@/config';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfUpload from '@/components/TpfUpload/index.vue';
    import { computed } from 'vue';
    import { cloneDeep, isEmpty, uniqBy } from 'lodash-es';

    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));

    const TpfDIYFieldForm = defineAsyncComponent(
        () => import('@/components/TpfDIYFieldForm/index.vue')
    );
    const TpfDescField = defineAsyncComponent(() => import('@/components/TpfDescField/index.vue'));

    const BasicInfo = defineAsyncComponent(() => import('./components/BasicInfo.vue'));

    const CauseDeficiency = defineAsyncComponent(() => import('./components/CauseDeficiency.vue'));

    const Craft = defineAsyncComponent(() => import('./components/Craft.vue'));

    const ManufactureBom = defineAsyncComponent(() => import('./components/ManufactureBom.vue'));

    // const Drawing = defineAsyncComponent(() => import('./components/Drawing.vue'));

    const AuxiliaryUnit = defineAsyncComponent(() => import('./components/AuxiliaryUnit.vue'));

    const AttributeSetting = defineAsyncComponent(
        () => import('./components/AttributeSetting.vue')
    );

    const { id, type: routerType } = useRouteQuery<{ id: string; type: string }>();

    const title = ['新增物料', '编辑物料', '物料详情'][Number(routerType)];

    const pageCode = PageCodeEnum.materialList;

    const paramsData = ref<{ [k: string]: any } | null>({});

    const { routeBackTab } = useRouteBackTab();

    const TpfDIYFieldFormDom = ref<InstanceType<typeof TpfDIYFieldForm> | null>(null);

    const anchorList = [
        { href: 'basicInfo', title: '基本信息', visible: true },
        { href: 'auxiliaryUnit', title: '辅助单位', visible: true },
        { href: 'attributeSetting', title: '业务属性', visible: true },
        { href: 'craft', title: '工艺', visible: true },
        { href: 'collapseDIYField', title: '自定义字段', visible: true },
        { href: 'manufactureBom', title: '制造BOM', visible: true },
        { href: 'causeDeficiency', title: '缺陷原因', visible: true },
        // { href: 'drawing', title: '图纸', visible: routerType !== '0' },
        { href: 'attachment', title: '附件', visible: true }
    ];

    const materialUnitInfo = ref<any>({});

    const materialTypeCode = ref('');
    const originData = ref<Record<string, any>>({});

    const materialApi = useMaterialApi();

    const basicInfoDom = ref<InstanceType<typeof BasicInfo> | null>(null);

    const attributeSettingDom = ref<InstanceType<typeof AttributeSetting> | null>(null);

    const craftDom = ref<InstanceType<typeof Craft> | null>(null);

    const manufactureBom = ref<InstanceType<typeof ManufactureBom> | null>(null);

    const auxiliaryUnitDom = ref<InstanceType<typeof AuxiliaryUnit> | null>(null);

    const causeDeficiencyDom = ref<InstanceType<typeof CauseDeficiency> | null>(null);

    const TpfUploadDom = ref<InstanceType<typeof TpfUpload> | null>(null);

    const changeMaterialTypeCode = (val: string) => {
        materialTypeCode.value = val;
    };
    const productUnitCodeList = computed(() => {
        const hasAuxiliaryUnitDom = auxiliaryUnitDom.value;
        if (!hasAuxiliaryUnitDom) return [unref(materialUnitInfo)];
        console.log(unref(auxiliaryUnitDom)!.getSubmitList());

        const list = unref(auxiliaryUnitDom)!
            .getSubmitList()
            .filter(e => e.enable === '1')
            .map(item => ({
                materialUnitName: item.materialAuxiliaryUnitName,
                materialUnitCode: item.materialAuxiliaryUnitCode
            }));
        const res = uniqBy([unref(materialUnitInfo), ...list], 'materialUnitCode');
        console.log(res);

        return res;
    });

    const init = () => {
        getMaterialByIdInfo();
    };
    const back = () => {
        routeBackTab();
    };

    const onSave = async () => {
        try {
            const obj = {
                ...(await unref(basicInfoDom)?.getSubmitInfo()),
                ...(await unref(attributeSettingDom)?.getSubmitInfo()),
                materialProcessList: unref(craftDom)?.getSubmitList(),
                materialMbomList: unref(manufactureBom)?.getSubmitList(),
                materialCauseList: unref(causeDeficiencyDom)?.getSubmitList(),
                materialFileList: unref(TpfUploadDom)?.getFileList(),
                materialAuxiliaryUnitList: unref(auxiliaryUnitDom)?.getSubmitList(),
                ...(await unref(TpfDIYFieldFormDom)?.getDiyFieldValue())
            };
            if (routerType === '0') {
                await add(obj);
            } else if (routerType === '1') {
                await edit({ ...obj, id });
            }
        } catch (error) {
            console.log('error', error);
        }
    };
    // 获取详情数据（编辑、详情）
    const getMaterialByIdInfo = async () => {
        if (!id) return;
        const res = await materialApi.getMaterialById({ id });
        if (res.data.object) {
            const { theirCompanyCode, theirFactoryCode } = res.data.object;
            paramsData.value = res.data.object;
            const companyCodeAndFactoryCode = Number(theirCompanyCode)
                ? [Number(theirCompanyCode), Number(theirFactoryCode)]
                : [];

            let { materialPropertyArr } = res.data.object;
            materialPropertyArr = (materialPropertyArr || []).reduce(
                (t, v, inx) => (v === '1' ? [...t, String(inx)] : [...t]),
                []
            );
            const info = {
                ...res.data.object,
                materialPropertyArr,
                'theirCompanyCode@_@theirFactoryCode': companyCodeAndFactoryCode
            };

            originData.value = cloneDeep(info);

            materialUnitInfo.value = {
                materialUnitCode: originData.value.materialUnitCode,
                materialUnitName: originData.value.materialUnitName
            };
        }
    };

    // 新增
    const add = async (v: any) => {
        const res = await materialApi.addMaterial(v);
        if (res.data.value) {
            const { message } = await import('ant-design-vue');
            message.success('信息保存成功！');
            back();
        }
    };

    // 编辑
    const edit = async (v: any) => {
        const res = await materialApi.editMaterial(v);
        if (res.data.value) {
            const { message } = await import('ant-design-vue');
            message.success('信息保存成功！');
            back();
        }
    };

    onMounted(() => {
        init();
    });
</script>
