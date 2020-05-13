<template>
    <div class="loading">
        <div class="loading_box">数据加载中，请稍候...</div>
    </div>
</template>

<script>
    export default {
        name:"Loading"
    }
</script>

<style lang="scss" scoped>
.loading{
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    .loading_box{
        width:300px;
        height:150px;
        border-radius:20px;
        display:flex;
        justify-content: center;
        align-items: center;
        background-color:#d33a31;
        color:#fff;
        font-size:16px;
    }
}

</style>