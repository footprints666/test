<template>
  <div id="recommend">
    <div class="recom-box1">
      <h2>推荐歌单</h2>
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="detail(item.id)">
          <div class="img_box">
            <img :src="item.picUrl" alt="logo" />
            <span>
              <i>&#xe616;</i>
              <small v-text="item.playCount>10000?`${Math.round(item.playCount/10000*10)/10}万`:item.playCoun"></small>
            </span>
          </div>
          <p>{{item.name}}</p>
        </li>
      </ul>
       <h2>最新音乐</h2>
       <ol>
         <li v-for="(item,index) in list1" :key="index" @click="toPlay(item.id,item.picUrl)">
           <div class="comNew_left">
             <p>{{ item.name }}</p>
             <span><i v-for="(items,index) in item.song.artists" v-text="index>0?`/${items.name}`:`${items.name}`" :key="index"></i> - {{ item.name }}</span>
           </div>
           <div class="comNew_right">
             <em>&#xe623;</em>
           </div>
         </li>
       </ol>

    </div>
    <div class="recom-box2" :style="{'background':`url(${bg}) center no-repeat`}">
       <div class="icon_logo" :style="{'background-image':`url(${bg_logo})`}"></div>
       <p>打开APP，发现更多好音乐 ></p>
       <small v-html="`网易公司版权所有&copy;1997-${time}  杭州乐读科技有限公司运营`"></small>
    </div>
    
  </div>
</template>

<script>
import Api from "../allAxios"

var bg=require("../assets/recommand_bg_2x.png");
var bg_logo=require("../assets/网易云音乐-01.png");
let data_recomMusic,data_recomNew;
export default {
  name: "Recommend",
  data(){
      return {
          list:[],
          list1:[],
          time:new Date().getFullYear(),
          bg:bg,
          bg_logo:bg_logo,
          current:0       
      }
  },
  created(){
    /* const baseUrl="http://musicapi.leanapp.cn";
    let axios=this.$axios;
    
    //分开写
    let storage={};
    storage.get=key=>{
      return localStorage.getItem(key);
    }
    storage.set=(key,val)=>{
      return localStorage.setItem(key,val);
    }
     
    let data_recomMusic=JSON.parse(storage.get("recom_music"));
    if(!data_recomMusic){
      axios.get(baseUrl+"/personalized?limit=6")
      .then(res=>{
          // console.log(res.data.result);
          this.list=res.data.result;
          storage.set("recom_music",JSON.stringify(res.data.result));     
      })
      .catch(err=>{
          console.log(err);
      })
    }else{
       this.list=data_recomMusic;
    }
    
    let data_recomNew=JSON.parse(storage.get("recom_new"));
    if(!data_recomNew){
       axios.get(baseUrl+"/personalized/newsong")
      .then(res=>{
        console.log(res.data.result);
        this.list1=res.data.result;
        storage.set("recom_new",JSON.stringify(res.data.result));
      })
      .catch(err=>{
        console.log(err);
      })
    }else{
       this.list1=data_recomNew          
    }
      */

     //引入 allAxios 写法1：
    /* let storage={};
    storage.get=key=>{
      return localStorage.getItem(key);
    }
    storage.set=(key,val)=>{
      return localStorage.setItem(key,val);
    }

     let data_recomMusic=JSON.parse(storage.get("recom_music"));
    if(!data_recomMusic){
      Api("/personalized?limit=6").then(res=>{
       this.list=res.data.result;
        storage.set("recom_music",JSON.stringify(res.data.result));    
       }).catch(err=>{
        console.log(err);
        })
    }else{
       this.list=data_recomMusic;
    } 
     */
    //引入 allAxios 写法2：
    let storage={};
    storage.get=key=>{
      return localStorage.getItem(key);
    }
    storage.set=(key,val)=>{
      return localStorage.setItem(key,val);
    }

    let data_recomMusic=JSON.parse(storage.get("recom_music"));
    let data_recomNew=JSON.parse(storage.get("recom_new"));
    if(!data_recomMusic|!data_recomNew){
      //推荐歌单和最新音乐接口
      Promise.all([ Api("/personalized?limit=6"),Api("/personalized/newsong")]).then(res=>{
          console.log(res);
          this.list=res[0].result;
          this.list1=res[1].result;
          console.log(this.list1)
          storage.set("recom_music",JSON.stringify(res[0].result));     
          storage.set("recom_new",JSON.stringify(res[1].result));
        }).catch(err=>{
          console.log(err);
        })
    }else{
      this.list=data_recomMusic;
      this.list1=data_recomNew;
    }

  },
  methods:{
    detail(id){
      this.$router.push({
        path:"/music",
         query:{
          id:id,
        } 
      })
    },
    toPlay(tag,picUrl){
      this.$router.push({
        path:"/play",
        query:{
          id:tag,
          picUrl:picUrl,
        }
      })
    }
  }

};
</script>

<style lang="scss" scoped>
#recommend {
  padding-top: 40px;
  width: 100%;
  .recom-box1 {
    width: 100%;
    h2 {
      // position: relative;
      padding-left: 18px;
      margin-bottom: 28px;
      font-size: 34px;
      height: 40px;
      line-height: 40px;
      font-weight: 400;
      border-left: 4px solid #d33a31;
    }
    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding:0 2px;
      box-sizing:border-box;
      margin-bottom:40px;
      li {
        width: 33.3%;
        padding-right:10px;
        box-sizing:border-box;
        margin-bottom:40px;
        &:nth-child(3),&:nth-child(6){
             padding-right:0px;
        }

        .img_box {
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
          span {
            display: inline-block;
            width: 100%;
            height: 40px;
            line-height:40px;
            position: absolute;
            top: 0;
            left: 0;
            text-align:right;
            color:#fff;
            i {
              font-style: normal;
              font-family: "iconfont";
            }
            small{
                font-size:24px;
            }
          }
        }
         p{
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         overflow: hidden;
         padding: 12px 4px 0 12px;
         min-height: 60px;
         line-height: 1.2;
         font-size: 26px;
         
        }
      }
    }
    ol{
      width:100%;
      li{
        width:100%;
        display:flex;
        padding:20px 20px;
        box-sizing:border-box;
        justify-content: space-between;
        align-items: center;
        border-bottom:1px solid #eee;
        .comNew_left{
          width:80%;
          p{
            font-size:34px;
          }
          span{
            font-size:24px;
            color:#888;
            i{
              font-style:normal;
            }
          }
        }
        .comNew_right{
          width:20%;
          text-align:right;
          em{
            font-family:"iconfont";
            font-style:normal;
            font-size:50px;
            opacity:0.6;
          }
        }
      }
    }
  }
  .recom-box2{
    padding-top:120px;
    padding-bottom:20px;
    height:280px;
    display:flex;
    background-repeat:no-repeat;
    background-size:contain;
    flex-direction: column;
    justify-content: space-around;
    align-items:center;
    .icon_logo{
      width:460px;
      height:88px;
      background-repeat:no-repeat;
      background-size:cover;
      background-position:0 -180px;
      z-index:20;
    }
    p{
      color:#d33a31;
      font-size:32px;
      padding:20px 100px;
      border: 1px solid #d33a31;
      border-radius:76px;
    }
    small{
      font-size:12px;
      color:#888;
    }

  }
}
</style>