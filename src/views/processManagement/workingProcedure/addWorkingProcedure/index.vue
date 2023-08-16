<template>
    <div>
        <TpfAnchor :anchorList="anchorList" />
        <TpfDetailLayout @onSave="onSave" :title="title">
            <template #header>
                <TpfDetailTitle :title="title" />
            </template>
            <template #content>
                <div class="main">
                    <div class="content">
                        <div id="a">
                            <Information v-if="data" :data="data" ref="informationRef" />
                        </div>
                        <div id="b">
                            <Production v-if="data" :data="data" ref="productionRef" />
                        </div>

                        <div id="c">
                            <Quality v-if="data" :data="data" ref="qualityRef" />
                        </div>

                        <div id="d" style="padding-bottom: 60px">
                            <File v-if="data" :data="data" ref="fileRef" />
                        </div>
                    </div>
                </div>
            </template>
        </TpfDetailLayout>
    </div>
</template>

<script setup lang="ts" name="AddWorkingProcedure">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { useWorkingProcedure } from '@/api';
    import { message } from 'ant-design-vue';
    import { useRouter } from 'vue-router';
    import { useRouteBackTab } from '@/hooks';
    const TpfDetailLayout = defineAsyncComponent(
        () => import('@/components/TpfDetailLayout/index.vue')
    );
    const Quality = defineAsyncComponent(() => import('./component/quality.vue'));
    const File = defineAsyncComponent(() => import('./component/file.vue'));
    const Production = defineAsyncComponent(() => import('./component/production.vue'));
    const Information = defineAsyncComponent(() => import('./component/information.vue'));
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const TpfDetailTitle = defineAsyncComponent(
        () => import('@/components/TpfDetailTitle/index.vue')
    );
    const { routeBackTab } = useRouteBackTab();
    const $router = useRouter();

    const operationId = ref();
    const anchorList = [
        { href: 'a', title: '基础信息', visible: true },
        { href: 'b', title: '生产信息', visible: true },
        { href: 'c', title: '质量信息', visible: true },
        { href: 'd', title: '导入文件', visible: true }
    ];
    const data = ref<{ [k: string]: any } | null>(null);
    const informationRef: any = ref(null);
    const productionRef: any = ref(null);
    const qualityRef: any = ref(null);
    const fileRef: any = ref(null);

    const workingProcedure = useWorkingProcedure();

    const routerType = computed(() => $router.currentRoute.value.query.type);
    const title = ref();
    const onSave = () => {
        Promise.all([
            informationRef.value?.informationRef?.validate(),
            productionRef.value?.productionRef?.validate(),
            qualityRef.value?.qualityRef?.validate()
        ]).then(async function () {
            const qualityRefList = qualityRef.value?.save(); //质量信息
            const params = {
                ...qualityRefList,
                operationFileList: unref(fileRef.value.save()),
                ...informationRef.value.formState,
                ...productionRef.value.formState
            };

            if (routerType.value === '0' || routerType.value === '3') {
                const res = await workingProcedure.addOperationInfo(params);
                if (res.success === true) {
                    message.success('保存成功');
                    back();
                }
            } else if (routerType.value === 'upgrade') {
                const res = await workingProcedure.editOperationInfoForProcess(params);
                if (res.success === true) {
                    localStorage.setItem('processList', JSON.stringify(res.data.object));
                    message.success('编辑成功');
                    back();
                }
            } else {
                params.operationId = $router.currentRoute.value.query.operationId;
                const res = await workingProcedure.editOperationInfo(params);
                if (res.success === true) {
                    message.success('编辑成功');
                    back();
                }
            }
        });
    };
    const back = () => {
        routeBackTab();
    };

    //0 --新增
    //1  4 --编辑
    //2 --详情
    //3 --复制
    const load = async () => {
        if (routerType.value === '0') {
            title.value = '新增工序';
            data.value = {};
        } else if (
            routerType.value === '3' ||
            routerType.value === '1' ||
            routerType.value === '4' ||
            routerType.value === 'upgrade'
        ) {
            if (routerType.value === '3') {
                title.value = '复制工序';
            } else if (routerType.value === '1' || routerType.value === 'upgrade') {
                title.value = '编辑工序';
            }
            operationId.value = $router.currentRoute.value.query.operationId;
            const params = { operationId: operationId.value };
            const res = await workingProcedure.getOperationInfoById({ ...params });
            data.value = res.data.object;
        }
    };
    onMounted(() => {
        load();
    });
</script>

<style scoped lang="less">
    .main {
        position: relative;

        .content {
            // padding: 0 12px 12px;
        }

        :deep(.ant-card) {
            .ant-card-body {
                padding: 8px 12px 8px 12px;

                .title_name {
                    padding-left: 16px !important;
                    color: #1d2129;
                    font-size: 16px;
                }
            }
        }
    }
</style>
