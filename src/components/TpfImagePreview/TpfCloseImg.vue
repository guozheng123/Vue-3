<template>
    <div class="tpf-close-box" v-bind="$attrs">
        <slot></slot>

        <SvgIcon
            v-if="useClose"
            class="closeIcon"
            type="icon-guanbi2"
            :size="16"
            @click="onClick"
        />
    </div>
</template>

<script setup lang="tsx">
    type Props = {
        useClose?: boolean;
    };

    defineProps<Props>();
    const emit = defineEmits<{
        (e: 'clickDel'): void;
    }>();

    const onClick = () => {
        console.log(111);
        emit('clickDel');
    };
</script>

<style lang="less" scoped>
    .tpf-close-box {
        position: relative;
        height: 100%;
        width: 100%;
        .closeIcon {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(50%, -50%);
            color: rgba(50, 50, 51, 0.6);
        }
    }
</style>
