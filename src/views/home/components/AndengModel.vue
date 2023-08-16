<template>
    <div>
        <TpfModal v-model:visible="visible" height="400px" width="700px">
            <template #title>
                <div class="title"
                    ><div>
                        <div class="header-title">安灯记录 </div>
                    </div>
                    <div>
                        <div class="title2">
                            <div>日</div>
                            <div class="month">月</div>
                            <div>年</div>
                        </div>
                    </div>
                    <div> </div>
                </div>
            </template>

            <div style="height: 380px" class="echars" id="echars" ref="target"></div>
        </TpfModal>
    </div>
</template>

<script setup lang="ts" name="AddModel">
    import TpfModal from '@/components/TpfModal/index.vue';
    // import * as echarts from 'echarts';
    import { useRef, useChart } from '@/hooks';
    import { nextTick } from 'vue';
    const { target, setOption } = useChart();

    const [visible, setVisible] = useRef(false);

    const open = async () => {
        setVisible(!visible.value);
        await nextTick();
        // const myChart = echarts.init(document.getElementById('echars') as any);
        // 绘制图表
        setOption({
            legend: {
                data: ['安灯件数', '关闭件数'],
                top: 'bottom',
                itemHeight: 15,
                itemWidth: 15
            },

            title: {
                subtext: '安灯记录'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['3月1日', '3月2日', '3月3日', '3月4日', '3月5日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '安灯件数',
                    data: [5, 6, 7, 8, 9],
                    type: 'bar'
                    // showBackground: true,
                    // backgroundStyle: {
                    //     color: 'rgba(180, 180, 180, 0.2)'
                    // }
                },
                {
                    name: '关闭件数',
                    data: [2, 3, 4, 5, 6],
                    type: 'bar'
                    // showBackground: true,
                    // backgroundStyle: {
                    //     color: 'rgba(180, 180, 180, 0.2)'
                    // }
                }
            ]
        });
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
                color: white;
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
