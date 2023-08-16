<template>
    <div v-drag:value="height" :class="{ anchor: closeAnchor, noanchor: !closeAnchor }">
        <a-anchor :affix="closeAnchor" wrapperClass="right_Anchor" @click="handleAnchorClick">
            <div v-for="item in anchorList" :key="item.href">
                <div v-if="item.visible">
                    <a-anchor-link :href="item.href" :title="item.title" v-if="closeAnchor"
                /></div>
            </div>

            <SvgIcon
                @click="() => (closeAnchor = !closeAnchor)"
                v-if="closeAnchor"
                type="icon-xiangshang"
                size="20"
                class="icon"
                cursor
                shadow
            />
            <SvgIcon
                @click="() => (closeAnchor = !closeAnchor)"
                v-if="!closeAnchor"
                type="icon-xiangxia"
                size="20"
                cursor
                shadow
                class="icon"
            />
        </a-anchor>
    </div>
</template>

<script setup lang="tsx" name="TpfAnchor">
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ref, watch } from 'vue';
    import { TpfAnchorList } from '@/types';

    const closeAnchor = ref(true);

    type Props = {
        anchorList: TpfAnchorList[];
    };
    const height = ref(30);
    const props = withDefaults(defineProps<Props>(), {
        anchorList: () => []
    });

    watch(
        () => closeAnchor.value,
        val => {
            if (val) {
                height.value = props.anchorList.length * 36 + 25;
            } else {
                height.value = 30;
            }
        },
        {
            deep: true,
            immediate: true
        }
    );

    const handleAnchorClick = (e: any, link: any) => {
        e.preventDefault();
        const scroll = document.getElementById(link.href) as any;
        scroll && scroll.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
</script>

<style lang="less" scoped>
    .noanchor {
        width: 80px;
        height: 30px;
        padding-right: 14px;
        box-shadow: 0 0 10px 4px rgba(152, 152, 152, 0.2);
        background: white;
        position: fixed;
        z-index: 999;
        right: 14px;
        top: 30%;
        border-radius: 4px;
        cursor: pointer;

        :deep(.ant-anchor-wrapper) {
            position: relative;
            display: block;
            color: white !important;

            .ant-anchor {
                position: unset;

                .icon {
                    margin-left: 50%;
                    margin-top: 5px;
                }
            }
        }
    }

    .anchor {
        // width: 72px;
        padding-right: 14px;
        box-shadow: 0 0 10px 4px rgba(152, 152, 152, 0.2);
        background: white;
        position: fixed;
        z-index: 999;
        right: 14px;
        top: 30%;
        border-radius: 4px;
        cursor: pointer;

        :deep(.ant-anchor-wrapper) {
            position: relative;
            display: block;
            margin: 0 !important;
            padding: 0 !important;
            color: white !important;

            .ant-anchor {
                position: unset;

                .icon {
                    margin-left: 50%;
                }

                .ant-anchor-link {
                    text-align: center;

                    .ant-anchor-link-title {
                        font-size: 14px;
                        position: relative;
                        display: block;
                        padding-bottom: 6px;
                        text-overflow: ellipsis;
                        transition: all 0.3s;
                        white-space: break-spaces;
                    }
                }
            }
        }
    }
</style>
