<template>
    <div class="three">
        <div>
            <div class="content">
                <img width="100%" height="100%" src="~@/assets/images/d.jpg" alt="" />
            </div>
        </div>
        <div style="margin: 0 10px 0 20px">
            <div class="content">
                <img width="100%" height="100%" src="~@/assets/images/a.jpg" alt="" />
            </div>
        </div>

        <div style="margin: 0 20px 0 10px">
            <div class="content">
                <img width="100%" height="100%" src="~@/assets/images/c.jpg" alt="" /> </div
        ></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .three {
        display: flex;
        margin-top: 20px;

        div {
            flex: 1;
            border-radius: 8px 8px 8px 8px;
            opacity: 1;
        }

        .content {
            width: 100%;
            height: 405px;
            background-color: #fff;
            flex: 1;
            border-radius: 8px 8px 8px 8px;
        }
    }
</style>
