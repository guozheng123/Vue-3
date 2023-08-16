<template>
    <TpfModal
        v-model:visible="visible"
        title="变更履历"
        height="350px"
        width="720px"
        :bodyStyle="{ padding: '18px' }"
    >
        <RevisionItem
            v-for="(row, inx) in bomInfoRevisionHistoryList"
            :key="inx"
            :row="row || []"
            :index="inx"
        />
        <template #footerRight>
            <a-button class="tpf-button" @click="close">关闭</a-button>
        </template>
    </TpfModal>
</template>

<script setup lang="tsx">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';
    import RevisionItem from './RevisionItem.vue';
    import { useBomInfoApi } from '@/api';
    import { ref } from 'vue';

    const props = defineProps<{
        bomType: string;
    }>();

    const bomInfo = useBomInfoApi();

    const [visible, setVisible] = useRef(false);

    const close = () => {
        setVisible(false);
    };
    type HistoryList = Awaited<
        ReturnType<typeof bomInfo.getBomInfoRevisionHistory>
    >['data']['list'];

    const bomInfoRevisionHistoryList = ref<HistoryList>([]);

    const getBomInfoRevisionHistory = async (bomId: string) => {
        bomInfoRevisionHistoryList.value = [];
        if (!bomId) return;
        if (!props.bomType) return;
        bomInfoRevisionHistoryList.value = await bomInfo
            .getBomInfoRevisionHistory({ bomId, bomType: props.bomType })
            .then(res => res.data.list);
    };
    const open = (row: any) => {
        setVisible(true);
        getBomInfoRevisionHistory(row.bomId);
    };
    defineExpose({ open });
</script>

<style lang="less" scoped></style>
