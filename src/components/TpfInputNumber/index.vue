<template><VNode /> </template>

<script setup lang="tsx">
    import { InputNumber } from 'ant-design-vue';
    import { useSlots, useAttrs, computed, unref } from 'vue';
    import { findListItem } from '@/utils';
    import { storeToRefs } from 'pinia';
    import { useStore } from '@/store';
    import type { ValueType } from 'ant-design-vue/es/input-number/src/utils/MiniDecimal';

    const { userStore } = useStore();

    const { sysParameterList } = storeToRefs(userStore);

    const decimalPlaces = computed(() => {
        const res = findListItem(unref(sysParameterList), 'parameterCode', 'decimalPlaces');
        return Number(res.defaultValue);
    });

    type Props = {
        value?: ValueType;
        fromSys?: boolean;
        max?: number;
        min?: number;
        precision?: number;
        disabled?: boolean;
    };

    const props = withDefaults(defineProps<Props>(), {
        value: '',
        precision: 2,
        fromSys: true,
        max: Number('999999999999999.9'), // js 目前支持这么大 不丢失精度
        min: -Number('999999999999999.9'),
        disabled: false
    });
    const precision = computed(() => {
        if (!props.fromSys) return props.precision;
        return unref(decimalPlaces);
    });

    // const fmtValue = computed(() => {
    //     if (precision.value === 0) return '0';
    //     const fmt = '0.' + Array.from({ length: precision.value }, () => '0').join('');
    //     return fmt;
    // });

    const emit = defineEmits<{
        (e: 'update:value', val: ValueType): void;
    }>();

    const modelValue = computed({
        get() {
            return props.value; //Number(props.value);
        },
        set(val: ValueType) {
            emit('update:value', val);
        }
    });

    const slots = useSlots();
    const attrs = useAttrs();

    const VNode = () => {
        return (
            <InputNumber
                max={props.max}
                min={props.min}
                disabled={props.disabled}
                controls={false}
                v-slots={slots}
                {...attrs}
                value={modelValue.value}
                onUpdate:value={val => {
                    if ([null, undefined].includes(val as any)) {
                        modelValue.value = '';
                        return;
                    }
                    if ([null, undefined, false].includes(precision.value as any)) {
                        modelValue.value = +val;
                    } else {
                        modelValue.value = +Number(val).toFixed(precision.value as number);
                    }
                }}
            />
        );
    };
</script>
