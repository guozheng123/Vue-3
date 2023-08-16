<template>
    <div class="menu-box">
        <div class="menu-item" v-for="(item, index) in props.menusList" :key="index">
            <h3
                :title="item.meta?.title"
                @click="onChange(item)"
                :class="['tpf-menu-name1', 'title', item.children ? '' : 'tpf-menu-hover']"
                v-show="!item.meta.hidden"
            >
                <SvgIcon :type="item.meta?.icon" size="24" class="svg-icon1" />
                {{ item.meta?.title }}
            </h3>
            <div v-for="(v, ind) in item.children" :key="ind">
                <h3
                    :title="v.meta?.title"
                    @click="onChange(v)"
                    :class="['tpf-menu-name2', 'title', v.children ? '' : 'tpf-menu-hover']"
                    v-show="!v.meta.hidden"
                >
                    {{ v.meta?.title }}
                </h3>
                <div>
                    <h3
                        v-for="(vv, i) in v.children"
                        :key="i"
                        :title="vv.meta?.title"
                        @click="onChange(vv)"
                        v-show="!vv.meta.hidden"
                        :class="['tpf-menu-name3', 'title', vv.children ? '' : 'tpf-menu-hover']"
                    >
                        {{ vv.meta?.title }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    type Props = {
        menusList?: any[];
    };
    const props = withDefaults(defineProps<Props>(), {
        menusList: () => []
    });
    const router = useRouter();
    const onChange = function (item: any) {
        if (!item.children) {
            router.push({ path: item.path });
        }
    };
</script>

<style lang="less" scoped>
    .menu-box {
        display: flex;
        height: 100%;
        flex-wrap: nowrap;
        gap: 40px;

        .menu-item {
            width: 200px;

            .tpf-menu-name1 {
                color: var(--ant-primary-color);
                position: relative;

                .svg-icon1 {
                    position: absolute;
                    top: 8px;
                    left: 10px;
                }
            }

            .tpf-menu-name2 {
                color: #1d2129;
            }

            .tpf-menu-name3 {
                color: #8d8d8d;
                font-size: 13px;
            }

            .title {
                width: 200px;
                font-weight: 600;
                line-height: 40px;
                padding-left: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 5px;
            }

            .tpf-menu-hover:hover {
                background: var(--ant-primary-1);
                cursor: pointer;
                color: var(--ant-primary-color);
            }
        }
    }
</style>
