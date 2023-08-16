<template>
    <vNode />
</template>

<script setup lang="tsx" name="TpfModal">
    import { Modal, Space } from 'ant-design-vue';
    import {
        CloseOutlined,
        FullscreenOutlined,
        FullscreenExitOutlined
    } from '@ant-design/icons-vue';

    import { useAttrs, useSlots, ref, Teleport, computed, CSSProperties } from 'vue';
    import { v4 } from 'uuid';

    type Props = {
        useFull?: boolean;
        visible: boolean;
        width?: '500px' | '800px' | '1200px' | '720px' | '600px' | '1000px' | '880px' | string;
        height?: string;
        getContainer?: () => HTMLElement;
        draggable?: boolean;
        bodyStyle?: CSSProperties;
        title?: string;
    };

    const props = withDefaults(defineProps<Props>(), {
        width: '600px',
        height: '440px',
        getContainer: () => document.body,
        bodyStyle: () => ({} as CSSProperties)
    });
    const emit = defineEmits<{
        (e: 'update:visible', val: boolean): void;
    }>();

    const attrs = useAttrs();
    const slots = useSlots();

    const fullscreen = ref(false);

    const draggableNodalClass = ref(v4());

    const draggleClassName = computed(() => {
        return 'draggable_' + draggableNodalClass.value;
    });

    const onClose = () => {
        fullscreen.value = false;
        emit('update:visible', false);
    };

    const vNode = () => {
        const { draggable, getContainer, height, width, useFull, bodyStyle } = props;
        return (
            <Teleport to={getContainer()}>
                <div class={draggleClassName.value} v-dragModal={draggable}>
                    <Modal
                        title={props.title}
                        destroyOnClose={true}
                        bodyStyle={{ height: height, overflow: 'auto', ...bodyStyle }}
                        class={`tpf-model ${fullscreen.value ? 'fullscreen' : ''}`}
                        centered
                        getContainer={() => document.querySelector(`.${draggleClassName.value}`)!}
                        keyboard={false}
                        maskClosable={false}
                        width={width}
                        visible={props.visible}
                        {...attrs}
                        v-slots={{
                            ...slots,
                            closeIcon: () => {
                                return (
                                    <Space>
                                        {fullscreen.value
                                            ? useFull && (
                                                  <FullscreenExitOutlined
                                                      onClick={() =>
                                                          (fullscreen.value = !fullscreen.value)
                                                      }
                                                  />
                                              )
                                            : useFull && (
                                                  <FullscreenOutlined
                                                      onClick={() =>
                                                          (fullscreen.value = !fullscreen.value)
                                                      }
                                                  />
                                              )}
                                        <CloseOutlined onClick={onClose} />
                                    </Space>
                                );
                            },
                            footer: () => (
                                <>
                                    <div class="footer-left">
                                        {slots.footerLeft && slots.footerLeft()}
                                    </div>
                                    <div class="footer-right">
                                        {slots.footerRight && slots.footerRight()}
                                    </div>
                                </>
                            )
                        }}
                    />
                </div>
            </Teleport>
        );
    };
</script>
