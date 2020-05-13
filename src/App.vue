<template>
   <!-- v-cloak防止网不好时，页面出现{{}}源代码，样式中需配合使用[v-cloak]{ display:none} -->
  <div id="app" v-cloak>
     <Loading v-show="isLoad"></Loading>  
    <router-view />
  </div>
</template>

<script>

  import Loading from "../src/components/Loading"
  import {mapState} from "vuex"

export default {
  name:"APP",
  components:{
    Loading
  },
  computed:{
    ...mapState(["isLoad"])
  }
}
</script>

<style lang="scss">
*{
  margin:0;
  padding:0;
}
html,body,#app{
  width:100%;
  height:100%;
}
ul,li,ol{
  list-style:none;
}
a{
  color:#333;
  text-decoration:none;
}
i,em{
  font-style:normal;
}
[v-cloak]{ 
  display:none
  }
@font-face {
  font-family: 'iconfont';  /* project id 1636357 */
  src: url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.eot');
  src: url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.eot?#iefix') format('embedded-opentype'),
  url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.woff2') format('woff2'),
  url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.woff') format('woff'),
  url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.ttf') format('truetype'),
  url('http://at.alicdn.com/t/font_1636357_g6v1d8du0bk.svg#iconfont') format('svg');
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
