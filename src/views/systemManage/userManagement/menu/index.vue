<template>
    <div class="menu">
        <TpfIndentation>
            <template #left>
                <LoadingSkeleton>
                    <GroupTree
                        :treeData="treeData"
                        @selectTree="selectTree"
                        v-loading="treeLoading"
                        ref="groupTree"
                        :fieldNames="fieldNames"
                        :isChangeFirst="true"
                        :selectedKeysArr="selectedKeysArr"
                    />
                </LoadingSkeleton>
            </template>
            <template #right>
                <LoadingSkeleton>
                    <TpfForm :formList="formList" @onSubmit="onSubmit" :no-use-init="true" />
                </LoadingSkeleton>
                <TpfTableLayout showChangeTableFontSize showChangeTableGap :pageCode="pageCode">
                    <template #default="args">
                        <LoadingSkeleton>
                            <TpfTable
                                v-bind="{
                                    ...args,
                                    ...tableInfo,
                                    pagination,
                                    operateColumn,
                                    seq: true,
                                    beforeRender
                                }"
                            />
                        </LoadingSkeleton>
                    </template>
                    <template #operateLeft>
                        <a-button type="primary" class="tpf-button" @click="onAdd">
                            <SvgIcon type="icon-insert" />
                            新增
                        </a-button>
                        <a-button
                            class="tpf-button"
                            type="primary"
                            :disabled="isEmpty(selectedRowInfo.selectedRowKeys)"
                            @click="onDelete"
                        >
                            <SvgIcon type="icon-shanchu" /> 删除
                        </a-button>
                    </template>
                </TpfTableLayout>
            </template>
            <AddMenu
                ref="target"
                @submitAdd="submitAdd"
                @submitUpdata="submitUpdata"
                v-if="showModal"
            />
        </TpfIndentation>
        <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
    </div>
</template>

