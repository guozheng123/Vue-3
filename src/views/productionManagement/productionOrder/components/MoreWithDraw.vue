<template>
    <TpfModal
        v-model:visible="visible"
        title="批量下达"
        class="moreWithDraw"
        height="200px"
        width="400px"
        v-bind="$attrs"
    >
        <a-space :size="10" direction="vertical">
            <div>本次共需下达{{ selectNum }}个订单 </div>
            <a-form-item label="车间">
                <a-select
                    style="width: 200px"
                    :options="workshopOptions"
                    v-model:value="workshopCode"
                />
            </a-form-item>
        </a-space>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="saveMoreWithDraw"> 保存 </a-button>
        </template>
    </TpfModal>
    <TpfDeleteDetail ref="delModalDom" v-if="showDelModalDom" />
</template>

<script setup lang="tsx" name="moreWithDraw">
    import { useProductionOrderApi, useWorkshopAPi } from '@/api';
    import TpfModal from '@/components/TpfModal/index.vue';
    import { ref, unref } from 'vue';
    import { isArray } from 'lodash-es';
    import type { DefaultOptionType } from 'ant-design-vue/es/select';
    import { useTpfDeleteDetail } from '@/components/TpfDeleteDetail';
    import { useRef } from '@/hooks';

    const { delModalDom, openDelModalDom, showDelModalDom, TpfDeleteDetail } = useTpfDeleteDetail();

    type Props = {
        selectNum?: number;
    };

    defineProps<Props>();

    const emit = defineEmits<{
        (e: 'updateTable'): void;
    }>();

    const productionOrderApi = useProductionOrderApi();

    const workshopAPi = useWorkshopAPi();

    const [visible, setVisible] = useRef(false);

    const currentProductionIds = ref<number[]>([]);

    const workshopCode = ref('');

    const workshopOptions = ref<DefaultOptionType[]>([]);

    const saveMoreWithDraw = async () => {
        await productionOrderApi.batchReleaseProductionOrder({
            ids: unref(currentProductionIds),
            workshopCode: unref(workshopCode)
        });
        const { message } = await import('ant-design-vue');
        message.success('批量下达成功');
        emit('updateTable');

        close();
    };

    const getWorkshopList = async (factoryCode: string) => {
        const workshopList = await workshopAPi.getWorkshopList({ factoryCode });
        workshopOptions.value = workshopList.data.list.map(item => ({
            ...item,
            value: item.workshopCode,
            label: item.workshopName
        }));
    };

    const open = async (ids: any[]) => {
        currentProductionIds.value = ids;
        const res = await productionOrderApi.batchReleaseOrderCheck({ ids });
        const [[factoryCode, list]] = Object.entries(res.data.object || {});
        //代码顺序不能改
        if (isArray(list) && list.length) {
            openDelModalDom(list);
            return;
        }

        await getWorkshopList(factoryCode);

        setVisible(true);
    };

    const close = () => {
        setVisible(false);
    };

    defineExpose({ open });
</script>

<style lang="less">
    .moreWithDraw {
        .ant-modal-body {
            .ant-form-item {
                justify-content: center;

                .ant-form-item-control {
                    flex-grow: unset;
                }
            }
        }
    }
</style>
