<template>
    <div class="basicInfo">
        <TpfCollapse title="基本信息">
            <TpfDescriptions :originalDate="info" :renderList="list" />
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import TpfDescriptions from '@/components/TpfDescriptions/index.vue';
    import type { TpfDescColumnType } from '@/types';

    type Props = {
        processInfoData: object;
    };
    const props = withDefaults(defineProps<Props>(), {
        processInfoData: () => {
            return {
                processCode: '',
                processName: '',
                version: '',
                ownedFactory: '',
                createDatetime: '',
                createUser: '',
                modifyDatetime: '',
                modifyUser: ''
            };
        }
    });
    const list = computed(() => {
        return [
            { label: '工艺编号', field: 'processCode' },
            { label: '工艺名称', field: 'processName' },
            { label: '版本', field: 'processVersion' },
            { label: '所属工厂', field: 'factoryName' },
            { label: '创建时间', field: 'createDate' },
            { label: '创建人', field: 'createUser' },
            { label: '修改时间', field: 'modifyDate' },
            { label: '修改人', field: 'modifyUser' }
        ] as TpfDescColumnType[];
    });

    const info = computed(() => {
        return props.processInfoData;
    });
</script>

<style lang="less">
    .basicInfo {
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            appearance: none;
        }

        /* 在Firefox浏览器下 */
        input[type='number'] {
            appearance: text field;
        }

        .ant-input-number-handler-wrap {
            display: none;
        }
    }

    .readonly {
        .ant-select-multiple.ant-select-disabled.ant-select:not(.ant-select-customize-input) {
            .ant-select-selector {
                background: transparent;
            }
        }
    }

    .fontColor {
        color: #1d2129;
    }
</style>
