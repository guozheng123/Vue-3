<template>
    <div class="gutter-example">
        <a-card style="width: 100%; height: 44px">
            <a-space size="small">
                <SvgIcon
                    @click="back()"
                    type="icon-shangyiyehoutuifanhui-xianxingyuankuang"
                    size="24"
                    cursor
                    shadow
                    style="color: #1d2129"
                /><div class="title_name">岗位看板</div>

                <div class="title_name1">产品：项目/设备/模块</div>
                <div class="title_name1">组织：安装调试车间/装配班/安装岗</div>
            </a-space>
            <div class="right_title">2023-4-6 星期四</div>
        </a-card>

        <div class="main">
            <div style="flex: 6">
                <div class="content">
                    <div class="title" id="title">
                        <div class="header-title">车间布局图</div>
                    </div>
                    <div class="img_1">
                        <img width="100%" height="100%" src="~@/assets/images/wps.jpg" alt="" />
                    </div>
                </div>

                <div class="content2" style="margin-top: 20px">
                    <div class="title" id="title">
                        <div class="header-title">执行情况</div>
                    </div>
                    <div style="margin-top: 20px" class="aaa">
                        <a-table
                            :pagination="false"
                            :columns="columns4"
                            :data-source="data4"
                            bordered
                            size="small"
                        >
                            <template #headerCell="{ column }">
                                <template
                                    v-if="
                                        column.key === 'b' ||
                                        column.key === 'c' ||
                                        column.key === 'd' ||
                                        column.key === 'e' ||
                                        column.key === 'f' ||
                                        column.key === 'g'
                                    "
                                >
                                    <a style="text-decoration: underline"> {{ column.title }} </a>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>

                <div class="content2" style="margin-top: 20px">
                    <div class="title" id="title">
                        <div class="header-title">进度与反馈</div>

                        <a-timeline style="margin: 30px 0 0 20px">
                            <a-timeline-item color="red">
                                <p style="color: #000; font-weight: 500">今天 23:24</p>
                                <p>现场一楼中转到二楼受限客户中转平台 每天只能两车</p>
                            </a-timeline-item>
                            <a-timeline-item color="red">
                                <p style="color: #000; font-weight: 500">今天 23:24</p>
                                <p>客户二层平台钢盘多，打孔效率慢，占30%以上的孔需要用水钻</p>
                            </a-timeline-item>
                            <a-timeline-item color="green">
                                <p style="color: #b0b4b7; font-weight: 400">2023-02-08 22:30:00</p>
                                <p style="color: #b0b4b7; font-weight: 400"
                                    >1、客户机器人中转需要跨厂区，由我们完成，距离2公里
                                    2、现场一楼中转到二楼受限客户中转平台 每天只能两车</p
                                >
                            </a-timeline-item>
                        </a-timeline>
                    </div>
                </div>
            </div>

            <div class="right" style="flex: 4; margin-left: 20px">
                <div class="content_title">
                    <div class="top">
                        <div class="con1">
                            <div class="img2">
                                <img src="~@/assets/images/ellipse20@2x.jpg" alt="" />
                            </div>
                            <div class="detail">
                                <div class="name">张三</div>
                                <div class="post">岗位负责人</div>
                            </div>

                            <div class="num">79.1%</div>
                            <div class="text">完成进度</div>
                        </div>
                    </div>

                    <div class="top">
                        <div class="con1">
                            <div class="img2">
                                <img src="~@/assets/images/ellipse21@2x.jpg" alt="" />
                            </div>
                            <div class="detail">
                                <div class="name">李斯</div>
                                <div class="post">直接主管</div>
                            </div>

                            <div class="num">42987</div>
                            <div class="text">交期剩/期</div>
                        </div>
                    </div>

                    <div class="con2">
                        <div class="num">89%</div>
                        <div class="text">工时有效率</div>
                    </div>
                </div>

                <div class="content2" style="margin-top: 20px">
                    <div class="title" id="title">
                        <div class="header-title">总任务清单</div>
                    </div>
                    <div style="margin-top: 20px">
                        <a-table
                            size="small"
                            :pagination="false"
                            :columns="columns"
                            :data-source="data"
                        >
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'status'">
                                    <a-badge
                                        :color="
                                            record.status === '已完成'
                                                ? ' #B0B4B7'
                                                : record.status === '未开始'
                                                ? ' red'
                                                : 'green'
                                        "
                                        :text="record.status"
                                    />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>

                <div class="content2" style="margin-top: 20px">
                    <div class="title" id="title">
                        <div class="header-title">日任务清单</div>
                    </div>
                    <div style="margin-top: 20px">
                        <a-table
                            size="small"
                            :pagination="false"
                            :columns="columns1"
                            :data-source="data1"
                        >
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'status'">
                                    <a-badge
                                        :color="
                                            record.status === '已完成'
                                                ? ' #B0B4B7'
                                                : record.status === '未开始'
                                                ? ' red'
                                                : 'green'
                                        "
                                        :text="record.status"
                                    />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>

                <div class="content3" style="margin-top: 20px">
                    <div class="title" id="title">
                        <div class="header-title">车间设备清单 </div>
                    </div>
                    <div style="margin-top: 20px; border-radius: 8px">
                        <a-table
                            size="small"
                            :pagination="false"
                            :columns="columns3"
                            :data-source="data3"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const back = () => {
        router.go(-1);
    };

    const columns4 = [
        {
            title: '',
            dataIndex: 'k',
            key: 'k'
        },
        {
            title: '开始时间',
            dataIndex: 'time',
            key: 'time'
        },
        {
            title: '结束时间',
            dataIndex: 'endtime',
            key: 'endtime'
        },
        {
            title: '交期',
            dataIndex: 'a',
            key: 'a'
        },
        {
            title: '工步1',
            children: [
                {
                    title: '底座落位',
                    dataIndex: 'b',
                    key: 'b'
                }
            ]
        },
        {
            title: '工步2',
            children: [
                {
                    title: '机器人底座',
                    dataIndex: 'c',
                    key: 'c'
                }
            ]
        },
        {
            title: '工步3',
            children: [
                {
                    title: '抓手落位',
                    dataIndex: 'd',
                    key: 'd'
                }
            ]
        },
        {
            title: '工步4',
            children: [
                {
                    title: '焊枪落位',
                    dataIndex: 'e',
                    key: 'e'
                }
            ]
        },
        {
            title: '工步5',
            children: [
                {
                    title: '转台类',
                    dataIndex: 'f',
                    key: 'f'
                }
            ]
        },
        {
            title: '工步6',
            children: [
                {
                    title: '夹具类',
                    dataIndex: 'g',
                    key: 'g'
                }
            ]
        },
        {
            title: '合计',
            dataIndex: 'all',
            key: 'all'
        }
    ];
    const data4 = [
        {
            time: '2023/2/24',
            endtime: '2023/3/20',
            a: '25',
            b: '65',
            c: '39',
            d: '32',
            e: '40',
            f: '50',
            g: '64',
            k: '计划',
            all: '300'
        },
        {
            time: '2023/2/24',
            endtime: '2023/3/20',
            a: '30',
            b: '80',
            c: '56',
            d: '',
            e: '',
            f: '',
            k: '实际',
            all: '136'
        },
        {
            time: '2023/2/24',
            endtime: '2023/3/20',
            a: '-5',
            b: '123%',
            c: '140%',
            d: '',
            e: '',
            f: '',

            k: '差异%',
            all: '45%'
        }
    ];

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: '序号'
        },
        {
            title: '产品',
            dataIndex: 'age',
            key: '产品'
        },
        {
            title: '数量',
            dataIndex: 'num',
            key: '数量'
        },
        {
            title: '计划工时(H)',
            key: '计划工时(H)',
            dataIndex: 'planTime'
        },
        {
            title: '计划开始日期',
            key: '计划开始日期',
            dataIndex: 'planDate'
        },
        {
            title: '计划结束日期',
            key: '计划结束日期',
            dataIndex: 'planEndDate'
        },
        {
            title: '任务状态',
            key: 'status',
            dataIndex: 'status'
        }
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: '扯铝壳组件',
            address: 'New York No. 1 Lake Park',
            num: 1,
            planTime: 199.5,
            planDate: '2023/2/24',
            planEndDate: '2023/2/24',
            status: '已完成'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: '扯铝壳组件',
            address: 'London No. 1 Lake Park',
            num: 1,
            planTime: 199.5,
            planDate: '2023/2/24',
            planEndDate: '2023/2/24',
            status: '已进行'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: '扯铝壳组件',
            address: 'Sidney No. 1 Lake Park',
            num: 1,
            planTime: 199.5,
            planDate: '2023/2/24',
            planEndDate: '2023/2/24',
            status: '未开始'
        },
        {
            key: '4',
            name: 'Joe Black',
            age: '扯铝壳组件',
            address: 'Sidney No. 1 Lake Park',
            num: 1,
            planTime: 199.5,
            planDate: '2023/2/24',
            planEndDate: '2023/2/24',
            status: '已完成'
        }
    ];

    const columns1 = [
        {
            title: '序号',
            dataIndex: 'key',
            key: '序号'
        },
        {
            title: '设备遍号',
            dataIndex: 'age',
            key: '设备遍号'
        },
        {
            title: '数量',
            dataIndex: 'num',
            key: '数量'
        },
        {
            title: '计划工时(min)',
            key: '计划工时(min)',
            dataIndex: 'planTime'
        },
        {
            title: '计划开始日期',
            key: '计划开始日期',
            dataIndex: 'planDate'
        },
        {
            title: '计划结束日期',
            key: '计划结束日期',
            dataIndex: 'planEndDate'
        },
        {
            title: '任务状态',
            key: 'status',
            dataIndex: 'status'
        }
    ];

    const data1 = [
        {
            key: '1',
            name: 'John Brown',
            age: '机器人',
            address: 'New York No. 1 Lake Park',
            num: 1,
            planTime: 120,
            planDate: '8:15',
            planEndDate: '10:30',
            status: '已完成'
        },
        {
            key: '2',
            name: 'Jim Green',
            age: '抓手',
            address: 'London No. 1 Lake Park',
            num: 1,
            planTime: 120,
            planDate: '8:15',
            planEndDate: '10:30',
            status: '已进行'
        },
        {
            key: '3',
            name: 'Joe Black',
            age: '焊枪',
            address: 'Sidney No. 1 Lake Park',
            num: 1,
            planTime: 120,
            planDate: '8:15',
            planEndDate: '10:30',
            status: '未开始'
        },
        {
            key: '4',
            name: 'Joe Black',
            age: '支架',
            address: 'Sidney No. 1 Lake Park',
            num: 1,
            planTime: 120,
            planDate: '8:15',
            planEndDate: '10:30',
            status: '已完成'
        }
    ];

    const columns3 = [
        {
            title: '类型',
            dataIndex: 'type',
            key: '1'
        },
        {
            title: ' 数量',
            dataIndex: 'num',
            key: '2'
        }
    ];

    const data3 = [
        {
            type: '机器人底座',
            num: '13',
            key: '1'
        },
        {
            type: '机器人',
            num: '13',
            key: '2'
        },
        {
            type: '抓手',
            num: '5',
            key: '3'
        },
        {
            type: '焊枪',
            num: '2',
            key: '4'
        },
        {
            type: '家具',
            num: '5',
            key: '4'
        }
    ];
