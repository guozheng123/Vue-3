<template>
    <a-popconfirm prefixCls="message_title" trigger="click" placement="bottom" :showCancel="false">
        <template #title>
            <a-card class="message_popconfirm" style="width: 300px">
                <div class="header-title">
                    <span>未读消息</span>
                    <span>已读消息</span>
                </div>
                <div class="box" v-for="item in messageList" :key="item.sendDetailNo">
                    <p class="title">{{ item.sendInfo }}</p>
                    <div class="one" @click="getDetail(item.sendDetailNo)">
                        <div class="content">{{ item.templateTitle }}</div>
                        <div class="time">{{ item.dateTimeDesc }}</div>
                    </div>
                </div>
            </a-card>
        </template>
        <template #okButton>
            <div class="showAll" @click="viewAll">查看全部</div>
        </template>

        <a-badge :count="counts">
            <a-tooltip placement="bottom" color="black">
                <SvgIcon type="icon-xiaoxi" size="24" shadow />
            </a-tooltip>
        </a-badge>
    </a-popconfirm>
</template>

<script setup lang="tsx" name="mail">
    import { ref, onUnmounted, onMounted } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { openNotification } from '@/utils/notification';
    import { useMessageApi } from '@/api';
    import { useRouteBase64 } from '@/hooks';
    // 路由
    import router from '@/router';
    // 加密参数
    const { encodeParams } = useRouteBase64();

    const messageList = ref<any[]>([]);
    const unreadList = ref<any[]>([]);

    const counts = ref(0);
    const time = setInterval(() => {
        openNotification(unreadList.value);
    }, 60 * 1000);

    onUnmounted(() => {
        clearInterval(time);
    });
    const messageApi = useMessageApi();

    const getMessageList = async () => {
        try {
            const res = await messageApi.unread();
            messageList.value = res.data.object.list;
        } catch (error) {
            console.log(error);
        }
    };
    const getUnreadList = async () => {
        try {
            const res = await messageApi.unread2();
            unreadList.value = res.data.object.list;
        } catch (error) {
            console.log(error);
        }
    };

    const getCount = async () => {
        try {
            const { data } = await messageApi.countUnread();
            counts.value = data.value;
            console.log(counts, 'res', data.value);
        } catch (error) {
            console.log(error);
        }
    };

    // 点击消息跳转详情
    const getDetail = (value: any) => {
        router.push({
            path: '/systemManage/messageManageme/stationMessageDetail',
            query: encodeParams({ sendDetailNo: value })
        });
    };

    const viewAll = () => {
        if (router.currentRoute.value.path !== '/systemManage/messageManageme/messageMail') {
            router.push('/systemManage/messageManageme/messageMail');
        }
    };

    onMounted(() => {
        getMessageList();
        getCount();
        getUnreadList();
    });
</script>

<style lang="less" scoped>
    :deep(.message_popconfirm) {
        .ant-card-head {
            height: 40px !important;
        }
    }

    .showAll {
        height: 30px;
    }

    .showAll:hover {
        cursor: pointer;
    }

    .count {
        width: 62px;
    }

    .header-title {
        height: 30px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e8e8e8;
        font-size: 10px;

        span:nth-child(1) {
            color: #000;
        }

        span:nth-child(2) {
            color: #777;
        }
    }

    .box {
        padding: 5px 0 10px 0;
    }

    :deep(.ant-card-head) {
        min-height: 40px !important;
        padding: 0 10px;

        .ant-card-head-wrapper {
            .ant-card-head-title {
                font-size: 10px;
                padding: 10 !important;
                color: #333;
                cursor: pointer;
            }

            .ant-card-extra {
                font-size: 10px;
                padding: 10 !important;
                color: #999;
                cursor: pointer;
            }
        }
    }

    :deep(.ant-card-body) {
        padding: 10px !important;

        .title {
            font-size: 10px;
            font-family: Abel-Regular, sans-serif;
            font-weight: 800;
            color: #333;
        }

        .one {
            display: flex;

            .content {
                font-size: 8px;
                font-family: Abel-Regular, sans-serif;
                font-weight: 800;
                color: #999;
                flex: 7;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .time {
                padding-left: 25px;
            }
        }
    }
</style>
