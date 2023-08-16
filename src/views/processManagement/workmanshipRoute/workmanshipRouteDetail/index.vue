<template>
    <TpfAddInfoLayout :title="title" class="workmanshipRoute">
        <!-- 基础信息 -->
        <LoadingSkeleton>
            <Information v-if="paramsData" :paramsData="paramsData" ref="informationRef" />
        </LoadingSkeleton>
        <!-- 工序列表 -->
        <LoadingSkeleton>
            <List v-if="paramsData" :paramsData="paramsData" ref="listRef" />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button @click="back" v-if="routerType === 'detail'" class="tpf-button">
                关闭
            </a-button>
            <a-button @click="back" v-if="routerType !== 'detail'" class="tpf-button">
                取消
            </a-button>
            <a-button
                @click="onSave"
                v-if="routerType !== 'detail'"
                type="primary"
                class="tpf-button"
            >
                保存
            </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="AddworkmanshipRoute">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useWorkingProcedure, useRuntimeProcessApi } from '@/api';
    import { message } from 'ant-design-vue';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';

    const Information = defineAsyncComponent(() => import('./information.vue'));
    const List = defineAsyncComponent(() => import('./list.vue'));

    const { routeBackTab } = useRouteBackTab();

    const router = useRouter();
    const workingProcedure = useWorkingProcedure();
    const runtimeProcessApi = useRuntimeProcessApi();

    const paramsData = ref<{ [k: string]: any } | null>(null);

    const routerType = computed(() => router.currentRoute.value.query.type);

    const { processId, runtimeProcessId } = useRouteQuery<{
        processId: string;
        runtimeProcessId: string;
    }>();

    const title = ref('');

    const informationRef: any = ref(null);
    const listRef: any = ref(null);

    const onSave = () => {
        if (listRef.value?.dataSource?.length === 0) {
            message.warning('没有添加工序,不允许保存');
            return false;
        }
        Promise.all([
            informationRef.value?.baseRef
                ?.validate()
                .then(() => {
                    return Promise.resolve();
                })
                .catch(() => {
                    return Promise.reject();
                })
        ]).then(async function () {
            const list = listRef.value?.dataSource.map((e: any, index: number) => {
                e.rowNum = index + 1;
                return e;
            });

            const { processCode, processVersion, processName, factoryCode, releaseFlag, enable } =
                unref(informationRef.value?.formState);

            const params = {
                processCode,
                processVersion: Number(processVersion.slice(1)),
                processName,
                factoryCode,
                releaseFlag,
                enable,
                operationInfoVos: list,
                processId
            };
            if (
                routerType.value === 'add' ||
                routerType.value === 'copy' ||
                routerType.value === 'upgrade'
            ) {
                await workingProcedure.addProcess(params);
                back();
                message.success('新增成功');
            } else if (routerType.value === 'edit') {
                await workingProcedure.editProcess(params);
                back();
                message.success('编辑成功');
            }

            localStorage.removeItem('processOperationCode');
            localStorage.removeItem('processTableList');
            localStorage.removeItem('processList');
            localStorage.removeItem('isLocalStorage');
        });
    };

    const back = () => {
        routeBackTab();
    };
    const load = async () => {
        if (routerType.value === 'add') {
            title.value = '新增工艺';
            paramsData.value = {};
            return;
        }
        if (routerType.value === 'edit') {
            title.value = '编辑工艺';

            try {
                const res = await workingProcedure.getProcessById({ processId });
                res.data.object.processVersion = 'V' + res.data.object.processVersion;
                paramsData.value = res.data.object;
            } catch (error) {
                console.log('error: ', error);
            }
            return;
        }
        if (routerType.value === 'copy') {
            title.value = '复制工艺';

            try {
                const res = await workingProcedure.getCopyProcessById({ processId });
                res.data.object.processVersion = 'V' + res.data.object.processVersion;
                res.data.object.releaseFlag = '0';
                paramsData.value = res.data.object;
            } catch (error) {
                console.log('error: ', error);
            }
            return;
        }
        if (routerType.value === 'detail') {
            title.value = '工艺详情';
            if (processId) {
                try {
                    const res = await workingProcedure.getProcessById({ processId });
                    res.data.object.processVersion = 'V' + res.data.object.processVersion;
                    paramsData.value = res.data.object;
                } catch (error) {
                    console.log('error: ', error);
                }
                return;
            }

            if (runtimeProcessId) {
                // 查看运行时工艺
                paramsData.value = await runtimeProcessApi
                    .getRuntimeProcessAndOperationsById({
                        id: runtimeProcessId
                    })
                    .then(res => res.data.object);
                return;
            }
        }
        if (routerType.value === 'upgrade') {
            title.value = '升版工艺';
            try {
                const res = await workingProcedure.getUpgradeProcessById({ processId });
                res.data.object.processVersion = 'V' + res.data.object.processVersion;
                res.data.object.releaseFlag = '0';
                paramsData.value = res.data.object;
            } catch (error) {
                console.log('error: ', error);
            }
            return;
        }
    };
    onMounted(() => {
        load();
    });
</script>

<style lang="less" scoped>
    .workmanshipRoute {
        :deep(.addInfoLayout-content) {
            // padding: 0 12px;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