</script>

<style lang="less" scoped>
    .gutter-example {
        .content {
            height: 492px;

            .img_1 {
                height: 448px;
                width: 100%;
                margin-top: 20px;
                padding: 0 10px 10px 10px;
            }
        }

        .content,
        .content2,
        .content3 {
            background-color: #fff;
            border-radius: 8px;

            .header-title {
                font-size: 16px;
                color: #000;
                position: relative;
                padding-left: 26px;
                line-height: 24px;
                font-weight: 500;
                top: 10px;

                &::before {
                    position: absolute;
                    left: 10px;
                    content: '';
                    top: 12px;
                    height: 20px;
                    width: 4px;
                    transform: translateY(-50%);
                    background-color: var(--ant-primary-color);
                }
            }
        }

        .content2 {
            height: 234px;
        }

        .content_title {
            height: 208px;
            background-color: #fff;
            display: inline-block;
            width: 100%;
            border-radius: 8px;

            .con2 {
                width: 45%;
                float: right;
                height: 100%;
                display: inline-block;
                background-image: url('@/assets/images/image22@2x.jpg');
                background-size: cover;
                position: relative;

                .num {
                    font-size: 24px;
                    font-weight: 500;
                    color: var(--ant-primary-color);
                    position: absolute;
                    bottom: 60px;
                }

                .text {
                    font-size: 14px;
                    font-weight: 400;
                    color: #4e5969;
                    position: absolute;
                    bottom: 20px;
                }
            }

            .top {
                width: 25%;
                height: 100%;
                display: inline-block;

                .con1 {
                    display: inline-block;
                    margin-left: 10px;
                    margin-top: 20px;
                    height: 100%;
                    width: 100%;
                    position: relative;

                    .img2 {
                        width: 48px;
                        height: 48px;
                        display: inline-block;
                        float: left;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .num {
                        font-size: 24px;
                        font-weight: 500;
                        color: var(--ant-primary-color);
                        position: absolute;
                        bottom: 80px;
                        margin-left: 20px;
                    }

                    .text {
                        font-size: 14px;
                        font-weight: 400;
                        color: #4e5969;
                        margin-left: 20px;
                        position: absolute;
                        bottom: 40px;
                    }

                    .detail {
                        display: inline-block;
                        height: 48px;
                        margin-left: 10px;

                        .name {
                            font-size: 16px;
                            font-weight: 400;
                            color: #1d2129;
                            padding: 5px;
                        }

                        .post {
                            font-size: 12px;
                            font-weight: 400;
                            color: #999;
                        }
                    }
                }
            }
        }

        .main {
            margin: 20px;
            display: flex;
        }
    }

    :deep(.ant-card-body) {
        padding: 8px 12px 8px 12px;

        .ant-space:nth-child(5) {
            float: right;
        }

        .title_name {
            color: #1d2129;
            font-size: 16px;
            padding-bottom: 4px;
        }

        .title_name1 {
            font-size: 14px;
            font-weight: 400;
            color: #999;
            padding-bottom: 4px;
            margin-left: 20px;
        }

        .right_title {
            float: right;
            right: 0;
            font-size: 14px;
            font-weight: 500;
            color: #1d2129;
        }

        .to_edit {
            float: right;
        }
    }

    .ant-timeline-item {
        padding-bottom: 10px !important;
    }

    .aaa {
        .ant-table-thead:nth-child(2) th {
            .ant-table-cell {
                color: rebeccapurple !important;
            }
        }
    }
</style>
