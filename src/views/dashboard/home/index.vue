<template>
    <div class="gutter-example" id="printBox">
        <a-button @click="onPrintBox">打印onPrintBox</a-button>
        <div class="tree-position">
            <TpfOperateTree
                :treeData="list.data.list"
                :fieldNames="{
                    children: 'children',
                    title: 'label',
                    key: 'id',
                    rootCode: 'id'
                }"
            />
        </div>

        <a-row type="flex">
            <a-col v-for="item in 2" :span="6" :key="item">
                <div class="content">
                    <div class="top">
                        <div class="left zi">ECN数据 </div>
                        <div class="right">
                            <span class="zi2">20 </span>
                            <span>/50项</span>
                        </div>
                    </div>

                    <div class="bottom">
                        <div class="left zi"> <insert-row-above-outlined /> </div>
                        <div class="right"> <span>日同比 12.9%</span><shrink-outlined /> </div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <a-space>
            <a-cascader v-model:value="selectValue" :options="regionData" v-bind="$attrs" />

            <a-button type="primary" @click="test01('getTest1')">测试axios-01-401</a-button>
            <a-button type="primary" @click="test01('getTest2')"> 测试axios-02-429 </a-button>
            <a-button type="primary" @click="test01('getTestList')">
                当前国际化--{{ locale }}
            </a-button>
        </a-space>
        <TpfCollapse v-for="item in 3" :key="item" :title="item + ''">
            <a-space>
                <a-cascader v-model:value="selectValue" :options="regionData" v-bind="$attrs" />

                <a-button type="primary" @click="test01('getTest1')">测试axios-01-401</a-button>
                <a-button type="primary" @click="test01('getTest2')"> 测试axios-02-429 </a-button>
                <a-button type="primary" @click="test01('getTestList')">
                    当前国际化--{{ locale }}
                </a-button>
            </a-space>
        </TpfCollapse>
        <a-space v-for="item in 2" :key="item">
            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
                :options="{
                    color: {
                        dark: '#ff0000',
                        light: '#fff'
                    }
                }"
            />
            <TpfQrcode
                text="123"
                logo="https://img0.baidu.com/it/u=981218435,2998857702&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1677603600&t=455d091ed3eb38bf61a72df4b1285a9d"
            />
            <TpfQrcode text="123" />
        </a-space>
    </div>
</template>

<script setup lang="ts">
    import { ShrinkOutlined, InsertRowAboveOutlined } from '@ant-design/icons-vue';
    import http from '@/utils/http';
    import { useStore } from '@/store/index';
    import { storeToRefs } from 'pinia';
    import { regionData } from 'element-china-area-data';
    import { ref } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import printJS from 'print-js';

    import TpfQrcode from '@/components/TpfQrcode/index.vue';
    import TpfOperateTree from '@/components/TpfOperateTree/index.vue';
    import list from './res.json';

    const onPrintBox = async () => {
        printJS('printBox', 'html');
        // (document.querySelector('#printBox') as HTMLElement).style.display = 'none';
        // printJS({
        //     printable: 'printBox', //打印区域id
        //     type: 'html' //打印类型
        // });
        //获取打印内容后隐藏dom
        // (document.querySelector('#printBox') as HTMLElement).style.display = 'block';
    };

    const { localeStore } = useStore();
    const { locale } = storeToRefs(localeStore);

    const test01 = async (str: string) => {
        const res = await http.get<{ name: string }>(`/api/tmgc2-org/org/${str}`);
        console.log(' res.data', res.data);
    };

    const selectValue = ref<string[]>([]);
</script>

<style lang="less" scoped>
    .gutter-example :deep(.ant-row > div) {
        border: 0;
        height: 130px;
        background: #fff;
        border-radius: 8px 8px 8px 8px;
        opacity: 1;
        margin: 0 8px 0 8px;
    }

    .content {
        height: 130px;
        width: 100%;
        cursor: pointer;

        .zi {
            font-size: 16px;
            font-weight: 500;
            color: #000;
            line-height: 24px;
        }

        .zi2 {
            font-size: 20px !important;
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
                margin-right: 40px;
            }
        }
    }

    .sidebar {
        position: fixed;
        z-index: 88;
        right: 20px;
        bottom: 23%;
        padding: 14px 12px 0;
        // box-shadow: 0 4px 38px 0 rgba(255, 96, 115, 0.2);
        border-radius: 20px 0 0 20px;
        // background-color: #45ccbd;
    }

    .sidebar > div {
        cursor: pointer;
        text-align: center;
    }

    .sidebar > div img {
        display: inline;
        width: 100px;
        height: 100px;
        margin-left: 20px;
    }

    .sidebar > div .code {
        display: none;
        position: absolute;
        z-index: 9;
        top: -50%;
        right: 90px;
        border-radius: 8px;
        // box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 0.22);
        // background-color: #fff;
    }

    .sidebar > div .code::after {
        position: absolute;
        top: 33%;
        left: 100%;
        content: '';
        transform: translateY(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent #fff;
    }

    .sidebar-wechat:hover .code {
        display: flex;
    }

    .tree-position {
        background-color: #ccc;
        height: 500px;
        width: 300px;
        overflow: auto;
    }
</style>
