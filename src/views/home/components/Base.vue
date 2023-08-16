<template>
    <div>
        <EcnModel ref="ecnModel" />
        <AndengModel ref="andengModel" />
        <QuestionModel ref="qestionModel" />
        <ConnectionModel ref="connectionModel" />
        <div class="one">
            <div>
                <div class="content">
                    <div class="top">
                        <div class="left zi">ECN数据</div>
                        <div class="right">
                            <span class="zi2">2</span>
                            <span>/8项</span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left zi">
                            <SvgIcon @click="open1" size="35" type="icon-a-Frame13" cursor />
                        </div>
                        <div class="right">
                            <span>日同比 12.9%</span>

                            <SvgIcon size="15" type="icon-Vector" cursor />
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 0 10px 0 20px">
                <div class="content">
                    <div class="top">
                        <div class="left zi">安灯记录 </div>
                        <div class="right">
                            <span class="zi2">3</span>
                            <span>/9起</span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left zi">
                            <SvgIcon @click="open2" size="35" type="icon-a-Frame15" cursor />
                        </div>
                        <div class="right">
                            <span>日同比 12.9%</span>
                            <SvgIcon size="15" type="icon-Frame1" cursor />
                        </div>
                    </div> </div
            ></div>

            <div style="margin: 0 20px 0 10px">
                <div class="content">
                    <div class="top">
                        <div class="left zi">问题闭环 </div>
                        <div class="right">
                            <span class="zi2">4</span>
                            <span>/6起</span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left zi">
                            <SvgIcon @click="open3" size="35" type="icon-a-Frame475" cursor />
                        </div>
                        <div class="right">
                            <span>日同比 12.9%</span>
                            <SvgIcon size="15" type="icon-Vector" cursor />
                        </div>
                    </div> </div
            ></div>

            <div
                ><div class="content">
                    <div class="top">
                        <div class="left zi">客户履历 </div>
                        <div class="right">
                            <span class="zi2">5</span>
                            <span>/6件</span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left zi">
                            <SvgIcon @click="open4" size="35" type="icon-a-Frame476" cursor />
                        </div>
                        <div class="right">
                            <span>日同比 12.9%</span>
                            <SvgIcon size="15" type="icon-Frame1" cursor />
                        </div>
                    </div> </div
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '@/components/SvgIcon/index.vue';

    import EcnModel from './EcnModel.vue';
    import AndengModel from './AndengModel.vue';
    import QuestionModel from './QuestionModel.vue';
    import ConnectionModel from './ConnectionModel.vue';

    import { useOpenAntdModal } from '@/hooks';

    const [ecnModel, openEcnModel] = useOpenAntdModal();
    const [andengModel, openAndengModel] = useOpenAntdModal();
    const [qestionModel, openQuestionModel] = useOpenAntdModal();
    const [connectionModel, openConnectionModel] = useOpenAntdModal();

    const open1 = () => {
        openEcnModel();
    };

    const open2 = () => {
        openAndengModel();
    };
    const open3 = () => {
        openQuestionModel();
    };
    const open4 = () => {
        openConnectionModel();
    };
</script>

<style lang="less" scoped>
    .gutter-example {
        margin: 20px;

        .one {
            display: flex;

            div {
                flex: 1;
                border-radius: 8px 8px 8px 8px;
                opacity: 1;
            }

            .content {
                width: 100%;
                height: 130px;
                background-color: #fff;

                .zi {
                    font-size: 18px;
                    font-weight: 500;
                    color: #000;
                    line-height: 24px;
                }

                .zi2 {
                    font-size: 18px !important;
                    font-weight: 500;
                    color: #000;
                    line-height: 24px;
                }

                .top {
                    padding-top: 23px;
                    padding-bottom: 25px;
                    height: 20px;

                    .left {
                        float: left;
                        margin-left: 20px;
                    }

                    .right {
                        float: right;
                        margin-right: 40px;
                        // clear: both;
                    }
                }

                .bottom {
                    bottom: 30px;
                    // position: absolute;
                    margin-top: 30px;

                    .left {
                        float: left;
                        margin-left: 30px;
                    }

                    .right {
                        float: right;
                        margin: 10px 40px;
                    }
                }
            }
        }
    }
</style>
