<template>
    <div>
        <div class="two">
            <div class="two1">
                <div class="content">
                    <div class="top">
                        <span class="left">我的工作台</span>
                        <div class="rignt_img">
                            <img
                                width="100%"
                                height="100%"
                                src="~@/assets/images/image20@2x.png"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="middle">
                        <span>岗位看板</span>
                        <span>我的任务</span>
                    </div>

                    <div class="bottom">
                        <div class="left"> </div>

                        <div class="right">
                            <div>角色：部装车间主管</div>

                            <div>岗位：主任</div>

                            <div @click="to"
                                >岗位看板 <SvgIcon class="icon" size="12" type="icon-Stroke" cursor
                            /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="two2" style="margin: 0 10px 0 20px">
                <div class="content content_title">
                    <div class="title" id="title">
                        <div class="header-title">项目总览</div>
                    </div>
                    <div class="time" id="title">
                        <a-row @click="open" type="flex">
                            <a-col :flex="2">日</a-col>
                            <a-col :flex="3">周</a-col>
                            <a-col :flex="2">月</a-col>
                            <a-col class="aaa" :flex="3">年</a-col>
                        </a-row>
                    </div>
                    <div class="echars" id="echars1" ref="target"></div>
                </div>
            </div>

            <div class="two3" style="margin: 0 20px 0 10px">
                <div class="content">
                    <img width="100%" height="100%" src="~@/assets/images/b.jpg" alt="" /> </div
            ></div>
        </div>
        <ProjectModel ref="model" />
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    // import * as echarts from 'echarts';
    import { onMounted, nextTick } from 'vue';
    import { useOpenAntdModal, useChart } from '@/hooks';
    import { useRouter } from 'vue-router';
    import ProjectModel from './ProjectModel.vue';

    const { target, setOption, showLoading } = useChart();

    const [model, openModel] = useOpenAntdModal();

    const router = useRouter();
    const to = () => {
        router.push('/home/postBoard');
    };

    const open = () => {
        openModel();
    };
    onMounted(async () => {
        //     //需要获取到element,所以是onMounted的Hook
        //     // const myChart = echarts.init(document.getElementById('echars1') as any);
        // 绘制图表
        await nextTick();
        showLoading();
        setTimeout(() => {
            setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '90%',
                    itemHeight: 15,
                    itemWidth: 15
                },
                series: [
                    {
                        labelLine: {
                            normal: {
                                length: '30'
                            }
                        },
                        name: '项目总览',
                        type: 'pie',
                        radius: ['60%', '45%'],
                        data: [
                            { value: 60, name: '完成' },
                            { value: 40, name: '执行' }
                        ],
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#fff',

                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    }
                ]
            });
        }, 1000);
    });
</script>

<style lang="less" scoped>
    .gutter-example {
        margin: 20px;

        .two {
            display: flex;
            margin-top: 20px;

            .content_title {
                display: inline-block;

                .title {
                    display: inline-block;
                }
            }

            .two1 {
                flex: 1;

                .top {
                    height: 110px;
                    background: linear-gradient(307deg, #eef4fa 0%, #ecf3ff 100%);
                    display: flex;
                    // display: inline-block;
                    // width: 100%;
                    .left {
                        line-height: 110px;
                        font-size: 18px;
                        font-weight: 600;
                        color: #000;
                        margin-left: 24px;
                        flex: 2;
                    }

                    .rignt_img {
                        display: inline-block;
                        height: 110px;
                        flex: 3;
                    }
                }

                .middle {
                    margin: 24px 0 0 24px;

                    span:nth-child(1) {
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 24px;
                        color: var(--ant-primary-color);
                    }

                    span:nth-child(2) {
                        font-size: 13px;
                        color: #b0b4b7;
                        line-height: 15px;
                        margin-left: 20px;
                    }
                }

                .bottom {
                    display: inline-block;
                    margin: 24px 0 0 24px;

                    .left {
                        display: inline-block;
                        width: 50px;
                        height: 50px;
                        background-image: url('@/assets/images/ellipse20@2x.jpg');
                        background-size: cover;
                    }

                    .right {
                        display: inline-block;
                        margin-left: 30px;
                        cursor: pointer;

                        div {
                            // line-height: 16px;
                            font-size: 14px;
                            color: #4e5969;
                            padding: 0 0 5px 0;
                        }

                        .icon {
                            color: var(--ant-primary-color);
                        }

                        div:nth-child(3) {
                            color: var(--ant-primary-color);
                        }
                    }
                }
            }

            .two2 {
                flex: 1;
                height: 40px;

                .echars {
                    height: 250px;
                    margin-top: 20px;
                    width: 100%;
                }

                .time {
                    float: right;
                    display: flex;
                    display: inline-block;
                    margin-top: 15px;

                    :deep(.ant-row) {
                        margin-right: 20px;

                        .ant-col {
                            border: 1px solid #eee;
                            height: 32px;
                            line-height: 32px;
                            width: 40px;
                            text-align: center;
                            font-size: 14px;
                            font-weight: 400;
                            color: #000;
                        }

                        .aaa {
                            background-color: var(--ant-primary-color);
                            color: white;
                        }
                    }
                }

                .title {
                    height: 40px;
                    display: inline-block;

                    // margin-top: 10px;
                    .header-title {
                        font-size: 16px;
                        color: #000;
                        position: relative;
                        padding-left: 26px;
                        line-height: 24px;
                        font-weight: 500;
                        top: 20px;

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
            }

            .two3 {
                flex: 2;
            }

            // div {
            //     flex: 1;
            //     border-radius: 8px 8px 8px 8px;
            //     opacity: 1;
            // }
            .content {
                width: 100%;
                height: 320px;
                background-color: #fff;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>