<script setup lang="tsx" name="Menu">
    import { ref, defineAsyncComponent, unref, computed, watch } from 'vue';
    import { useAntdTable, useOpenAntdModal } from '@/hooks';
    import type { TpfColumnType } from '@/types';
    import { queryMenuTreeSelect, useMenuApi } from '@/api';
    import { withTpfTableOperateColumn } from '@/components/TpfTable';
    import { message } from 'ant-design-vue';
    import { PageCodeEnum, getTpfOptionEnum } from '@/config';
    import TpfForm from '@/components/TpfForm/index.vue';
    import { isEmpty } from 'lodash-es';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    import dayjs from 'dayjs';

    const TpfIndentation = defineAsyncComponent(
        () => import('@/components/TpfIndentation/index.vue')
    );

    const GroupTree = defineAsyncComponent(
        () => import('@/views/systemManage/buildBusiness/components/GroupTree.vue')
    );
    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    const TpfTableLayout = defineAsyncComponent(
        () => import('@/components/TpfTableLayout/index.vue')
    );
    const TpfTable = defineAsyncComponent(() => import('@/components/TpfTable/index.vue'));

    const AddMenu = defineAsyncComponent(() => import('./model/addMenu.vue'));
    const groupTree = ref();

    const { getLabel, TREEACE_TYPE, isStart, TRADE, menuType } = getTpfOptionEnum();
    const menuApi = useMenuApi();
    const pageCode = PageCodeEnum.systemManageBuildBusinessMenu;
    const selectedKeysArr = ref([]);
    const [target, onOpenModal, showModal] = useOpenAntdModal();
    const formList = computed(() => {
        return [
            {
                type: 'Input',
                field: 'menuName',
                label: '菜单名称',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'menuType',
                label: '资源类型',
                allowClear: true,
                options: menuType
            },
            {
                type: 'Select',
                field: 'platform',
                label: '平台类型',
                allowClear: true,
                options: TREEACE_TYPE
            },
            {
                type: 'Select',
                field: 'isEnable',
                label: '是否启用',
                allowClear: true,
                options: isStart
            },
            {
                type: 'Input',
                field: 'parentName',
                label: '上级菜单',
                placeholder: '',
                allowClear: true
            },
            {
                type: 'Select',
                field: 'industry',
                label: '行业',
                allowClear: true,
                options: TRADE
            }
        ];
    });
    const fieldNames = {
        children: 'children',
        title: 'label',
        key: 'id'
    };
    const searchInfo = ref<any>({});
    const parentCode = ref('');
    const defaultBtn = [{ title: '编辑', onClick: (row: any) => onEdit(row) }];
    const operateColumn = ref<TpfColumnType>({
        title: '操作',
        align: 'center',
        width: 100,
        fixed: 'right',
        customRender: (...args) => withTpfTableOperateColumn(...args)(defaultBtn)
    });

    const { treeData, fetchApi, treeLoading } = queryMenuTreeSelect();

    const currentSelectTree = ref();

    const { tableInfo, pagination, getDataList, selectedRowInfo } = useAntdTable({
        api: async pagination => {
            const { pageSize = 20, current = 1 } = unref(pagination);
            const res = await menuApi.querySysMenuListByPage({
                ...unref(searchInfo),
                parentCode: parentCode.value,
                pageSize,
                page: current
            });
            return res.data.object;
        },
        rowKey: 'id',
        isPageAble: true,
        hasRowSelection: true
    });

    const selectTree = (select: any) => {
        currentSelectTree.value = select ? select : '';
        parentCode.value = select ? select.id : '';
        getDataList();
    };

    // 新增
    const onAdd = () => {
        onOpenModal('add', unref(currentSelectTree));
        getDataList();
    };

    const submitAdd = async (v: any) => {
        await menuApi.addSysMenu(v);
        message.success('添加成功！');
        getDataList();
        await fetchApi();
        onOpenModal('close');

        const arr = [];
        arr.push(getId(unref(treeData), v.menuName));
        selectedKeysArr.value = arr as any;
        const allParentId = searchParent(unref(treeData), v.menuName);
        groupTree.value.onExpand(allParentId);
    };

    const searchParent = (list: any, name: string) => {
        let t = [];
        for (let i = 0; i < list.length; i++) {
            const e = list[i];
            if (e.label === name) {
                //若查询到对应的节点，则直接返回
                t.push(e.id);
                break;
            } else if (e.children && e.children.length !== 0) {
                //判断是否还有子节点，若有对子节点进行循环调用
                const p: any = searchParent(e.children, name);
                //若p的长度不为0，则说明子节点在该节点的children内，记录此节点，并终止循环
                if (p.length !== 0) {
                    p.unshift(e.id);
                    t = p;
                    break;
                }
            }
        }
        return t;
    };

    const getId = (list: any, name: string) => {
        for (const i in list) {
            const item = list[i];
            if (item.label === name) {
                return item.id;
            } else {
                //查不到继续遍历
                if (item.children) {
                    const value = getId(item.children, name) as any;
                    //查询到直接返回
                    if (value) {
                        return value;
                    }
                }
            }
        }
    };

    //编辑
    const onEdit = (v: any) => {
        if (v.value.isDefault === 1) {
            return message.warning('默认菜单不可编辑');
        }
        onOpenModal('edit', v.value);
    };

    const submitUpdata = async (v: any) => {
        await menuApi.editSysMenu(v);
        message.success('编辑成功！');
        getDataList();
        fetchApi();
        onOpenModal('close');

        const arr = [];
        arr.push(getId(unref(treeData), v.menuName));
        selectedKeysArr.value = arr as any;
        const allParentId = searchParent(unref(treeData), v.menuName);
        groupTree.value.onExpand(allParentId);
    };

    const onSubmit = (val: any) => {
        searchInfo.value = unref(val);
        unref(pagination).current = 1;
        getDataList();
    };

    const onDelete = async () => {
        const arr: Array<number> = [];
        let hasDefault = false;

        unref(selectedRowInfo).selectedRows.forEach((item: any) => {
            if (item.isDefault === 1) {
                hasDefault = true;
            }
            arr.push(item.id);
        });
        if (hasDefault) {
            return message.warning('默认菜单不可删除');
        }
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定是否删除该数据?' });
        const params = {
            ids: arr
        };
        const res = await menuApi.deleteSysMenuByIds(params);
        if (res.data.list.length === 0) {
            message.success('删除成功');
        } else {
            openDelModalDom(res.data.list);
        }

        getDataList();
        fetchApi();
    };

    const beforeRender = (list: TpfColumnType[]) => {
        unref(tableInfo).loading = true;
        const res = unref(list).map(item => {
            if (item.dataIndex === 'menuType') {
                item.customRender = ({ text }) => getLabel(text, menuType);
            }
            if (item.dataIndex === 'platform') {
                item.customRender = ({ text }) => getLabel(text, TREEACE_TYPE);
            }
            if (item.dataIndex === 'industry') {
                item.customRender = ({ text }) => getLabel(text, TRADE);
            }
            if (item.dataIndex === 'isEnable') {
                item.customRender = ({ text }) => getLabel(text, isStart);
            }
            if (item.dataIndex === 'createDatetime' || item.dataIndex === 'modifyDatetime') {
                item.customRender = ({ text }) => {
                    return dayjs(text).format('YYYY-MM-DD');
                };
            }
            return item;
        });
        unref(tableInfo).loading = false;

        return res;
    };

    watch(
        () => treeData.value,
        val => {
            if (val.length) {
                parentCode.value = unref(treeData)[0].id;
                currentSelectTree.value = unref(treeData)[0];
                selectedKeysArr.value = [unref(treeData)[0].id as never];
                getDataList();
            }
        },
        {
            deep: true,
            immediate: true
        }
    );
</script>

<style lang="less" scoped>
    .menu {
        padding: 10px 12px 12px;
        height: 100%;
        background-color: #f7f8fa;
        box-sizing: border-box;
    }
</style>
