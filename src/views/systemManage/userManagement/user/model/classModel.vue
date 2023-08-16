<template>
    <TpfModal
        class="roleModel"
        v-model:visible="visible"
        title="添加班组"
        height="400px"
        width="800px"
    >
        <a-form
            :label-col="{ span: 6, offset: 3 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="班组编码">
                <a-input v-model:value="formState.workingTeamCode" />
            </a-form-item>
            <a-form-item label="班组描述">
                <a-input v-model:value="formState.workingTeamName" />
            </a-form-item>
            <a-form-item label="车间编码">
                <a-input v-model:value="formState.workshopCode" />
            </a-form-item>
            <a-form-item label="车间描述">
                <a-input v-model:value="formState.workshopName" />
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

<script setup lang="ts" name="RoleModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref, defineAsyncComponent } from 'vue';
    import type { TpfColumnType } from '@/types';
    import { useAntdTable, useRef } from '@/hooks';
    import { useWorkingTeamAPi } from '@/api';
    import { cloneDeep, sortBy } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        workingTeamCode: '',
        workingTeamName: '',
        workshopCode: '',
        workshopName: ''
    });
    const [visible, setVisible] = useRef(false);

    const workingTeamAPi = useWorkingTeamAPi();

    const emit = defineEmits(['getList']);
    const Ids = ref([]) as any;
    const open = (val: string[]) => {
        setVisible(!visible.value);
        Ids.value = cloneDeep(val);
        selectedRowInfo.value.selectedRowKeys = val;
        formState.value = {
            workingTeamCode: '',
            workingTeamName: '',
            workshopCode: '',
            workshopName: ''
        };
        unref(pagination).current = 1;

        getDataList();
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '班组',
            dataIndex: 'workingTeamAbbreviation',
            key: 'workingTeamAbbreviation',
            align: 'center',
            width: 150
        },
        {
            title: '车间',
            dataIndex: 'workshopName',
            key: 'workshopName',
            align: 'center',
            width: 150
        },
        { title: '工厂', dataIndex: 'factoryName', key: 'factoryName', align: 'center', width: 150 }
    ]);

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pageInfo => {
            const { current, pageSize } = unref(pageInfo);
            const res = await workingTeamAPi.getWorkingTeamList({
                page: current,
                pageSize,
                status: 1,
                ...formState.value
            });
            const list = res.data.object.list;
            const sortByList = sortBy(list, function (o) {
                return o.workingTeamAbbreviation;
            });
            res.data.object.list = sortByList;

            return res.data.object;
        },
        rowKey: 'workingTeamId',
        isPageAble: true,
        hasRowSelection: true
    });
    const handleFinish = () => {
        unref(pagination).current = 1;

        getDataList();
    };
    const submitModel = () => {
        const data = ref([]) as any;
        unref(selectedRowInfo).selectedRows.forEach((e: any) => {
            if (!unref(Ids).includes(e.workingTeamId)) {
                data.value.push(e);
            }
        });
        emit('getList', data);

        setVisible(!visible.value);
    };

    defineExpose({ open });
</script>

<style scoped lang="less">
    :deep(.tpf-layout-content) {
        margin-top: 0 !important;
        height: 200px;

        .operate-line {
            height: 0 !important;
        }
    }

    :deep(.ant-form) {
        padding-left: 25px !important;
    }
</style>
