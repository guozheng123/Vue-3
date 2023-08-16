<template>
    <div class="ChangeMenuMode">
        <a-tooltip
            placement="top"
            :title="modeType.title"
            :key="modeType.menuTypeMode"
            v-for="modeType in menuModeList"
        >
            <SvgIcon
                :active="currenMenuTypeMode === modeType.menuTypeMode"
                :size="modeType.size"
                :type="modeType.type"
                cursor
                shadow
                @click="changeCurrenMenuTypeMode(modeType.menuTypeMode)"
                active-back-ground="#4A5074"
            />
        </a-tooltip>
    </div>
</template>

<script setup lang="ts" name="ChangeMenuMode">
    import { inject } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    type MenuTypeMode = 'DropDownMode' | 'TiledMode' | 'RightBounceMode';

    type menuModeListType = {
        type: string;
        title: string;
        size: number;
        menuTypeMode: MenuTypeMode;
    }[];

    const menuModeList: menuModeListType = [
        { type: 'icon-pingpu', title: '平铺模式', size: 24, menuTypeMode: 'TiledMode' },
        { type: 'icon-xiala', title: '下拉模式', size: 24, menuTypeMode: 'DropDownMode' },
        { type: 'icon-youdan', title: '右弹模式', size: 24, menuTypeMode: 'RightBounceMode' }
    ];

    type Prop = {
        currenMenuTypeMode: MenuTypeMode;
    };
    defineProps<Prop>();
    const emit = defineEmits<{
        (e: 'update:currenMenuTypeMode', val: MenuTypeMode): void;
    }>();

    const changeCollapsedWidth = inject<(e: number) => void>('changeCollapsedWidth')!;
    const changeCollapsed = inject<(e: boolean) => void>('changeCollapsed')!;

    const changeCurrenMenuTypeMode = (type: MenuTypeMode) => {
        emit('update:currenMenuTypeMode', type);
        if (type === 'TiledMode') {
            changeCollapsedWidth(0);
            changeCollapsed(true);
        } else {
            changeCollapsedWidth(80);
        }
    };
</script>

<style lang="less" scoped>
    .ChangeMenuMode {
        width: 100px;
        margin: 0 auto;
        border: 1px solid #4a5074;
        border-radius: 8px;
        height: 36px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 4px;
    }
</style>
