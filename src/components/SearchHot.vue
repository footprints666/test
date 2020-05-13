<template>
  <div class="SearchHot">
    <div class="search_hot">
      <h4>热门搜索</h4>
      <ul>
        <li v-for="(items,index) in list" :key="index" @click="toMatch(`${items.first}`)"> {{items.first}}</li>      
      </ul>
    </div>
    <div class="searchHistory" >
      <ul>
        <li ref="lis" v-for="(item,index) in history"  :key="index" @click="send3(`${item}`)" >
          <em >&#xe625;</em>
          <p >
            <span class="his">{{item}}</span>
            <!-- 阻止事件冒泡 .stop -->
            <i @click.stop="close(current=index)" >&#xe60a;</i>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @click="send3(`${item}`)"

import Api from "../allAxios"
// import {mapState, mapMutations} from 'vuex'

export default {
  name: "SearchHot",
  data() {
    return {
      list:[],
      flag:false,
      current:""

    };
  },
  created(){
    let storage = {};
    storage.get = key => {
      return localStorage.getItem(key);
    };
    storage.set = (key, val) => {
      return localStorage.setItem(key, val);
    };

     let data_hotSearch = JSON.parse(storage.get("hotSearch"));
  
     if (!data_hotSearch) {
      //热门搜索接口
      Api(`/search/hot`)
        .then(res => {
          this.list=res.result.hots;
          storage.set("hotSearch", JSON.stringify(res.result.hots));
        })
         .catch(err => {
         console.log(err);
       });

     } else {
      this.list = data_hotSearch;
    }

  },
  props:{
    history:{
      type:Array,
    }
  },
  methods:{
     send3(val){
        //子传父
       this.$emit('changeCom',"2")
       //单个值提交
       this.$store.commit("edit",val)

    }, 
    // ...mapMutations(['edit']),
    close(){
       this.flag=true;  
     },
    toMatch(vals){
      //单个值提交
       this.$store.commit("edit",vals);
       console.log(vals)
          //子传父
       this.$emit('changeCom',"2")
    },
    close(){
      //splice 替换元素 参数分别是从哪开始替换，替换个数，替换的新元素，若未写替换的新元素，视为删除
      this.history.splice(this.current,1);

    }

  },
  
};
</script>

<style lang="scss" scoped>

@mixin flexs {
  display: flex;
  justify-content: center;
  align-items: center;
}
@mixin flex_space {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.SearchHot {
    width:100%;
    height:100%;
  .search_hot {
    width: 100%;
    height: 350px;
    h4 {
      font-size: 24px;
      color: #666;
      padding: 20px 30px 20px;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      box-sizing: border-box;
      li {
        @include flexs;
        padding: 10px 30px;
        box-sizing: border-box;
        font-size: 28px;
        color: #333;
        border: 1px solid #d3d4da;
        border-radius: 40px;
        margin-right: 10px;
        margin-bottom: 15px;
      }
    }
  }
  .searchHistory{
    ul{
      width:100%;
      li{
        @include  flex_space;
        padding:0px 30px;
        box-sizing:border-box;
        &:nth-child(n+9){
          display:none;
        }
        &.closes{
          display:none;
        }
        em{
          font-family:"iconfont";
          color:#999;
          font-size:40px;
          width:10%;
        }
        p{
          border-bottom:1px solid #eee;
          padding:30px 0px;
          font-size:28px;
          color:#333;
          width:90%;
          @include flexs;
          span{
            display:inline-block;
            width:90%;
          }
          i{
            font-family:"iconfont";
            color:#999;
            font-size:25px;
            width:10%;
          }
        }

      }
    }
  }
}
</style>