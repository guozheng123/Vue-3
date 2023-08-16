<template> <VNode /> </template>

<script setup lang="tsx">
    import { AutoComplete, Input } from 'ant-design-vue';
    import { useSlots, useAttrs, ref, unref, watchEffect } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { debounce } from 'lodash-es';
    const slots = useSlots();
    const attrs = useAttrs();
    type Props = {
        value?: string;
        options?: Record<string, any>[];
        fieldNames?: Record<string, any>;
    };
    const props = withDefaults(defineProps<Props>(), {
        options: () => [],
        fieldNames: () => ({ label: 'label', value: 'value' })
    });

    const emit = defineEmits<{
        (e: 'update:value', val: any): void;
        (e: 'searchInput', val: any): void;
        (e: 'clickIcon'): void;
        (e: 'selectValue', row: Record<string, any>, val: any): void;
    }>();
    const iptValue = ref<any>(props.value);

    const oldValue = ref<any>('');
    const formatOptions = (list: Record<string, any>[] = []) => {
        if (list.length === 0) return list;
        return list.map(item => ({
            value: item[props.fieldNames.value],
            label: item[props.fieldNames.label]
        }));
    };

    const searchInput = debounce(() => {
        emit('searchInput', iptValue.value);
    }, 300);

    const getSelectRow = () => {
        return props.options.find(item => item[props.fieldNames.value] === iptValue.value) || {};
    };

    const handleSelectValue = () => {
        emit('selectValue', getSelectRow(), iptValue.value);
    };

    watchEffect(() => {
        iptValue.value = props.value;
        oldValue.value = props.value;
    });

    const VNode = () => {
        return (
            <AutoComplete
                v-slots={{ ...slots }}
                {...{
                    ...attrs,
                    'onUpdate:value': val => {
                        iptValue.value = val;
                    }
                }}
                value={iptValue.value}
                options={formatOptions(props.options)}
                onSelect={(val: any) => {
                    oldValue.value = val;
                    iptValue.value = val;
                    handleSelectValue();
                }}
                onBlur={() => {
                    if (!unref(iptValue) || !unref(iptValue).length) {
                        oldValue.value = '';
                        handleSelectValue();
                    }
                    iptValue.value = oldValue.value;
                    emit('update:value', iptValue.value);
                }}
            >
                <Input
                    onInput={() => {
                        searchInput();
                    }}
                    {...{ ...(attrs.inputProps || {}) }}
                    v-slots={{
                        ...(attrs.inputSlots || {}),
                        addonAfter: () => (
                            <SvgIcon
                                type="icon-sousuo"
                                size="16"
                                cursor
                                onClick={e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    emit('clickIcon');
                                }}
                            />
                        )
                    }}
                />
            </AutoComplete>
        );
    };
</script>

<style lang="less" scoped></style>
