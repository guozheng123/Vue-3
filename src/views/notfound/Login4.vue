<template>
    <div class="login-box">
        <div class="login-form">
            <div class="title">账号登录</div>
            <a-form
                :model="formState"
                name="horizontal_login"
                layout="vertical"
                autocomplete="off"
                @finish="onFinish"
            >
                <a-form-item name="username">
                    <a-input v-model:value="formState.username" placeholder="请输入用户名">
                        <template #prefix>
                            <UserOutlined class="t-text-[#086bae]" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item name="password">
                    <a-input-password v-model:value="formState.password" placeholder="请输入密码">
                        <template #prefix>
                            <LockOutlined class="t-text-[#086bae]" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item class="t-py-[20px]">
                    <a-button html-type="submit" block> 登录 </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useStore } from '@/store/index';
    import { onMounted, reactive, h } from 'vue';
    import userInfoList from '@/store/modules/mock.json';
    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
    import { useThemeStore } from '@/store/modules/projectConfig';

    const { userStore } = useStore();
    useThemeStore().fillColor({ primaryColor: '#5275da' });

    const formState = reactive({
        username: '',
        password: ''
    });

    const onFinish = async () => {
        const { username } = formState;
        console.log('username: ', username);
        if (!Object.keys(userInfoList).includes(username)) {
            const { message } = await import('ant-design-vue');
            message.error('请检查用户名跟密码是否正确');
            return;
        }
        userStore.mockLogin(username);
    };

    onMounted(() => {
        userStore.$reset();
    });
</script>

<style lang="less" scoped>
    .login-box {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: url('@/assets/images/bg4.png') no-repeat center / 100% auto;

        .login-form {
            width: 305px;
            background: #4e88fe;
            border-radius: 4px 4px 4px 4px;
            padding: 20px;
            position: absolute;
            right: 135px;
            .title {
                font-size: 15px;
                text-align: center;
                margin: 0 0 20px;
                color: #ffffff;
            }
        }
    }
</style>
