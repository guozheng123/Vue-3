<template>
    <TpfLayout>
        <template #header>
            <LoadingSkeleton>
                <TpfForm @onSubmit="onSubmit" :pageCode="pageCode" />
            </LoadingSkeleton>
        </template>
        <template #content>
            <LoadingSkeleton>
                <TpfTableLayout
                    showChangeTableFontSize
                    showChangeTableGap
                    showChangeTableColumnFields
                    :pageCode="pageCode"
                >
                    <template #default="args">
                        <TpfTable
                            v-bind="{
                                ...args,
                                ...tableInfo,
                                loading,
                                pagination,
                                seq: true,
                                operateColumn,
                                beforeRender
                            }"
                        />
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" />新增
                        </a-button>
                    </template>
                </TpfTableLayout>
            </LoadingSkeleton>
        </template>
        <AddExceptionTypeModal
            v-if="onloadAddExceptionTypeModal"
            ref="AddExceptionTypeRef"
            @onGetTableList="getDataList"
        />
    </TpfLayout>
</template>

<script setup lang="tsx" name="productionExceptionType">
    import { message } from 'ant-design-vue';
    import { useExceptionCodeAPi } from '@/api';
    import type { ReqQueryExceptionCodeByPage } from '@/api';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';

    import TpfForm from '@/components/TpfForm/index.vue';
    import TpfLayout from '@/components/TpfLayout/index.vue';
    import { ref, unref, defineAsyncComponent, onMounted } from 'vue';
    import { withTpfTableOperateColumn } from '@/components/TpfTable/index';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));
    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );

    const AddExceptionTypeModal = defineAsyncComponent(
        () => import('./components/AddExceptionTypeModal.vue')
    );
    const pageCode = PageCodeEnum.productionExceptionType;

    const { getLabel, reportInOrder } = getTpfOptionEnum();
    const searchInfo = ref({} as ReqQueryExceptionCodeByPage);
    const exceptionCodeAPi = useExceptionCodeAPi();
    const [AddExceptionTypeRef, onOpenAddExceptionTypeModal, onloadAddExceptionTypeModal] =
        useOpenAntdModal();
    const defaultBtn = [
        {
            title: '编辑',
            onClick: (row: { [key: string]: any }) => {
                onOpenAddExceptionTypeModal(row);
            }
        },
        {
            title: '删除',
            onClick: (row: { [key: string]: any }) => {
                onDeleteChange(typeof row.value?.id === 'number' ? [row.value?.id] : []);
            }
        }
    ];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 160,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });
    const onAdd = () => {
        onOpenAddExceptionTypeModal();
    };

    const initGetDataList = () => {
        unref(pagination).current = 1;
        getDataList();
    };
    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        initGetDataList();
    };
    const onDeleteChange = async (list: any[]) => {
        await modalTitle('确认是否删除操作！', '确认删除！');
        onDelete(list);
    };
    const onDelete = async (ids: number[]) => {
        try {
            loading.value = true;
            const { data, success } = await exceptionCodeAPi.deleteExceptionCodeById({ ids });
            if (success) {
                message.success(data.value);
                initGetDataList();
            }
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
            initGetDataList();
        }
    };
    let TpfDelConfirm: string | any = '';
    const modalTitle = (content: string, title: string) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            if (!TpfDelConfirm) {
                TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
            }
            await TpfDelConfirm({ content, title });
            res(true);
        });
    };
    const { tableInfo, pagination, loading, getDataList } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await exceptionCodeAPi.queryExceptionCodeByPage({
                ...unref(searchInfo),
                page: current,
                pageSize
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true
    });

    const beforeRender = (list: TpfColumnType[]) => {
        return unref(list).map(item => {
            if (['report', 'available'].includes(item.dataIndex as string)) {
                item.customRender = ({ text, record }) => {
                    return getLabel(text, reportInOrder);
                };
            }
            return item;
        });
    };

    onMounted(() => {
        getDataList();
    });
</script>
