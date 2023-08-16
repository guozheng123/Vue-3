<template>
    <TpfAddInfoLayout :title="title" class="activityTypeDetail">
        <template #headerRight>
            <a-button v-if="routerType === 'detail'" @click="onEdit" class="tpf-button">
                编辑
            </a-button>
        </template>
        <LoadingSkeleton>
            <Base v-if="paramsData" :paramsData="paramsData" ref="base" />
        </LoadingSkeleton>
        <LoadingSkeleton>
            <Activity v-if="paramsData" :paramsData="paramsData" ref="activity" />
        </LoadingSkeleton>

        <template #footerRight>
            <a-button class="tpf-button" @click="back">取消</a-button>
            <a-button class="tpf-button" type="primary" v-debounce="onSave"> 保存 </a-button>
        </template>
    </TpfAddInfoLayout>
</template>

<script setup lang="ts" name="activityTypeDetail">
    import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { useWorkingProcedure } from '@/api';
    import { useRouteBackTab, useRouteQuery } from '@/hooks';
    import TpfAddInfoLayout from '@/components/TpfAddInfoLayout/index.vue';
    import { useRouter } from 'vue-router';
    import { message } from 'ant-design-vue';

    const { routeBackTab } = useRouteBackTab();
    const router = useRouter();

    const workingProcedure = useWorkingProcedure();

    const Base = defineAsyncComponent(() => import('./base.vue'));

    const Activity = defineAsyncComponent(() => import('./activity.vue'));

    const { workUnitTypeId } = useRouteQuery<{ workUnitTypeId: string }>();

    const paramsData = ref<{ [k: string]: any } | null>(null);

    const routerType = computed(() => router.currentRoute.value.query.type);

    const title = ref('');
    const base: any = ref(null);
    const activity: any = ref(null);

    const back = () => {
        routeBackTab();
    };
    const onEdit = () => {
        router.push({
            path: '/processManagement/activityType/editActivityTypeDetail',
            query: { type: 'edit', workUnitTypeId: workUnitTypeId }
        });
    };

    const load = async () => {
        if (routerType.value === 'add') {
            title.value = '新增作业单元类型';
            paramsData.value = { status: '1' };
        } else if (routerType.value === 'edit') {
            title.value = '编辑作业单元类型';
            const params = {
                workUnitTypeId: workUnitTypeId
            };
            const res = await workingProcedure.getWorkUnitTypeById(params);
            console.log(res.data.object);

            paramsData.value = res.data.object;
        } else {
            title.value = '作业单元类型详情';
            const params = {
                workUnitTypeId: workUnitTypeId
            };
            const res = await workingProcedure.getWorkUnitTypeById(params);
            paramsData.value = res.data.object;
        }
    };
    const onSave = () => {
        Promise.all([base.value?.baseRef?.validate()]).then(async function () {
            const res = activity.value.getDataList();

            const params = {
                ...base.value.formState,
                workUnitIds: res,
                workUnitTypeId: workUnitTypeId
            };

            if (routerType.value === 'add') {
                const res = await workingProcedure.addWorkUnitType(params);
                message.success('新增成功');
                back();
            }
            if (routerType.value === 'edit') {
                const res = await workingProcedure.editWorkUnitType(params);
                message.success('编辑成功');
                back();
            }
        });
    };
    onMounted(async () => {
        load();
    });
</script>

<style scoped lang="less">
    .activityTypeDetail {
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
