import { notification } from 'ant-design-vue';
import { useRouteBase64 } from '@/hooks';
// 路由
import router from '@/router';
export const openNotification = (item: any[]) => {
    // 加密参数
    const { encodeParams } = useRouteBase64();
    const getDetail = (sendDetailNo: string) => {
        router.push({
            path: '/systemManage/messageManageme/stationMessageDetail',
            query: encodeParams({ sendDetailNo: sendDetailNo })
        });
    };
    item.forEach((item, index) => {
        notification.open({
            message: item.templateTitle,
            description: item.sendInfo,
            duration: 2,
            onClick: () => getDetail(item.sendDetailNo)
        });
    });
};
