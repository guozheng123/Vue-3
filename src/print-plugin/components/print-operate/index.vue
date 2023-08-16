<template> <VNode /> </template>

<script setup lang="tsx">
    import { Button, RadioGroup, Input, Select, message } from 'ant-design-vue';
    import { computed, useCssModule, unref, ref, watch } from 'vue';
    import SvgIcon from '@/components/SvgIcon/index.vue';
    import { ResGetPrintTemplate, useCustomPrintApi } from '@/api';
    import { useRouteBackTab } from '@/hooks';
    import { isEmpty } from 'lodash-es';
    import { initDefaultTemplate } from '../../hooks/template';

    const { routeBackTab } = useRouteBackTab();
    const customPrintApi = useCustomPrintApi();

    type Props = {
        type: 'edit' | 'print';
        templateTypeCode: string;
        paperTypes?: any;
        curPaperType: string;
        setPaper: (type: any, val: any) => any;
        changeScale: (val: boolean) => any;
        scaleValue: number;
        rotatePaper: () => any;
        print: () => any;
        clearPaper: () => any;
        printTemplateList: ResGetPrintTemplate[];
        buildDesigner: (val: string) => void;
    };
    const props = defineProps<Props>();

    const printTemplateName = ref('');

    const isAddStatus = ref(false);

    const paperTypesList = computed(() => {
        const res = Object.keys(unref(props.paperTypes)).map(item => ({
            value: item,
            label: item
        }));
        return res;
    });

    const onAddNewTem = async () => {
        printTemplateName.value = '';
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({
            icon: null,
            title: '新建模版名称',
            content: () => <Input v-model={[printTemplateName.value, 'value', ['trim']]} />,
            onOk: async () => {
                const { message } = await import('ant-design-vue');
                if (!printTemplateName.value) {
                    message.error('请输入模版名称');
                    return Promise.reject();
                }
                isAddStatus.value = true;
            }
        });
    };

    const onDelTemplate = async () => {
        const TpfDelConfirm = (await import('@/components/TpfModal/TpfDelConfirm'))['default'];
        await TpfDelConfirm({ content: '确定要删除当前模版吗？' });
        const params = unref(getSelectRow());
        if (params.initialize === 1) {
            message.error('内置模版不允许删除');
            return;
        }
        const list = [params];
        await customPrintApi.batchDeletedPrintTemplate({ list });
        message.success('删除成功');
        routeBackTab();
    };

    const styles = useCssModule('paper');

    const printTemplateCode = ref('');

    const getSelectRow = (): ResGetPrintTemplate => {
        const res = props.printTemplateList.find(
            item => item.printTemplateCode === printTemplateCode.value
        );
        return (res || {}) as ResGetPrintTemplate;
    };

    const getPrintTemplateName = () => {
        let type = props.type as string;
        console.log(' printTemplateName.value', printTemplateName.value);
        if (!printTemplateName.value) {
            message.error('模板名称不可为空');
            return;
        }

        if (isAddStatus.value) {
            type = 'add';
        }
        if (props.type === 'edit') {
            return { type, ...unref(getSelectRow()), printTemplateName: printTemplateName.value };
        }
        if (type === 'add') {
            const res = {
                type,
                templateTypeCode: props.templateTypeCode,
                printTemplateName: printTemplateName.value
            } as any;
            delete res.printTemplateCode;
            return res;
        }
        if (type === 'print') {
            return { type, ...unref(getSelectRow()), printTemplateName: printTemplateName.value };
        }
        return {};
    };

    const changeSelectCodes = (val: any, ops: any) => {
        props.buildDesigner(ops.canvasJson);
    };

    const clearInitPaper = () => {
        props.clearPaper();
    };
    const insertPrintTemplateName = () => {
        let renderItem = {} as ResGetPrintTemplate;
        if (props.type === 'edit') {
            // 寻找内置的
            if (props.printTemplateList && props.printTemplateList.length) {
                renderItem = props.printTemplateList.find(
                    item => item.initialize === 1
                ) as ResGetPrintTemplate;
                console.log('内置模版1', renderItem);
                printTemplateName.value = (renderItem || {}).printTemplateName;
                printTemplateCode.value = (renderItem || {}).printTemplateCode;
            }
        }
        if (props.type === 'print') {
            // 寻找默认的
            if (props.printTemplateList && props.printTemplateList.length) {
                renderItem = props.printTemplateList.find(
                    item => item.defaulet === 1
                ) as ResGetPrintTemplate;
                renderItem = renderItem || props.printTemplateList[0];
                console.log('默认模版2', renderItem);
                printTemplateCode.value = renderItem.printTemplateCode;
                printTemplateName.value = renderItem.printTemplateName;
            }
        }
        if (isEmpty(renderItem)) {
            props.buildDesigner(JSON.stringify(initDefaultTemplate()));
        } else {
            props.buildDesigner(renderItem.canvasJson);
        }
    };
    watch(
        () => props.printTemplateList,
        () => insertPrintTemplateName()
    );

    defineExpose({ getPrintTemplateName });

    const renderSelectName = () => {
        if (isAddStatus.value) {
            // 新增
            return <Input v-model={[printTemplateName.value, 'value']} />;
        }
        if (['edit'].includes(props.type)) {
            // 编辑
            return <Input v-model={[printTemplateName.value, 'value']} />;
        }
        if (['print'].includes(props.type)) {
            // 打印
            return (
                <Select
                    options={props.printTemplateList}
                    v-model={[printTemplateCode.value, 'value']}
                    onChange={changeSelectCodes}
                    fieldNames={{ value: 'printTemplateCode', label: 'printTemplateName' }}
                />
            );
        }
        return null;
    };

    const VNode = () => {
        return (
            <div class={styles.operateBtn}>
                <div class="ipt-name">
                    <div class="title"> 模版名称: </div>
                    {renderSelectName()}
                </div>
                <RadioGroup
                    class="t-whitespace-nowrap"
                    value={props.curPaperType}
                    onUpdate:value={type => {
                        props.setPaper(type, props.paperTypes[type]);
                    }}
                    button-style="solid"
                    options={paperTypesList.value}
                    optionType="button"
                />
                <div class="zoom-btns">
                    <SvgIcon
                        type="icon-fangda"
                        shadow
                        size={22}
                        onClick={() => props.changeScale(true)}
                    />
                    <div>{(props.scaleValue * 100).toFixed(0)}%</div>
                    <SvgIcon
                        type="icon-suoxiao"
                        shadow
                        size={22}
                        onClick={() => props.changeScale(false)}
                    />
                </div>
                <Button class="tpf-button !t-min-w-[unset]" onClick={() => props.rotatePaper()}>
                    <SvgIcon type="icon-xuanzhuan" shadow size={20} class={'t-translate-y-[2px]'} />
                    旋转纸张
                </Button>
                <Button class="tpf-button !t-min-w-[unset]" onClick={() => clearInitPaper()}>
                    <SvgIcon type="icon-qingchu" shadow size={20} class={'t-translate-y-[2px]'} />
                    清空纸张
                </Button>
                {props.type === 'print' && (
                    <Button class="tpf-button !t-min-w-[unset]" onClick={() => props.print()}>
                        <SvgIcon type="icon-dayin" /> 打印
                    </Button>
                )}
                {props.type === 'print' && !unref(isAddStatus) && (
                    <>
                        <Button class="tpf-button" onClick={() => onAddNewTem()}>
                            新增
                        </Button>
                        <Button class="tpf-button" onClick={() => onDelTemplate()}>
                            删除
                        </Button>
                    </>
                )}
            </div>
        );
    };
</script>

<style lang="less" module="paper">
    .operateBtn {
        background-color: #fff;
        width: 100%;
        height: 40px;
        display: flex;
        gap: 10px;
        align-items: center;

        :global {
            .zoom-btns {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ipt-name {
                margin: 0;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                gap: 10px;
                white-space: nowrap;
                > [class^='ant-'] {
                    width: 180px;
                }
            }
        }
    }
</style>
