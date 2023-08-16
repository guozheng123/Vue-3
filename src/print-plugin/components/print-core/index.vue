<template> <VNode /> </template>

<script setup lang="tsx">
    import PrintOperate from '../print-operate';
    import { ref, useCssModule, onMounted, unref } from 'vue';
    import { newHiprintPrintTemplate } from '../../utils/template-helper';
    import { provider1, provider2 } from './provider';
    import { hiprint } from 'vue-plugin-hiprint';
    import PrintProvider from '../print-provider';
    import { useFilesystemApi, useCustomPrintApi, useDataQueryApi } from '@/api';
    import type { ResQueryPrintTemplateFields, ResGetPrintTemplate } from '@/api';

    // 组合式函数 hooks
    import { usePaper } from '../../hooks/use-paper';
    import { useZoom } from '../../hooks/use-zoom';
    import { isEmpty } from 'lodash-es';
    import { useRouteQuery } from '@/hooks';
    import { initDefaultTemplate } from '@/print-plugin/hooks/template';

    type RouterQuery = {
        templateTypeCode: string;
        type: 'edit' | 'print';
        ids: string[];
    };

    const { type, templateTypeCode, ids } = useRouteQuery<RouterQuery>();

    const filesystemApi = useFilesystemApi();

    const customPrintApi = useCustomPrintApi();

    const dataQueryApi = useDataQueryApi();

    /**
     * 构建设计器
     * 注意: 必须要在 onMounted 中去构建
     * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
     */
    let hiprintTemplate: any;

    const renderHelpName = templateTypeCode + '_help';

    const renderHeaderListName = templateTypeCode + '_headerList';

    const printTemplateDom = ref<HTMLDivElement>({} as HTMLDivElement);

    const PrintElementOptionSettingDom = ref<HTMLDivElement>({} as HTMLDivElement);

    const PrintOperateDom = ref<InstanceType<typeof PrintOperate> | null>(null);

    const { paperTypes, curPaperType, setPaper } = usePaper(templateTypeCode);

    const { scaleValue, changeScale } = useZoom(templateTypeCode);

    const styles = useCssModule('printCore');

    const printTemplateList = ref<ResGetPrintTemplate[]>([]);

    const allRenderPrintFields = ref({} as ResQueryPrintTemplateFields);

    /**
     * 旋转纸张
     */
    const rotatePaper = () => {
        hiprintTemplate.rotatePaper();
    };

    const onImageChooseClick = (target: any) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();
        input.onchange = async function () {
            // @ts-ignore
            const file = this.files[0];
            if (file) {
                const { fileCode } = await filesystemApi
                    .uploadFileObject({ businessType: 'print', file })
                    .then(res => res.data.object || {});
                const url = await filesystemApi
                    .getPreviewFileUrl({ fileCode })
                    .then(res => res.data.value);
                target.refresh(url);
            }
        };
        input.remove();
    };

    const buildDesigner = (canvasJson = '') => {
        printTemplateDom.value.innerHTML = '';
        hiprintTemplate = newHiprintPrintTemplate(templateTypeCode, {
            template: JSON.parse(canvasJson || '{}'),
            settingContainer: PrintElementOptionSettingDom.value,
            onImageChooseClick
        });

        hiprintTemplate.design(printTemplateDom.value, { grid: false });
    };

    /**
     * 清空所有元素
     */
    const clearPaper = () => {
        buildDesigner(JSON.stringify(initDefaultTemplate(unref(allRenderPrintFields))));
    };

    const dataAndDetails = async () => {
        const params = { ids, pageCode: templateTypeCode };
        return await dataQueryApi.dataAndDetails(params).then(res => res.data.list || []);
    };

    /**
     * 浏览器打印
     */
    const print = async () => {
        const params = PrintOperateDom.value?.getPrintTemplateName() as any;
        if (!params) return;

        const options = { leftOffset: -1, topOffset: -1 };
        // 扩展
        const ext = {
            callback: () => {
                console.log('浏览器打印窗口已打开');
                if (['edit', 'print'].includes(params?.type)) {
                    const canvasJson = JSON.stringify(hiprintTemplate.getJson());
                    customPrintApi.editPrintTemplate({ ...params, canvasJson, defaulet: 1 });
                }
            },
            styleHandler: () => {
                // const css = `<link href="/css/print-lock.css" media="print" rel="stylesheet">`;
                // 重写 文本 打印样式
                return ''; //'<style>.hiprint-printElement-text{color:red !important;}</style>';
            }
        };

        // 调用浏览器打印
        hiprintTemplate.print(await dataAndDetails(), options, ext);
    };

    const queryPrintTemplateFields = async () => {
        try {
            allRenderPrintFields.value = await customPrintApi
                .queryPrintTemplateFields({ templateTypeCode })
                .then(res => res.data.object);
            console.log('获取所有的字段', allRenderPrintFields.value);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getPrintTemplate = async () => {
        const [{ list }] = await customPrintApi
            .getPrintTemplate({ templateTypeCode })
            .then(res => res.data.object.list || [{}]);
        printTemplateList.value = list || [];
        console.log('所有的模版', printTemplateList.value);
    };

    const saveTemplate = async () => {
        const { message } = await import('ant-design-vue');
        const params = PrintOperateDom.value?.getPrintTemplateName() as any;
        const canvasJson = JSON.stringify(hiprintTemplate.getJson());
        if (['edit', 'print'].includes(params?.type)) {
            await customPrintApi.editPrintTemplate({ ...params, canvasJson });
        }
        if (['add'].includes(params?.type)) {
            await customPrintApi.createPrintTemplate({ ...params, canvasJson });
        }
        message.success('保存成功');
    };

    const initHiPrint = () => {
        hiprint.init({
            providers: [
                provider1({
                    renderName: renderHeaderListName,
                    allRenderPrintFields: unref(allRenderPrintFields)
                }),
                provider2({
                    renderName: renderHelpName,
                    allRenderPrintFields: unref(allRenderPrintFields)
                })
            ]
        });
    };

    onMounted(async () => {
        await queryPrintTemplateFields();
        if (isEmpty(unref(allRenderPrintFields))) return;
        initHiPrint();
        getPrintTemplate();
    });

    defineExpose({ saveTemplate });

    const VNode = () => {
        return (
            <div class={styles.printCore}>
                <PrintOperate
                    ref={PrintOperateDom}
                    buildDesigner={buildDesigner}
                    type={type}
                    templateTypeCode={templateTypeCode}
                    paperTypes={paperTypes.value}
                    curPaperType={curPaperType.value}
                    setPaper={setPaper}
                    scaleValue={scaleValue.value}
                    changeScale={changeScale}
                    rotatePaper={rotatePaper}
                    print={print}
                    clearPaper={clearPaper}
                    printTemplateList={printTemplateList.value}
                />
                <div class="printCore-content">
                    {!isEmpty(unref(allRenderPrintFields)) && (
                        <PrintProvider
                            class="content-left"
                            allRenderPrintFields={allRenderPrintFields.value}
                            renderHelpName={renderHelpName}
                            renderHeaderListName={renderHeaderListName}
                        />
                    )}
                    <div class="content-center scrollbarColor">
                        <div ref={printTemplateDom} />
                    </div>
                    <div class="content-right">
                        <div class="setting scrollbarColor" ref={PrintElementOptionSettingDom} />
                    </div>
                </div>
            </div>
        );
    };
</script>

<style lang="less" module="printCore">
    .printCore {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        :global {
            .printCore-content {
                background-color: #fff;

                flex: 1;
                display: flex;
                overflow: hidden;
                .content-left {
                    flex: 1;
                    overflow: auto;
                    padding: 5px;
                }
                .content-center {
                    flex: 2;
                    padding: 20px;
                    overflow: auto;
                }
                .content-right {
                    flex: 1;
                    overflow: hidden;
                    height: 100%;
                    .setting {
                        height: 100%;
                        overflow-y: auto;
                        border: 1px solid #ddd;
                        .prop-tabs {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            .prop-tab-item.active {
                                color: var(--ant-primary-color);
                                border-bottom-color: var(--ant-primary-color);
                            }
                        }
                        .hiprint-option-item-field {
                            > input {
                                flex: 1 0 0;
                            }
                            > .hiprint-option-item-settingBtn {
                                background-color: var(--ant-primary-color);
                            }
                        }
                        .hiprint-option-item-settingBtn {
                            cursor: pointer;
                        }
                        .hiprint-option-item-submitBtn {
                            background-color: var(--ant-primary-color);
                        }
                    }
                }
            }
        }
    }
</style>
