<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm :formList="formList" @onSubmit="onSubmit" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap>
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                seq: true
                            }"
                            :operateColumn="operateColumn"
                            :columns="columns"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" /> 新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>

                        <!-- 导入 -->
                        <TpfTableImportBtn
                            :uploadAction="uploadAction"
                            :multiple="false"
                            downLoadTemplate="customerSupplierTemplate"
                            @uploadTable="getDataList"
                        />
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <InfoModal ref="infoModal" @submitAdd="submitAdd" @submitUpdata="submitUpdata" />
        <DelModal ref="delDetail" />
    </TpfLayout>
</template>

<script setup lang="tsx" name="merchantManagement">
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, defineAsyncComponent, onMounted, unref, computed } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType, TpfUploadFile } from '@/types';
    import { useCustomerSupplierAPi, useCompanyAPi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';
    import { message } from 'ant-design-vue';
    import { tableResizable, getTpfOptionEnum } from '@/config';
    import { fmtDayjsTime, formateTreeCode } from '@/utils';
    import dayjs from 'dayjs';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty } from 'lodash-es';

    const { getLabel, deliveryType, customerSupplierType, regionData, statusOption } =
        getTpfOptionEnum();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const TpfTableImportBtn = defineAsyncComponent(
        () => import('@/components/TpfTable/TpfTableImportBtn.vue')
    );

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const DelModal = defineAsyncComponent(() => import('./components/DelModal.vue'));
    const InfoModal = defineAsyncComponent(() => import('./components/InfoModal.vue'));

    const [infoModal, onOpenInfo] = useOpenAntdModal();
    const [delDetail, onOpenDel] = useOpenAntdModal();
    const customerSupplierAPi = useCustomerSupplierAPi();
    const companyAPi = useCompanyAPi();
    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);
    const searchInfo = ref<any>({});

    const companyOption = ref([{ value: '', label: '所有' }]);

    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'customerSupplierCode',
                showDefaultValue: '',
                label: '单位编号',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'customerSupplierName',
                showDefaultValue: '',
                label: '单位名称',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'customerSupplierType',
                showDefaultValue: '',
                label: '类型',
                options: [
                    { value: '', label: '所有' },
                    { value: 'CUSTOMER', label: '客户' },
                    { value: 'SUPPLIER', label: '供应商' }
                ]
            },
            {
                type: 'Select',
                field: 'forbidden',
                showDefaultValue: '',
                label: '是否启用',
                options: statusOption
            },
            {
                type: 'Select',
                field: 'companyId',
                showDefaultValue: '',
                label: '所属公司',
                options: unref(companyOption)
            },
            {
                type: 'Input',
                field: 'customerSupplierShortName',
                showDefaultValue: '',
                label: '单位简称',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'contacts',
                showDefaultValue: '',
                label: '联系人',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'telephone',
                showDefaultValue: '',
                label: '电话',
                allowClear: true
            },
            {
                type: 'Cascader',
                field: 'shengshiqu',
                showDefaultValue: [],
                label: '所在地区',
                placeholder: '请选择地区',
                allowClear: true,
                options: regionData,
                expandTrigger: 'hover'
            },
            {
                type: 'Input',
                field: 'address',
                showDefaultValue: '',
                label: '详细地址',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'createUser',
                showDefaultValue: '',
                label: '创建人',
                allowClear: true
            },
            {
                type: 'Input',
                field: 'modifyUser',
                showDefaultValue: '',
                label: '修改人',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'deliveryType',
                showDefaultValue: '',
                label: '发货模式',
                options: [
                    { value: '', label: '所有' },
                    { value: 'BYCUSTOMER', label: '按客户' },
                    { value: 'BYBATCH', label: '按订单批次' }
                ]
            },
            {
                type: 'RangePicker',
                field: 'createDatetime',
                showDefaultValue: [],
                label: '创建日期',
                allowClear: true
            },
            {
                type: 'RangePicker',
                field: 'modifyDatetime',
                showDefaultValue: [],
                label: '修改日期',
                allowClear: true
            }
        ];
    });

    const columns = ref<TpfColumnType[]>([
        {
            title: '单位编号',
            dataIndex: 'customerSupplierCode',
            ...tableResizable(),
            width: 100,
            sorter: (a, b) => {
                const a1 = a.customerSupplierCode.slice(0, 1).charCodeAt();
                const b1 = b.customerSupplierCode.slice(0, 1).charCodeAt();
                return a1 - b1;
            },
            customRender: ({ text, record }) => {
                return (
                    <span class="tpf-link" onClick={() => getMerchantManagementInfo(record)}>
                        {text}
                    </span>
                );
            }
        },
        {
            title: '单位名称',
            dataIndex: 'customerSupplierName',
            ...tableResizable()
        },
        {
            title: '单位简称',
            dataIndex: 'customerSupplierShortName',
            ...tableResizable()
        },
        {
            title: '所属公司',
            dataIndex: 'companyName',
            ...tableResizable()
        },
        {
            title: '类型',
            dataIndex: 'customerSupplierType',
            ...tableResizable(),
            width: 100,
            customRender: ({ text }) => getLabel(text, customerSupplierType)
        },
        {
            title: '发货模式',
            dataIndex: 'deliveryType',
            ...tableResizable(),
            customRender: ({ text }) => getLabel(text, deliveryType)
        },
        {
            title: '联系人',
            dataIndex: 'contacts',
            ...tableResizable()
        },
        {
            title: '电话',
            dataIndex: 'telephone',
            ...tableResizable()
        },
        {
            title: '所在地区',
            dataIndex: 'location',
            ...tableResizable(),
            customRender: ({ record }) => {
                if (record.province) {
                    const arr = [record.province, record.city, record.area];
                    return formateTreeCode(regionData, arr);
                }
                return '';
            }
        },
        {
            title: '详细地址',
            dataIndex: 'address',
            ...tableResizable(),
            width: 250
        },
        {
            title: '是否启用',
            dataIndex: 'forbidden',
            ...tableResizable(),
            customRender: ({ text }) => {
                return text === '1' ? '是' : '否';
            }
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            ...tableResizable()
        },
        {
            title: '创建日期',
            dataIndex: 'createDatetime',
            ...tableResizable(),
            sorter: (a, b) => {
                const t1 = new Date(a.createDatetime).getTime();
                const t2 = new Date(b.createDatetime).getTime();
                return t1 - t2;
            },
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        },
        {
            title: '修改人',
            dataIndex: 'modifyUser',
            ...tableResizable()
        },
        {
            title: '修改日期',
            dataIndex: 'modifyDatetime',
            ...tableResizable(),
            width: 200,
            sorter: (a, b) => {
                const t1 = new Date(a.modifyDatetime).getTime();
                const t2 = new Date(b.modifyDatetime).getTime();
                return t1 - t2;
            },
            customRender: ({ text }) => {
                return dayjs(text).format('YYYY-MM-DD');
            }
        }
    ]);

    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];
    // const selectData = ref<any>([]);
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await customerSupplierAPi.queryCustomerSupplierListByPage({
                ...unref(searchInfo),
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'customerSupplierId',
        hasRowSelection: true
        // isPageAble: true
    });

    const getCompany = async () => {
        const res = await companyAPi.getCompanyList();
        res.data.list.forEach(item => {
            unref(companyOption).push({
                label: item.companyName,
                value: String(item.companyId)
            });
        });
    };
    //查看详情
    const getMerchantManagementInfo = (v: any) => {
        onOpenInfo('viewInfo', v);
    };
    // 新增
    const onAdd = () => {
        onOpenInfo('add');
    };
    const submitAdd = async (v: any) => {
        const res = await customerSupplierAPi.addCustomerSupplier(v);
        if (res.data.value) {
            message.success('信息保存成功！');
            onOpenInfo('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    //编辑
    const onEdit = (v: any) => {
        onOpenInfo('update', v.value);
    };
    const submitUpdata = async (v: any) => {
        console.log(v);
        const res = await customerSupplierAPi.editCustomerSupplier(v);
        if (res.data.value) {
            message.success('信息保存成功！');
            onOpenInfo('close');
            getDataList();
        } else {
            message.error(res.errorMessage);
        }
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        const { createDatetime, modifyDatetime, shengshiqu } = unref(searchInfo);
        const [createDatetimeStart = '', createDatetimeEnd = ''] = createDatetime || [];

        unref(searchInfo).createDatetimeStart = fmtDayjsTime(createDatetimeStart);
        unref(searchInfo).createDatetimeEnd = fmtDayjsTime(createDatetimeEnd);

        const [modifyDatetimeStart = '', modifyDatetimeEnd = ''] = modifyDatetime || [];

        unref(searchInfo).modifyDatetimeStart = fmtDayjsTime(modifyDatetimeStart);
        unref(searchInfo).modifyDatetimeEnd = fmtDayjsTime(modifyDatetimeEnd);

        const [province = '', city = '', area = ''] = shengshiqu || [];
        searchInfo.value = {
            ...unref(searchInfo),
            province,
            city,
            area
        };
        unref(pagination).current = 1;

        getDataList();
    };

    //导入
    const uploadAction = async (fileInfo: { list: TpfUploadFile[]; overrideFlag: boolean }) => {
        const { list, overrideFlag } = unref(fileInfo);

        const [{ fileCode }] = list;

        return await customerSupplierAPi.importCustomerSupplier({ overrideFlag, fileCode });
    };

    // 删除
    const onDelete = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定删除选中的供应商吗？' });
        return new Promise((resolve, reject) => {
            resolve(del());
        }).catch(() => {});
    };
    const del = async () => {
        const arr: Array<number> = [];
        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            arr.push(item.customerSupplierId);
        });
        const res = await customerSupplierAPi.deleteCustomerSupplierByIds(arr);
        if (res.success) {
            if (res.data.list.length > 0) {
                onOpenDel(res.data.list);
            } else {
                message.success('删除成功！');
            }
        } else {
            message.error(res.errorMessage);
        }

        getDataList();
    };

    onMounted(() => {
        getCompany();
    });
</script>
