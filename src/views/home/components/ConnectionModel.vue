<template>
    <div>
        <TpfModal v-model:visible="visible" height="400px" width="700px">
            <template #title>
                <div class="title"
                    ><div>
                        <div class="header-title">客户履历 </div>
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
    import { useRef, useChart } from '@/hooks';
    const { target, setOption } = useChart();

    const [visible, setVisible] = useRef(false);

    const open = async () => {
        setVisible(!visible.value);
        // const myChart = echarts.init(document.getElementById('echars') as any);
        // 绘制图表
        setOption({
            title: {
                subtext: '起'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    type: 'line',
                    stack: 'Total',
                    data: [2, 4, 7, 2, 8]
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
