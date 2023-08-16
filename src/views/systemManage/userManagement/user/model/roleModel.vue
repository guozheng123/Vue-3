<template>
    <TpfModal
        class="roleModel"
        v-model:visible="visible"
        title="添加角色"
        height="400px"
        width="800px"
    >
        <a-form
            :label-col="{ span: 6, offset: 3 }"
            layout="inline"
            :model="formState"
            @finish="handleFinish"
        >
            <a-form-item label="角色编码">
                <a-input v-model:value="formState.roleCode" />
            </a-form-item>
            <a-form-item label="角色名称">
                <a-input v-model:value="formState.roleName" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit"> 查询 </a-button>
            </a-form-item>
        </a-form>
        <TpfTable
            v-bind="{
                ...tableInfo,
                loading,
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
    import { useRoleApi } from '@/api';
    import { cloneDeep, sortBy } from 'lodash-es';

    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const formState = ref({
        roleCode: '',
        roleName: ''
    });
    const [visible, setVisible] = useRef(false);

    // const [selectedRowKeys, setSelectedRowKeys] = useRef<string[]>([]);
    // const [selectedRow, setSelectedRow] = useRef<any[]>([]);
    const roleApi = useRoleApi();
    const emit = defineEmits(['getList']);
    const Ids = ref([]) as any;

    const open = (val: string[]) => {
        setVisible(!visible.value);
        Ids.value = cloneDeep(val);
        // setSelectedRowKeys(val);
        selectedRowInfo.value.selectedRowKeys = val;
        formState.value = {
            roleCode: '',
            roleName: ''
        };
        unref(pagination).current = 1;

        getDataList();
    };

    const columns = ref<TpfColumnType[]>([
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            key: 'roleCode',
            align: 'center',
            width: 150
        },
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName', align: 'center', width: 150 },

        { title: '备注', dataIndex: 'remake', key: 'remake', align: 'center', width: 150 }
    ]);

    const { tableInfo, pagination, loading, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await roleApi.queryRolePageByParam({
                ...unref(formState),
                pageSize,
                lockFlag: 1,
                page: current
            });
            const list = res.data.object.list;
            const sortByList = sortBy(list, function (o) {
                return o.roleCode;
            });
            res.data.object.list = sortByList;

            return res.data.object;
        },
        rowKey: 'roleId',
        isPageAble: true,
        hasRowSelection: true
    });
    const handleFinish = () => {
        getDataList();
    };
    const submitModel = () => {
        const data = ref([]) as any;
        unref(selectedRowInfo).selectedRows.forEach((e: any) => {
            if (!unref(Ids).includes(e.roleId)) {
                data.value.push(e);
            }
        });
        console.log(data, 'data');
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
