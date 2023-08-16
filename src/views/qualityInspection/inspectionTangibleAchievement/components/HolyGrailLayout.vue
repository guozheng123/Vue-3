<template>
    <div class="holy-grail-layout">
        <span class="top">上限{{ props.data[props.tableAttribute.top] }}</span>
        <span class="value">{{ props.data[props.tableAttribute.value] }}</span>
        <span class="down">下限 {{ props.data[props.tableAttribute.down] }}</span>
    </div>
</template>

<script lang="ts" setup>
    type Props = {
        data: any;
        tableAttribute: {
            top: string;
            value: string;
            down: string;
        };
    };
    const props = withDefaults(defineProps<Props>(), {
        data: () => ({}),
        tableAttribute: () => ({
            top: '',
            value: '',
            down: ''
        })
    });
</script>

<style lang="less" scoped>
    .holy-grail-layout {
        display: flex;
        height: 20px;

        .top,
        .down {
            color: #bfbfbf;
            transform: scale(0.7);
            align-self: flex-end;
            white-space: nowrap;
        }
    }
</style>
