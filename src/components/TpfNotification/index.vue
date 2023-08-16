<script setup lang="tsx" name="TpfNotification">
    import { notification } from 'ant-design-vue';

    type Props = {
        treeData: any[];
    };
    const props = withDefaults(defineProps<Props>(), {});
    const openNotification = (item: any[]) => {
        for (let index = 0; index < item.length; index++) {
            notification.open({
                message: '[销售退货单审批]审批通过',
                description: () => {
                    return (
                        <div>
                            <div>您好,您有审批申请通过</div>
                            <div>单据名称:销售退货单 </div>
                            <div>单据编号:SR0202345678</div>
                        </div>
                    );
                },
                duration: 0
            });
        }
    };
    defineExpose({ openNotification });
</script>
