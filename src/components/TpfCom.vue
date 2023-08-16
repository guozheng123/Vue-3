<script setup lang="tsx" name="tpfCom">
    import TestTpfCollapse from '@/components/TpfCollapse/test/TestTpfCollapse.vue';
    import TestSvgIcon from '@/components/SvgIcon/test/TestSvgIcon.vue';
    import TestTpfAnchor from '@/components/TpfAnchor/test/TestTpfAnchor.vue';
    import TestTpfQrCode from '@/components/TpfQrcode/test/TestTpfQrCode.vue';
    import TestTpfIndentation from '@/components/TpfIndentation/test/TestTpfIndentation.vue';
    import TestTpfLayout from '@/components/TpfLayout/test/TestTpfLayout.vue';
    import TestTpfAddInfoLayout from '@/components/TpfAddInfoLayout/test/TestTpfAddInfoLayout.vue';
    import TestTpfModal from '@/components/TpfModal/test/TestTpfModal.vue';
    import TestTpfUpload from '@/components/TpfUpload/test/TestTpfUpload.vue';
    import TestTpfExport from '@/components/TpfExport/test/TestTpfExport.vue';
    import TestTpfDropdown from '@/components/TpfDropdown/test/TestTpfDropdown.vue';
    import TestTpfForm from '@/components/TpfForm/test/TestTpfForm.vue';
    import TestTpfTableLayout from '@/components/TpfTableLayout/test/TestTpfTableLayout.vue';
    import TestTpfTable from '@/components/TpfTable/test/TestTpfTable.vue';
    import TestTpfDeleteDetail from '@/components/TpfDeleteDetail/test/TestTpfDeleteDetail.vue';
    import TestTpfDescriptions from '@/components/TpfDescriptions/test/TestTpfDescriptions.vue';
</script>

<template>
    <div class="tpfCom">
        <TestTpfCollapse :index="1" />
        <TestSvgIcon :index="2" />
        <TestTpfAnchor :index="3" />
        <TestTpfQrCode :index="4" />
        <TestTpfIndentation :index="5" />
        <TestTpfLayout :index="6" />
        <TestTpfAddInfoLayout :index="7" />
        <TestTpfModal :index="8" />
        <TestTpfUpload :index="9" />
        <TestTpfExport :index="10" />
        <TestTpfDropdown :index="11" />
        <TestTpfForm :index="12" />
        <TestTpfTableLayout :index="13" />
        <TestTpfTable :index="14" />
        <TestTpfDeleteDetail :index="15" />
        <TestTpfDescriptions :index="16" />
    </div>
</template>

<style lang="less" scoped>
    .tpfCom {
        background-color: #fff;
        height: 100vh;
        padding: 10px;
        box-sizing: border-box;
    }
</style>
