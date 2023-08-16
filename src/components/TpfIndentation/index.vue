<template>
    <div class="tpf-indentation">
        <Transition mode="out-in" appear name="sliderRL">
            <div
                class="indentation-left"
                v-if="showLeft"
                :style="{ width: hiddenMove ? width : leftWidth }"
                ref="moveLeft"
            >
                <slot name="left"></slot>
            </div>
        </Transition>
        <div
            v-if="!hiddenMove"
            class="indentation-icon"
            ref="moveDom"
            :style="{ cursor: showLeft ? 'ew-resize' : 'unset' }"
        >
            <SvgIcon
                class="shousuo"
                type="icon-shousuo"
                :class="[!showLeft && 'rotate']"
                cursor
                shadow
                :size="24"
                @click.prevent="toggleShow"
            />
        </div>
        <div class="indentation-right">
            <slot name="right"> </slot>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts" name="TpfIndentation">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, onMounted, unref } from 'vue';

    type Props = {
        width?: string;
        minWidth?: string;
        maxWidth?: string;
        hiddenMove?: boolean;
    };
    // 240 - 520

    const props = withDefaults(defineProps<Props>(), {
        width: '240px',
        minWidth: '240px',
        maxWidth: '520px'
    });
    const leftWidth = ref(props.width);

    const oldLeftWidth = ref(props.width);

    const moveDom = ref<HTMLElement | null>(null);
    const moveLeft = ref<HTMLElement | null>(null);

    const showLeft = ref(true);
    const toggleShow = () => {
        if (unref(showLeft)) {
            leftWidth.value = '0px';
        } else {
            leftWidth.value = oldLeftWidth.value;
        }

        showLeft.value = !showLeft.value;
    };

    const moveFn = () => {
        if (!unref(showLeft)) return;
        let left = '0px';
        let startX = 0;
        const el = unref(moveDom)!;
        const moveLeftDom = unref(moveLeft)!;

        const mousemove = (event: MouseEvent) => {
            const endX = event.pageX;
            let moveX = parseFloat(left) + (endX - startX);
            if (moveX <= parseFloat(props.minWidth)) {
                moveX = parseFloat(props.minWidth);
            }
            if (moveX >= parseFloat(props.maxWidth)) {
                moveX = parseFloat(props.maxWidth);
            }
            leftWidth.value = `${moveX}px`;
            oldLeftWidth.value = `${moveX}px`;
        };

        el.addEventListener('mousedown', (e: MouseEvent) => {
            moveLeftDom.style.width = oldLeftWidth.value;
            left = moveLeftDom.style.width;
            startX = e.pageX;
            document.addEventListener('mousemove', mousemove);
        });
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', mousemove);
        });
    };
    onMounted(() => {
        if (props.hiddenMove) return;
        moveFn();
    });
</script>

<style lang="less" scoped>
    .tpf-indentation {
        display: flex;
        height: 100%;
        background-color: #fff;

        .indentation-left {
            background-color: #fff;
            border-right: 1px solid #eee;
            overflow: auto;
            display: flex;
            flex-direction: column;
        }

        .indentation-icon {
            width: 32px;
            background-color: #fff;
            border-right: 1px solid #eee;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        .indentation-right {
            background-color: #fff;
            flex: 1 0 0;
            padding: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .rotate {
                transform: rotate(180deg);
            }
        }
    }
</style>
