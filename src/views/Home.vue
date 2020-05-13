<template>
  <div class="home">
    <div class="top-box">
      <div class="logo-box">
        <div class="logo">
          <span class="span0">
            <i>&#xe60d;</i>
          </span>
          云音乐
        </div>
        <div class="app-btn">下载APP</div>
      </div>
      <div class="tab-box">
        <ul>
          <li v-for="(item,index) in list" :key="index" >
            <span :class="current==index?'cur':''" @click="current=index" v-text="item.title"></span>
          </li>    
        </ul>
      </div>
    </div>
    <div class="tab-content">
      <keep-alive>
           <component :is="list[current].comp"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Recommend from '../components/Recommend'
import Hot from '../components/Hot'
import Search from '../components/Search'

export default {
  name: "home",
  data(){
    return{
      current:0,
      list:[
          {title:"推荐歌单",comp:"Recommend"},
          {title:"热歌榜",comp:"Hot"},
          {title:"搜索",comp:"Search"},
    ]
    }
     
  },
  components: {
    Recommend,
    Hot,
    Search
  }
};
</script>

<style lang="scss" scoped>
.home{
  width:100%;
  overflow:hidden;
  .top-box{
    width:100%;
    z-index:5;
    position:fixed;
    top:0;
    left:0;
    .logo-box{
      width:100%;
      height:160px;
      padding:0 20px;
      box-sizing:border-box;
      display:flex;
      justify-content: space-between;
      align-items:center;
      background-color:#d43c33;
      .logo{
        font-weight:400;
        color:#fff;
         font-size:36px;
        .span0{
          display:inline-block;
          width:40px;
          height:40px;
          border-radius:50%;
          background-color:#fff;
            i{
              font-family:"iconfont";
              font-style:normal;
              color:#d43c33;
              font-weight:600;
              font-size:35px;
            }
        }
        
      }
      .app-btn{
        background-color:#fff;
        color:#d43c33;
        border-radius:37.5%/100%;
        padding:15px 30px;
      }

    }
    .tab-box{
      width:100%;
      height:80px;
      box-sizing: border-box;
      background-color:#fff;
      ul{
         display:flex;
         justify-content: space-around;
         align-items: center;
         flex:1;
         border-bottom:1px solid #eee;
          li{
           padding:0px 30px;
           font-size:30px;
           span{
             display:inline-block;
             padding:20px 10px;
             border-bottom:4px solid transparent;
             &.cur{
               border-bottom:4px solid #d43c33;
              }
           }
            
         } 
      } 
    }
  }
  .tab-content{
    margin-top:240px;
  }

}

</style>
