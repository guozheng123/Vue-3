<template>
    <div>
        <TpfCollapse title="档案" gap="0">
            <a-form
                ref="fileRef"
                :model="formState"
                name="advanced_search"
                :label-col="{
                    style: { width: '115px' }
                }"
                :rules="rules"
            >
                <a-card>
                    <a-row :gutter="24">
                        <a-col :span="18">
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <a-form-item label="移动电话" name="mobile">
                                        <a-input
                                            :maxlength="11"
                                            v-if="routerType !== 'detail'"
                                            v-model:value.trim="formState.mobile"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.mobile ? formState.mobile : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="出生日期" name="birthDate">
                                        <a-date-picker
                                            valueFormat="YYYY-MM-DD"
                                            v-if="routerType !== 'detail'"
                                            v-model:value="formState.birthDate"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.birthDate ? formState.birthDate : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="性别" name="sex">
                                        <a-select
                                            v-if="routerType !== 'detail'"
                                            ref="select"
                                            v-model:value="formState.sex"
                                        >
                                            <a-select-option value="m">男</a-select-option>
                                            <a-select-option value="f">女</a-select-option>
                                        </a-select>
                                        <span v-if="routerType === 'detail'">{{
                                            formState.sex
                                                ? formState.sex === 'f'
                                                    ? '女'
                                                    : '男'
                                                : '--'
                                        }}</span></a-form-item
                                    >
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="部门" name="departmentId">
                                        <a-tree-select
                                            v-if="routerType !== 'detail'"
                                            v-model:value="formState.departmentId"
                                            show-search
                                            style="width: 100%"
                                            :dropdown-style="{
                                                maxHeight: '400px',
                                                overflow: 'auto'
                                            }"
                                            allow-clear
                                            tree-default-expand-all
                                            :tree-data="treeData"
                                            treeNodeFilterProp="label"
                                            :filterTreeNode="fillterFUN"
                                            :field-names="{
                                                children: 'branchTree',
                                                label: 'rootName',
                                                value: 'rootId'
                                            }"
                                        />

                                        <span v-if="routerType === 'detail'">{{
                                            formState.departmentId ? rootName : '--'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="职位" name="position">
                                        <a-input
                                            v-if="routerType !== 'detail'"
                                            :maxlength="50"
                                            v-model:value.trim="formState.position"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.position ? formState.position : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="邮箱" name="email">
                                        <a-input
                                            v-if="routerType !== 'detail'"
                                            :maxlength="50"
                                            v-model:value.trim="formState.email"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.email ? formState.email : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="地址" name="address">
                                        <a-input
                                            v-if="routerType !== 'detail'"
                                            :maxlength="100"
                                            v-model:value.trim="formState.address"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.address ? formState.address : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="接收短信" name="receiveSmsFlag">
                                        <a-checkbox
                                            :disabled="routerType === 'detail'"
                                            v-model:checked="formState.receiveSmsFlag"
                                        />

                                        <!-- <a-input :maxlength="50" v-model:value.trim="formState.aa">
                                    </a-input> -->
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="接收邮件" name="receiveMailFlag">
                                        <a-checkbox
                                            :disabled="routerType === 'detail'"
                                            v-model:checked="formState.receiveMailFlag"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item label="备注" name="remark">
                                        <a-textarea
                                            v-if="routerType !== 'detail'"
                                            :maxlength="200"
                                            v-model:value.trim="formState.remark"
                                        />
                                        <span v-if="routerType === 'detail'">{{
                                            formState.remark ? formState.remark : '- -'
                                        }}</span>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col :span="6">
                            <div class="upload_box">
                                <div v-if="imgUrl" class="upload_box_left"
                                    ><div
                                        style="
                                            height: 140px;
                                            width: 100px;
                                            background-color: #f8faff;
                                        "
                                    >
                                        <div style="height: 35px"></div>
                                        <div style="margin-left: 15px; height: 70px; width: 70px">
                                            <img
                                                style="width: 70px; height: 70px"
                                                src="~@/assets/images/headsculpture.png"
                                                alt=""
                                            />
                                        </div> </div
                                ></div>
                                <div class="upload_box_right">
                                    <div class="upload_div upload">
                                        <a-upload
                                            v-model:file-list="fileList"
                                            list-type="picture-card"
                                            :maxCount="1"
                                            accept=".jpg,.png,.jpeg"
                                            :customRequest="customRequest"
                                            @change="changeImg"
                                            :showUploadList="{
                                                showRemoveIcon: routerType !== 'detail'
                                            }"
                                        >
                                            <div>
                                                <div
                                                    v-if="routerType !== 'detail'"
                                                    style="margin-right: 100px"
                                                >
                                                    <a-button
                                                        ghost
                                                        :disabled="routerType === 'detail'"
                                                        type="primary"
                                                        class="tpf-button"
                                                    >
                                                        上传照片
                                                    </a-button>
                                                </div>
                                                <div v-if="routerType !== 'detail'" class="title"
                                                    >大小不超过5M(/jpg/jpeg/png)</div
                                                >
                                            </div>
                                        </a-upload>
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-card>
            </a-form>
        </TpfCollapse>
    </div>
</template>

<script setup lang="ts" name="files">
    import { ref, watch, computed, onMounted } from 'vue';
    import TpfCollapse from '@/components/TpfCollapse/index.vue';
    import type { FormInstance } from 'ant-design-vue';
    import { checkEmail, checkSpecial, checkPhoneNumber } from '@/formRuleConfig/Tpfrules';
    import { Rule } from 'ant-design-vue/es/form';
    import type { TpfValidateRule } from '@/types';

    import { useFilesystemApi, getDepartmentTreeList, useUserApi } from '@/api';
    import { useRouter } from 'vue-router';
    const filesystemApi = useFilesystemApi();

    type Props = {
        paramsData: any;
    };
    const props = withDefaults(defineProps<Props>(), {
        paramsData: () => ({})
    });
    const fileRef = ref<FormInstance>() as any;
    const userApi = useUserApi();
    const $router = useRouter();

    const routerType = computed(() => $router.currentRoute.value.query.type);
    const userId = computed(() => $router.currentRoute.value.query.userId);

    interface FormState {
        mobile: string;
        birthDate: string;
        sex: string;
        position: string;
        email: string;
        address: string;
        receiveSmsFlag: boolean;
        receiveMailFlag: boolean;
        remark: string;
        departmentId: string;
        photo: any;
    }
    const formState = ref<FormState>({
        mobile: '',
        birthDate: '',
        sex: '',
        position: '',
        email: '',
        address: '',
        receiveSmsFlag: true,
        receiveMailFlag: true,
        remark: '',
        photo: '',
        departmentId: ''
    });
    const fileList = ref<any>([]);
    const fieldTypesArr = ['jpg', 'png', 'jpeg'];
    const imgUrl = computed(() => fileList.value.length === 0);

    const rootName = ref('');
    const customRequest = async (upload: any) => {
        if ((upload.file as File).size > 5 * 1024 * 1024) {
            const { message } = await import('ant-design-vue');
            message.error('文件大小不能超过5M');
            return;
        }
        console.log(upload);

        const fieldTypes = upload.file.name.substring(upload.file.name.lastIndexOf('.') + 1);
        if (fieldTypesArr.includes(fieldTypes)) {
            fileList.value = [upload.file];
            const res = await filesystemApi.uploadFileObject({
                businessType: 'operation',
                file: upload.file
            });
            formState.value.photo = res.data.object.fileCode;
            const res1 = await filesystemApi.getPreviewFileUrl({
                fileCode: res.data.object.fileCode
            });
            fileList.value = [{ url: res1.data.value }];
        }
    };

    const changeImg = (data: any) => {
        if (routerType.value !== 'detail') {
            if (data.file.status === 'removed') {
                formState.value.photo = '';
            }
        }
    };

    const rules = computed(() => {
        return {
            mobile: [
                checkSpecial(),
                checkPhoneNumber(),
                {
                    validator: async (_rule: Rule, value: string) => {
                        try {
                            if (value) {
                                const res = await userApi.checkMobile({
                                    mobile: value,
                                    userId: Number(userId.value)
                                });
                                if (!res.data.value) {
                                    return Promise.reject(res.errorMessage || '移动电话重复');
                                }
                                return Promise.resolve();
                            }
                        } catch (error) {
                            console.log('error: ', error);
                        }
                    },
                    trigger: ['blur']
                }
            ],
            address: [checkSpecial()],
            remark: [checkSpecial()],
            email: [checkEmail()]
        } as TpfValidateRule;
    });

    const { treeData } = getDepartmentTreeList();

    const load = async () => {
        if (routerType.value !== 'add') {
            Object.keys(formState.value).forEach(key => {
                formState.value[key] = props.paramsData[key];
            });

            if (formState.value.photo) {
                const res1 = await filesystemApi.getPreviewFileUrl({
                    fileCode: formState.value.photo
                });
                fileList.value = [{ url: res1.data.value }];
            }
        }
    };

    const fillterFUN = (searchVal: any, treeNode: any) => {
        return treeNode?.rootName.includes(searchVal);
    };

    const getDepartmentTreeListId = async (data: any, rootId: string) => {
        for (let i = 0; i < data?.length; i++) {
            const treeItem = data[i];
            if (treeItem.rootId == rootId) {
                return treeItem;
            } else {
                if (treeItem.branchTree && treeItem.branchTre?.length > 0) {
                    const res = getDepartmentTreeListId(treeItem.branchTree, rootId) as any;
                    if (res) {
                        return res;
                    }
                }
            }
        }
    };

    watch(
        () => treeData,
        async val => {
            const res = getDepartmentTreeListId(val.value, formState.value.departmentId);
            res.then(result => {
                try {
                    rootName.value = result.rootName;
                } catch (error) {}
            });
            // console.log(await getDepartmentTreeListId(treeData, '150'));
        },
        { deep: true, immediate: true }
    );

    onMounted(() => {
        load();
    });
    defineExpose({
        formState,
        fileRef
    });
</script>

<style scoped lang="less">
    // :deep(.ant-card) {
    //     .ant-card-body {
    //         padding: 8px 12px 8px 12px;

    //         .title_name {
    //             padding-left: 16px !important;
    //             color: #1d2129;
    //             font-size: 16px;
    //         }
    //     }
    // }
    :deep(.ant-picker) {
        width: 100%;
    }

    .upload_box {
        // display: inline-block;
        display: flex;

        .upload_box_left {
            display: inline-block;
        }

        .upload_box_right {
            display: inline-block;
            margin-left: 20px;
        }
    }

    .upload_div {
        margin-left: 20px;

        :deep(.ant-upload-select-picture-card) {
            border: 0;
            background-color: white;
            width: 180px;
        }
    }

    :deep(.upload) {
        display: contents;

        .ant-upload-list-picture-card-container {
            height: 140px !important;
            background: #f8faff;
            margin: 0 20px 8px 0;

            .ant-upload-list-item {
                padding: 0 !important;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
            }
        }

        .img {
            height: 100px;
            width: 100px;
            // background-color: red;
        }

        .title {
            font-size: 12px;
            font-weight: 400;
            color: #c8c9cc;
            margin-top: 5px;
        }

        .detail {
            display: inline-block;
            margin-top: 30px;

            span {
                font-size: 12px;
                font-weight: 400;
                color: #c8c9cc;
                line-height: 14px;
            }
        }
    }
</style>
