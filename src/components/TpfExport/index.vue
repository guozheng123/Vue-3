<template>
    <TpfModal
        class="exportStepFirst"
        v-model:visible="visible"
        title="导入数据"
        height="240px"
        width="600px"
    >
        <div class="upload-btn">
            <TpfUpload
                v-bind="$attrs"
                ref="TpfUploadRef"
                :multiple="multiple"
                :accept="accept"
                :maxSize="maxSize"
                :customText="customText"
                :businessType="businessType"
                :downLoadTemplate="downLoadTemplate"
            />
        </div>

        <template #footerLeft>
            <a-checkbox v-if="showDuplication" v-model:checked="overrideFlag"
                >覆盖重复记录</a-checkbox
            >
        </template>
        <template #footerRight>
            <a-button class="tpf-button" @click="visible = false">取消</a-button>
            <a-button class="tpf-button" type="primary" @click="startExport">开始导入</a-button>
        </template>
    </TpfModal>
</template>

<script lang="tsx" setup name="TpfExport">
    import TpfModal from '@/components/TpfModal/index.vue';
    import { useRef } from '@/hooks';
    import { ref, watch } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { UploadFile, Modal } from 'ant-design-vue';
    import { useFilesystemApi } from '@/api';
    import { TpfUploadFile } from '@/types';
    import { ResTpfValue, TpfAxiosRes } from '@/types/axios';

    import TpfUpload from '@/components/TpfUpload/index.vue';

    const emit = defineEmits(['uploadTable', 'fetchApi']);

    const TpfUploadRef = ref<InstanceType<typeof TpfUpload> | null>(null);

    const filesystemApi = useFilesystemApi();

    type Props = {
        businessType?: string; //该资源放置的远程文件目录
        downLoadTemplate?: (() => void) | string;
        multiple?: boolean;
        accept?: string;
        maxSize?: number; //单位M
        customText?: string;
        showDuplication: boolean;
        uploadAction: (val: {
            list: TpfUploadFile[];
            overrideFlag: boolean;
        }) => Promise<TpfAxiosRes<ResTpfValue>> | any;
    };

    const props = withDefaults(defineProps<Props>(), {
        businessType: 'operation',
        multiple: false,
        accept: '.xlsx,.xls',
        maxSize: 10,
        customText: '',
        showDuplication: true
    });

    const [visible, setVisible] = useRef(false);

    const overrideFlag = ref(false);

    const fileList = ref<UploadFile<any>[]>([]);

    const open = () => {
        setVisible(!visible.value);
    };

    const startExport = async () => {
        const list = TpfUploadRef.value?.getFileList() || [];
        if (list.length === 0) return;
        const res = await props.uploadAction({
            list,
            overrideFlag: overrideFlag.value
        });
        console.log(res.data.value);
        if ([true, 'true'].includes(res.data.value)) {
            setVisible(!visible.value);
            const { message } = await import('ant-design-vue');

            message.success('导入成功');
            Modal.destroyAll();
            emit('uploadTable');
            emit('fetchApi');
        } else {
            Modal.confirm({
                centered: true,
                icon: (
                    <span class="anticon anticon-exclamation-circle">
                        <SvgIcon type="error-circle" size={22} />
                    </span>
                ),
                title: '导入错误',
                content: (
                    <>
                        <div>您好,数据有误,请下载错误日志！</div>
                        {/* <div> 日志名称 : {res.errText}</div> */}
                    </>
                ),
                okText: '下载',
                cancelText: '取消',
                onOk: async () => {
                    await filesystemApi.downloadFileObject({ fileCode: res.data.value });
                    setVisible(!visible.value);
                    Modal.destroyAll();
                },
                onCancel: () => {
                    setVisible(!visible.value);
                    Modal.destroyAll();
                }
            });
        }
    };
    watch(visible, () => {
        fileList.value = [];
        overrideFlag.value = false;
    });
    defineExpose({ open });
</script>

<style lang="less">
    .exportStepFirst {
        &.tpf-model {
            .ant-modal-body {
                padding: 10px 20px !important;
                box-sizing: border-box;

                .upload-btn {
                    // background-color: #fafafa;
                    padding: 16px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    border: 1px dashed #e1e2e3;
                }
            }

            .ant-modal-footer {
                .ant-checkbox-wrapper {
                    margin-top: 5px;
                }
            }
        }
    }
</style>
