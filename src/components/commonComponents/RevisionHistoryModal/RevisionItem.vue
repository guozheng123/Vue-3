<template>
    <div class="revision">
        <div class="revision-title">
            <SvgIcon
                :type="isOpen ? 'icon-pc-wrapper-1' : 'icon-pc-wrapper'"
                class="wrapper-icon"
                @click="setIsOpen(!isOpen)"
                :size="16"
                :style="{ opacity: index === 0 ? 0 : 1 }"
            />
            <span class="t-text-[#000]">V{{ row.bomVersion }}</span>
            <span v-if="row.createDatetime">{{ row.createDatetime }}</span>
            <span v-if="row.createUserName">{{ row.createUserName }}</span>
            <span>{{ index === 0 ? '新增' : '修改' }}</span>
        </div>
        <template v-if="isOpen">
            <div class="revision-content" v-for="(item, inx) in row.result || []" :key="inx">
                {{ item }}
            </div>
        </template>
    </div>
</template>

<script setup lang="tsx">
    import type { ResGetBomInfoRevisionHistory } from '@/api';
    import { useRef } from '@/hooks';
    type Props = {
        row: ResGetBomInfoRevisionHistory;
        index: number;
    };
    defineProps<Props>();

    const [isOpen, setIsOpen] = useRef(true);
</script>

<style lang="less" scoped>
    .revision {
        margin-bottom: 10px;
        .revision-title {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #4e5969;
            font-size: 16px;
            .wrapper-icon {
                border: 1px solid #d9d9d9;
                border-radius: 2px;
            }
        }
        .revision-content {
            color: #999;
            font-size: 16px;
            padding-left: 48px;
            margin-top: 10px;
        }
    }
</style>
