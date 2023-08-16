<template> <VNode /> </template>

<script setup lang="tsx" name="TpfInput">
    import { Input } from 'ant-design-vue';
    import { useAttrs, useSlots } from 'vue';

    interface Props {
        showText?: boolean;
    }
    const props = withDefaults(defineProps<Props>(), {});
    const attrs = useAttrs();
    const slots = useSlots();

    const VNode = () => {
        if (props.showText) {
            return (
                <div class="line1 t-text-[#666]" title={attrs.value as string}>
                    {attrs.value}
                </div>
            );
        }
        return <Input {...attrs} v-slots={slots} />;
    };
</script>

<style lang="less" scoped></style>
