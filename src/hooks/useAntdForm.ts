import { FormInstance } from 'ant-design-vue/lib/form';
import { NamePath } from 'ant-design-vue/lib/form/interface';
import { ref } from 'vue';

/**
 * @author wangkang
 * @returns {object} formRef  表单ref属性
 * @returns {Function} submitForm  表单提交方法
 * @returns {Function} resetFields  表单重置方法
 */
export const useAntdForm = <T = any>() => {
    const formRef = ref<FormInstance>();
    const submitForm = async () => {
        return (await formRef.value?.validate()) as Promise<T>;
    };
    const resetFields = () => {
        formRef.value?.resetFields();
    };
    const validateFields = async (list?: string | NamePath[]) => {
        return await formRef.value?.validateFields(list);
    };

    const clearValidate = async (list: NamePath) => {
        formRef.value?.clearValidate(list);
    };

    return {
        formRef,
        submitForm,
        resetFields,
        validateFields,
        clearValidate
    };
};
