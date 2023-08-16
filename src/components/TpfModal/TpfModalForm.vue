<template> <VNode /> </template>

<script setup lang="tsx">
    import { ref, useAttrs } from 'vue';
    import { Row, Col, Button } from 'ant-design-vue';
    import { useTpfSubmitForm } from '@/components';
    const { TpfSubmitForm } = useTpfSubmitForm();

    type Props = {
        formList: any[];
        searchForm?: (val: any) => void;
        loading?: boolean;
    };

    const props = defineProps<Props>();

    const attrs = useAttrs();

    const TpfFormRef = ref<InstanceType<typeof TpfSubmitForm> | null>(null);

    const search = async () => {
        props.searchForm && props.searchForm(await TpfFormRef.value?.onSubmit());
    };

    const VNode = () => {
        const { formList = [] } = props;
        return (
            <Row class="tpfModalForm">
                <Col span={21}>
                    {!!formList && !!formList.length && (
                        <TpfSubmitForm
                            ref={TpfFormRef}
                            formList={formList}
                            labelCol={{ style: { width: '90px' } }}
                            colProps={{ span: 12 }}
                            onEnter={() => search()}
                            {...attrs}
                        />
                    )}
                </Col>
                <Col span={3} class="t-text-right t-py-[10px]">
                    <Button
                        type="primary"
                        onClick={() => {
                            if (!!props.loading) return;
                            search();
                        }}
                    >
                        查询
                    </Button>
                </Col>
            </Row>
        );
    };
</script>
