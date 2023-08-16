<template>
    <TpfModal
        class="stationModel"
        v-model:visible="visible"
        title="添加岗位"
        height="400px"
        width="800px"
    >
        <a-form
            :label-col="{ span: 6, offset: 3 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="岗位编码">
                <a-input v-model:value="formState.postCode" />
            </a-form-item>
            <a-form-item label="岗位名称">
                <a-input v-model:value="formState.postName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 查询 </a-button>
            </a-form-item>
        </a-form>
        <TpfTable
            v-bind="{
                ...tableInfo,
                pagination,
                columns,
                seq: true
            }"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="submitModel">保存</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="ts" name="StationModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { usePostApi } from '@/api';
    import { cloneDeep, sortBy } from 'lodash-es';

    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);
    // const [selectedRow, setSelectedRow] = useRef<any[]>([]);
    const postApi = usePostApi();
    const emit = defineEmits(['getList']);
    const Ids = ref([]) as any;
    const [visible, setVisible] = useRef(false);
    const formState = ref({
        postCode: '',
        postName: ''
    });

    const open = (val: string[]) => {
        setVisible(!visible.value);
        Ids.value = cloneDeep(val);
        // setSelectedRowKeys(val);
        selectedRowInfo.value.selectedRowKeys = val;
        getDataList();
        formState.value = {
            postCode: '',
            postName: ''
        };
    };

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const columns = ref<TpfColumnType[]>([
        {
            title: '岗位编码',
            dataIndex: 'postCode',
            key: 'postCode',
            align: 'center',
            width: 150
        },
        { title: '岗位名称', dataIndex: 'postName', key: 'postName', align: 'center', width: 150 }
    ]);

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await postApi.getPostList({
                page: current,
                pageSize,
                lockFlag: 1,
                ...unref(formState)
            });
            const list = res.data.object.list;
            const sortByList = sortBy(list, function (o) {
                return o.postCode;
            });
            res.data.object.list = sortByList;

            return res.data.object;
        },
        rowKey: 'postId',
        isPageAble: true,
        hasRowSelection: true
    });
    const handleFinish = () => {
        getDataList();
    };
    const submitModel = () => {
        const data = ref([]) as any;
        unref(selectedRowInfo).selectedRows.forEach((e: any) => {
            if (!unref(Ids).includes(e.postId)) {
                data.value.push(e);
            }
        });
        emit('getList', data);
        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.ant-form) {
        padding-left: 25px !important;
    }
</style>
