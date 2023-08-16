<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm
                    :labelCol="{ style: { width: '120px' } }"
                    :formList="formList"
                    @onSubmit="onSubmit"
                />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout>
                    <template #default="args">
                        <a-form
                            style="height: 100%"
                            ref="formRef"
                            :model="tableInfo"
                            class="table-form"
                        >
                            <TpfTable
                                style="height: 100%"
                                ref="tableInstance"
                                class="tpf-table-form"
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    pagination,
                                    seq: true,
                                    columns,
                                    operateColumn
                                }"
                            />
                        </a-form>
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
    </TpfLayout>
</template>

<script setup lang="tsx" name="MessageNotificationConfiguration">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, computed, defineAsyncComponent, onMounted, unref } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { FormItem, Select, Switch } from 'ant-design-vue';
    import type { TpfColumnType } from '@/types';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import type { TpfOperateBtn } from '@/types';
    import { useAntdTable, useAntdForm } from '@/hooks';
    import { checkRequired } from '@/formRuleConfig/Tpfrules';
    import { v4 } from 'uuid';
    import { useSysPageFieldDiyApi, useRoleApi, useUserApi, useMessageApi } from '@/api';
    import { DefaultOptionType } from 'ant-design-vue/es/vc-tree-select/TreeSelect';
    import { debounce, uniq } from 'lodash-es';
    import { message } from 'ant-design-vue';

    const useSysPageFieldDiy = useSysPageFieldDiyApi();
    const roleApi = useRoleApi();
    const userApi = useUserApi();
    const messageApi = useMessageApi();

    const { isStart, notificationChannels, getLabel } = getTpfOptionEnum();
    // 业务对象列表
    const materialMoldList = ref<DefaultOptionType[]>([]);
    // 通知状态里列表
    const motificationStatus = ref<any[]>([]);
    // 通知角色列表
    const notificationRoleList = ref<DefaultOptionType[]>([]);
    // 通知用户列表
    const notificationUserList = ref<DefaultOptionType[]>([]);
    // 消息模板列表
    const messageTemplate = ref<DefaultOptionType[]>([]);

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const { formRef, validateFields } = useAntdForm();

    // 保存详情数据
    const configDetail = ref<any[]>([]);

    const columns = computed<TpfColumnType<any>[]>(() => [
        {
            title: () => <span class="required"> 业务对象</span>,
            dataIndex: 'objectName',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.objectName;
                }
                return (
                    <FormItem
                        rules={[checkRequired()] as any}
                        name={['dataSource', index, 'objectName']}
                    >
                        <Select
                            allowClear
                            v-model:value={record.objectName}
                            showSearch={true}
                            optionFilterProp="label"
                            showArrow
                            fieldNames={{
                                label: 'dictLabel',
                                value: 'dictValue'
                            }}
                            filterOption={filterOption}
                            options={materialMoldList.value}
                            onChange={() => onGetStoreLocationList(record)}
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: '触发条件',
            dataIndex: 'noticeCondition',
            ...tableResizable()
        },
        {
            title: () => <span class="required"> 通知状态</span>,
            dataIndex: 'noticeStatus',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.noticeStatus;
                }
                return (
                    <FormItem
                        rules={[checkRequired()] as any}
                        name={['dataSource', index, 'noticeStatus']}
                    >
                        <Select
                            allowClear
                            v-model:value={record.noticeStatus}
                            options={motificationStatus.value}
                            filterOption={filterOption}
                            disabled={!record.objectName}
                            fieldNames={{
                                label: 'dictLabel',
                                value: 'dictValue'
                            }}
                            showSearch
                            showArrow
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: () => <span class="required"> 通知渠道</span>,
            dataIndex: 'noticeChannel',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.noticeChannel;
                }
                return (
                    <FormItem
                        rules={[checkRequired()] as any}
                        name={['dataSource', index, 'noticeChannel']}
                    >
                        <Select
                            allowClear
                            v-model:value={record.noticeChannel}
                            options={notificationChannels}
                            mode="multiple"
                            showArrow
                            maxTagCount="responsive"
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: '通知创建人',
            dataIndex: 'noticeCreate',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'noticeCreate']}>
                        <a-checkbox
                            v-model:checked={record.noticeCreate}
                            disabled={record.isDefult}
                        ></a-checkbox>
                    </FormItem>
                );
            }
        },
        {
            title: '通知角色',
            dataIndex: 'noticeRolesName',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.noticeRolesName;
                }
                return (
                    <FormItem name={['dataSource', index, 'noticeRole']}>
                        <Select
                            allowClear
                            v-model:value={record.noticeRolesName}
                            options={notificationRoleList.value}
                            mode="multiple"
                            showSearch
                            showArrow
                            maxTagCount="responsive"
                            filterOption={filterOption}
                            fieldNames={{
                                label: 'roleName',
                                value: 'roleId'
                            }}
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: '通知用户',
            dataIndex: 'noticeUsersName',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.noticeUsersName;
                }
                return (
                    <FormItem name={['dataSource', index, 'noticeUsers']}>
                        <Select
                            allowClear
                            options={notificationUserList.value}
                            v-model:value={record.noticeUsersName}
                            mode="multiple"
                            maxTagCount="responsive"
                            showArrow
                            fieldNames={{
                                label: 'userName',
                                value: 'userId'
                            }}
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: '消息模板',
            dataIndex: 'templateTitle',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                if (record.isDefult) {
                    return record.templateTitle;
                }
                return (
                    <FormItem name={['dataSource', index, 'templateTitle']}>
                        <Select
                            allowClear
                            v-model:value={record.templateTitle}
                            options={messageTemplate.value}
                            fieldNames={{
                                label: 'templateTitle',
                                value: 'templateNo'
                            }}
                            filterOption={blur}
                            showSearch
                            showArrow
                        ></Select>
                    </FormItem>
                );
            }
        },
        {
            title: '是否启用',
            dataIndex: 'enable',
            ...tableResizable(),
            customRender: ({ text, record, index }) => {
                return (
                    <FormItem name={['dataSource', index, 'enable']}>
                        <Switch
                            v-model:checked={record.enable}
                            checked="1"
                            checkedValue="1"
                            unCheckedValue="0"
                            disabled={record.isEdit}
                        />
                    </FormItem>
                );
            }
        }
    ]);

    // 获取业务对象列表数据
    const getSysDictType = async () => {
        const res = await useSysPageFieldDiy.getSysDictType({ dictType: 'object_code' });
        materialMoldList.value = res.data.object.dictValueVos;
    };

    // 获取通知状态列表数据
    const onGetStoreLocationList = async (value: any) => {
        value.noticeStatus = '';
        try {
            const res = await useSysPageFieldDiy.getSysDictType({
                dictType: value.objectName
            });
            motificationStatus.value = res.data.object.dictValueVos;
        } catch (error) {
            console.log(error);
        }
        console.log(value);
    };

    // 获取通知角色列表数据
    const getNotificationRoleList = async () => {
        const res = await roleApi.queryRolePageByParam({});
        notificationRoleList.value = res.data.object.list;
    };

    // 获取通知用户列表数据
    const getNotificationUserList = async () => {
        const { data } = await userApi.queryUserPageByParam({});

        notificationUserList.value = data.object.list.map(e => {
            const params = {
                userId: e.userId,
                userName: e.userName
            };
            return params;
        });
    };

    // 获取消息模板列表数据
    const getMessageTemplateList = async () => {
        try {
            const res = await messageApi.querylist({});
            messageTemplate.value = res.data.object.list;
        } catch (error) {
            console.log(error);
        }
    };

    const filterOption = (input: string, option: any) => {
        return option.dictLabel.indexOf(input) >= 0;
    };

    const blur = (input: string, option: any) => {
        return option.templateTitle.indexOf(input) >= 0;
    };

    const searchInfo = ref<{ [k: string]: any }>({});

    const onAdd = () => {
        unref(getTableList()).unshift({
            isEdit: false,
            index: 0,
            enable: '1',
            noticeCondition: '状态变更'
        } as any);
        const res = unref(getTableList()).map((e: any, i: number) => {
            e.index = i;
            e.v4 = v4();
            return e;
        });
        console.log(res);
        setTableList(res);
    };

    const operateColumn = ref<TpfColumnType<any>>({
        title: '操作',
        align: 'center',
        width: 120,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn(...args))
    });

    const isChineseCharacter = (str: string) => {
        // 使用正则表达式匹配汉字字符
        const pattern = /^[\u4e00-\u9fa5]+$/;
        return pattern.test(str);
    };

    const defaultBtn = (record: any) => {
        return [
            {
                title: '编辑',
                onClick: async ({ index, record }) => {
                    const res = unref(getTableList()).map((e: any, i: number) => {
                        if (i === index) {
                            e.isEdit = false;
                            e.isDefult = false;
                        }
                        return e;
                    });
                    setTableList(res);
                    const { data } = await messageApi.configurationDetail({
                        msgConfNo: record.msgConfNo
                    });
                    configDetail.value = data.list;
                },
                hidden: !record.value.isEdit
            },
            {
                title: '保存',
                onClick: async ({ index, record }) => {
                    const validateFieldsArr = [
                        ['dataSource', index, 'noticeChannel'],
                        ['dataSource', index, 'objectName'],
                        ['dataSource', index, 'noticeStatus']
                    ];
                    await validateFields(validateFieldsArr);
                    let objectCodes = '';
                    let noticeStatus = '';
                    let templateNos = '';
                    const noticeRoles: any[] = [];
                    const noticeusers: any[] = [];
                    const noticeRole = record.noticeRolesName?.every((value: any) => {
                        return typeof value === 'number';
                    });
                    const Roles = record.noticeRolesName?.filter((item: any) => {
                        return typeof item === 'number';
                    });

                    const noticeUsersName = record.noticeUsersName?.every((value: any) => {
                        return typeof value === 'number';
                    });
                    const Users = record.noticeUsersName?.filter((item: any) => {
                        return typeof item === 'number';
                    });
                    configDetail.value.map((e: any) => {
                        const roles =
                            e.noticeroles
                                ?.filter((item: any) => {
                                    return record.noticeRolesName?.includes(item.roleName);
                                })
                                .map((item: any) => item.roleCode) || [];
                        const combinedRoles = [...roles, ...Roles];
                        noticeRoles.push(...combinedRoles);
                        console.log(noticeRoles);
                        const users =
                            e.noticeusers
                                ?.filter((item: any) => {
                                    return record.noticeUsersName?.includes(item.userName);
                                })
                                .map((item: any) => item.userId) || [];
                        const combinedUser = [...users, ...Users];
                        noticeusers.push(...combinedUser);

                        objectCodes = e.objectCode;
                        noticeStatus = e.noticeStatus;
                        templateNos = e.templateNo;
                    });
                    try {
                        const { data } = await messageApi.addBatchMessageConfiguration([
                            {
                                ...record,
                                objectCode: isChineseCharacter(record.objectName)
                                    ? objectCodes
                                    : record.objectName,
                                noticeStatus: isChineseCharacter(record.noticeStatus)
                                    ? noticeStatus
                                    : record.noticeStatus,
                                noticeRole: noticeRole ? record.noticeRolesName : uniq(noticeRoles),
                                noticeUsers: noticeUsersName
                                    ? record.noticeUsersName
                                    : uniq(noticeusers),
                                templateNo:
                                    typeof record.templateTitle === 'string'
                                        ? templateNos
                                        : record.templateTitle
                            }
                        ]);
                        if (data.value === 0) {
                            message.success('新增成功');
                            getDataList();
                        } else if (data.value === 1) {
                            message.success('编辑成功');
                            getDataList();
                        }
                    } catch (err) {
                        console.log(err);
                    }
                },
                hidden: record.value.isEdit
            }
        ] as TpfOperateBtn<any>[];
    };

    const formList = computed(() => {
        return [
            {
                type: 'Select',
                field: 'objectCode',
                label: '业务对象',
                showDefaultValue: '',
                placeholder: '',
                allowClear: true,
                options: materialMoldList.value,
                fieldNames: {
                    label: 'dictLabel',
                    value: 'dictValue'
                }
            },
            {
                type: 'Select',
                field: 'enable',
                label: '是否启用',
                allowClear: true,
                options: isStart
            }
        ];
    });

    const onSubmit = async (res: any) => {
        searchInfo.value = res;
        getDataList();
    };

    const dataCallBack = (list: any[]) => {
        const newList = list.map((e: any, i: number) => {
            e['v4'] = v4();
            e['isEdit'] = true;
            e['isDefult'] = true;
            return e;
        });
        return newList;
    };
    const { tableInfo, pagination, getDataList, setTableList, getTableList } = useAntdTable({
        api: async pageInfo => {
            const { current: page, pageSize, sortedField, sortByAsc } = unref(pageInfo);
            const info = {
                page,
                pageSize,
                sortedField: sortedField || 'create_datetime',
                sortByAsc,
                ...unref(searchInfo)
            };
            const res = await messageApi.configurationList(info);
            return res.data.object;
        },
        rowKey: 'v4',
        isPageAble: true,
        dataCallBack
    });

    onMounted(async () => {
        getDataList();
        // 获取业务对象数据
        getSysDictType();
        // 获取通知角色数据
        getNotificationRoleList();
        // 获取通知用户数据
        getNotificationUserList();
        // 获取消息模板数据
        getMessageTemplateList();
    });
</script>

<style lang="less" scoped>
    .productionOrderDetail {
        :deep(.addInfoLayout-content) {
            padding: 0 12px;
            box-sizing: border-box;
        }

        :deep(.tpf-collapse) {
            .tpf-collapse-content {
                background: #fff;
            }
        }
    }
</style>
