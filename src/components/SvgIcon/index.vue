<template>
    <svg
        v-bind="$attrs"
        :class="['icon', shadow && 'svg-shadow', active && 'active', rotate && 'rotate']"
        aria-hidden
        :style="getStyle"
        @click="click"
    >
        <use :xlink:href="`#${type || iconClass}`" />
    </svg>
</template>

<script setup lang="ts">
    import { CSSProperties, computed } from 'vue';
    // import ids from 'virtual:svg-icons-names';
    // console.log('ids: ', ids);

    type Props = {
        iconClass?: string;
        size?: number | string; //大小
        type?: string; // icon名字
        cursor?: boolean; //显示小手
        shadow?: boolean; //鼠标移入阴影
        active?: boolean; //是否是当前选择
        move?: boolean; //鼠标移入拖拽
        activeBackGround?: string;
        hoverColor?: boolean;
        rotate?: boolean;
    };

    const props = withDefaults(defineProps<Props>(), {
        activeBackGround: '#e8e9e9',
        cursor: true
    });

    const emit = defineEmits<{
        (e: 'click', val: MouseEvent): void;
    }>();

    const click = (event: MouseEvent) => {
        emit('click', event);
    };

    const hoverShowColor = computed(() => {
        return props.hoverColor ? 'var(--ant-primary-color)' : '';
    });

    const getStyle = computed((): CSSProperties => {
        const { size, cursor, move } = props;
        const s = `${size}`.replace('px', '').concat('px');
        return {
            width: s,
            height: s,
            cursor: cursor ? 'pointer' : move ? 'move' : ''
        };
    });
</script>

<style lang="less" scoped>
    .icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
        overflow: hidden;
        border-radius: 4px;
        vertical-align: -0.2em;

        &:hover {
            color: v-bind('hoverShowColor');
        }

        &.active {
            background-color: v-bind('props.activeBackGround');
            border-radius: 4px;
        }

        &.rotate {
            transform: rotateZ(-180deg);
        }

        &.svg-shadow {
            &:hover {
                background-color: v-bind('props.activeBackGround');
                border-radius: 4px;
            }
        }
    }
</style>
