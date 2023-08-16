<template>
    <div>
        <TpfAnchor :anchorList="anchorList" />
        <TpfDetailLayout @onSave="onSave" :isShow="routerType !== 'detail'">
            <template #header>
                <TpfDetailTitle :title="title" />
            </template>
            <template #content>
                <div class="main">
                    <div class="contents">
                        <div id="baseRef">
                            <LoadingSkeleton>
                                <BaseComponent
                                    :paramsData="paramsData"
                                    v-if="paramsData"
                                    ref="baseRef"
                                />
                            </LoadingSkeleton>
                        </div>
                        <div id="file">
                            <LoadingSkeleton>
                                <FilesComponent
                                    :paramsData="paramsData"
                                    v-if="paramsData"
                                    ref="fileRef"
                                />
                            </LoadingSkeleton>
                        </div>
                        <div id="role">
                            <LoadingSkeleton>
                                <RoleComponent
                                    :paramsData="paramsData"
                                    v-if="paramsData"
                                    ref="roleRef"
                            /></LoadingSkeleton>
                        </div>
                        <div id="station">
                            <LoadingSkeleton>
                                <StationComponent
                                    :paramsData="paramsData"
                                    v-if="paramsData"
                                    ref="stationRef"
                                />
                            </LoadingSkeleton>
                        </div>
                        <div id="classComponent">
                            <LoadingSkeleton>
                                <ClassComponent
                                    :paramsData="paramsData"
                                    v-if="paramsData"
                                    ref="classComponentRef"
                                />
                            </LoadingSkeleton>
                        </div>
                    </div>
                </div>
            </template>
        </TpfDetailLayout>
    </div>
</template>

<script setup lang="ts" name="AddUser">
    import { ref, unref, defineAsyncComponent, onMounted, computed } from 'vue';
    import { useUserApi } from '@/api';
    import { message } from 'ant-design-vue';
    import { cloneDeep } from 'lodash-es';
    import { useRouter } from 'vue-router';
    import { useRouteBackTab } from '@/hooks';

    const userApi = useUserApi();

    const TpfDetailLayout = defineAsyncComponent(
        () => import('@/components/TpfDetailLayout/index.vue')
    );
    const TpfDetailTitle = defineAsyncComponent(
        () => import('@/components/TpfDetailTitle/index.vue')
    );
    const TpfAnchor = defineAsyncComponent(() => import('@/components/TpfAnchor/index.vue'));
    const RoleComponent = defineAsyncComponent(() => import('../component/role.vue'));
    const StationComponent = defineAsyncComponent(() => import('../component/station.vue'));
    const ClassComponent = defineAsyncComponent(() => import('../component/classComponent.vue'));
    const BaseComponent = defineAsyncComponent(() => import('../component/base.vue'));
    const FilesComponent = defineAsyncComponent(() => import('../component/files.vue'));

    const anchorList = [
        { href: 'baseRef', title: '基础', visible: true },
        { href: 'file', title: '档案', visible: true },
        { href: 'role', title: '角色', visible: true },
        { href: 'station', title: '岗位', visible: true },
        { href: 'classComponent', title: '班组', visible: true }
    ];
    const { routeBackTab } = useRouteBackTab();

    const $router = useRouter();
    const baseRef: any = ref(null);
    const fileRef: any = ref(null);
    const roleRef: any = ref(null);
    const stationRef: any = ref(null);
    const classComponentRef: any = ref(null);
    const title = ref('');
    const paramsData = ref<{ [k: string]: any } | null>(null);
    const routerType = computed(() => $router.currentRoute.value.query.type);
    const userId = computed(() => $router.currentRoute.value.query.userId);

    const onSave = () => {
        if (routerType.value === 'detail') {
            back();
            return;
        }
        Promise.all([baseRef.value?.baseRef?.validate(), fileRef.value?.fileRef?.validate()]).then(
            async function () {
                if (
                    baseRef.value?.formState.employeeNo === '' &&
                    baseRef.value?.formState.userAccount === ''
                ) {
                    message.warning('用户账号 员工工号至少选择一项');
                } else {
                    const {
                        userAccount,
                        userName,
                        employeeNo,
                        systemFlag,
                        lockFlag,
                        password,
                        fromDate,
                        toDate
                    } = unref(baseRef.value?.formState);
                    const fileRefVal = cloneDeep(unref(fileRef.value?.formState));
                    fileRefVal.receiveSmsFlag = fileRefVal.receiveSmsFlag ? 1 : 0;
                    fileRefVal.receiveMailFlag = fileRefVal.receiveMailFlag ? 1 : 0;

                    const postId = stationRef.value?.tableInfo.dataSource.map((e: any) => {
                        return e.postId;
                    });
                    const roleId = roleRef.value?.tableInfo.dataSource.map((e: any) => {
                        return e.roleId;
                    });
                    const workingTeamId = classComponentRef.value?.tableInfo.dataSource.map(
                        (e: any) => {
                            return e.workingTeamId;
                        }
                    );
                    const params = {
                        userAccount,
                        userName,
                        employeeNo,
                        systemFlag,
                        lockFlag,
                        fromDate,
                        toDate,
                        ...fileRefVal,
                        postId: postId,
                        workingTeamId: workingTeamId,
                        roleId: roleId,
                        password
                    };

                    if (routerType.value === 'add') {
                        const res = await userApi.createUpdateUser(params);
                        console.log(res);
                        message.success('添加成功');
                        back();
                    } else if (routerType.value === 'edit') {
                        params.userId = userId.value;
                        const res = await userApi.createUpdateUser(params);
                        console.log(res);
                        message.success('编辑成功');
                        back();
                    }
                }
            }
        );
    };
    const back = () => {
        routeBackTab();
    };
    const load = async () => {
        if (routerType.value === 'add') {
            title.value = '新增用户';
            paramsData.value = {};
        } else if (routerType.value === 'edit' || routerType.value === 'detail') {
            title.value = routerType.value === 'edit' ? '编辑用户' : '用户详情';
            const res = await userApi.getUserById({ userId: userId.value });
            paramsData.value = res.data.object;
        }
    };
    onMounted(() => {
        load();
    });
</script>

<style scoped lang="less">
    .main {
        position: relative;

        :deep(.ant-form-item-label) {
            text-overflow: ellipsis;
            padding-top: 5px;
        }

        :deep(.ant-form-item-label) > label {
            display: inline;
        }

        .ant-btn.ant-btn-background-ghost {
            color: #4e5969;
            border-color: #d9d9d9;
            width: 100%;
            height: 74px;
        }

        .tpf-button {
            background-color: var(--ant-primary-color);
            color: white;
        }

        .btn {
            width: 33px;
            background: #f7f8fa;
            text-align: center;
            padding: 0 !important;
        }

        :deep(.ant-card) {
            border-radius: 8px;

            .ant-card-body {
                padding: 8px 12px 8px 12px;

                .title_name {
                    padding-left: 16px !important;
                    color: #1d2129;
                    font-size: 16px;
                }
            }
        }

        .bottom_card {
            width: 100%;
            height: 60px;
            position: fixed !important;
            bottom: 0;
            // right: 0;
            .formBtn {
                // float: right;
                margin-left: 20px;
            }
        }
    }
</style>
