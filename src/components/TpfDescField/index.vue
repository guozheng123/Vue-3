<template>
    <TpfDescriptions
        v-noData="isEmpty(DIYFieldList)"
        :originalDate="originalDate"
        :renderList="DIYFieldList"
    />
</template>

<script setup lang="tsx" name="TpfDescField">
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import { getQueryPageFieldDiyListForInsertOrUpdate } from '@/api';
    import { PageCodeEnum } from '@/config';
    import { isEmpty } from 'lodash-es';
    import { computed, ref, unref } from 'vue';

    type Props = {
        diyFieldData?: Record<string, any>;
        pageCode: PageCodeEnum;
    };

    const props = withDefaults(defineProps<Props>(), {
        diyFieldData: () => ({})
    });

    const innerDiyFieldData = ref<Record<string, any>>({});

    const originalDate = computed(() => {
        return isEmpty(props.diyFieldData) ? unref(innerDiyFieldData) : props.diyFieldData;
    });

    const setDiyFieldData = (info: Record<string, any>) => {
        innerDiyFieldData.value = unref(info);
    };

    const { DIYFieldList } = getQueryPageFieldDiyListForInsertOrUpdate(props.pageCode as string);

    defineExpose({ setDiyFieldData });
</script>
