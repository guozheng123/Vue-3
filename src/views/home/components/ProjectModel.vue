<template>
    <div>
        <TpfModal v-model:visible="visible" height="300px" width="700px">
            <template #title>
                <div class="title"
                    ><div>
                        <div class="header-title">项目总览 </div>
                    </div>
                    <div>
                        <div class="title2">
                            <div>日</div>
                            <div>周</div>
                            <div class="month">月</div>
                            <div>年</div>
                        </div>
                    </div>
                    <div> </div>
                </div>
            </template>

            <a-table :pagination="false" :dataSource="dataSource" :columns="columns" />
        </TpfModal>
    </div>
</template>

<script setup lang="ts">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';

    const [visible, setVisible] = useRef(false);

    const dataSource = [
        {
            key: '1',
            name: 'PJ_01',
            age: '2023-3-13',
            status: '采购',
            int: '50%',
            address111: '100W',
            address2: 'P01'
        },
        {
            key: '2',
            name: 'PJ_02',
            age: '2023-3-14',
            status: '生产',
            int: '70%',
            address111: '130W',
            address2: 'P02'
        },
        {
            key: '3',
            name: 'PJ_03',
            age: '2023-3-15',
            status: '关闭',
            int: '80%',
            address111: '130W',
            address2: 'P03'
        },
        {
            key: '4',
            name: 'PJ_04',
            age: '2023-3-16',
            status: '生产',
            int: '70%',
            address111: '130W',
            address2: 'P04'
        },
        {
            key: '5',
            name: 'PJ_05',
            age: '2023-3-17',
            status: '关闭',
            int: '90%',
            address111: '130W',
            address2: 'P05'
        }
    ];

    const columns = [
        {
            title: '项目',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '立项',
            dataIndex: 'age',
            key: 'age'
        },
        {
            title: '产品',
            dataIndex: 'address2',
            key: 'address2'
        },

        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: '进度',
            dataIndex: 'int',
            key: 'int'
        },
        {
            title: '成本',
            dataIndex: 'address111',
            key: 'address111'
        }
    ];
    const open = async () => {
        setVisible(!visible.value);
    };
    defineExpose({ open });
</script>

<style scoped lang="less">
    .title {
        display: flex;

        .title2 {
            width: 100px;
            display: flex;
            margin: 0 auto;
            color: white;

            div {
                flex: 1;
                text-align: center;
                width: 40px;
                height: 32px;
                opacity: 1;
                border: 1px solid #eee;
                line-height: 32px;
            }

            .month {
                background-color: var(--ant-primary-color);
            }
        }

        .header-title {
            color: #1d2129;
            font-size: 16px;
            position: relative;
            padding-left: 16px;
            line-height: 24px;
            font-weight: 500;

            &::before {
                position: absolute;
                left: 0;
                top: 50%;
                content: '';
                height: 20px;
                width: 4px;
                transform: translateY(-50%);
                background-color: var(--ant-primary-color);
            }
        }

        div {
            flex: 1;
        }
    }
</style>
