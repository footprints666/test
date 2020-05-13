<template>
  <div class="SearchList">
    <div class="searchTitle" v-text='`搜索："${parents}"`' @click="send(`${parents}`)" ></div>
    <ul>
       <li v-for="(item,index) in searchList" :key="index"  @click="send2(`${item.name}`)">
        <i>&#xe617;</i>
        <span v-text="`${item.name}`"></span>
      </li> 
    </ul>
  </div>
</template>

<script>
import Api from "../allAxios";


export default {
  name: "SearchList",
  data() {
    return {
      searchList: [],
      a:"",
      b:""

    };
  },
  // watch:{
  //   parents:function(oldval,newval){
  //     console.log("旧:"+oldval,"新:"+newval)
  //     this.a=oldval;
  //     this.b=newval;
  //   }
  // },
  props: {
    parents: {
      type: String
    }
  },
  updated: function(){
     
       let storage = {};
       storage.get = key => {
         return localStorage.getItem(key);
       };
       storage.set = (key, val) => {
         return localStorage.setItem(key, val);
       };
   
       let data_searchList = JSON.parse(storage.get(`"${this.parents}"`));
       //  console.log(this.parents);
        if (!data_searchList) {
         //搜索关键词接口
         // Api(`/search/multimatch?keywords="${this.parents}"`)
         Api(`/search/suggest?keywords="${this.parents}"&type=mobile`)
           .then(res => {
             // console.log(this.parents);
             // console.log(res); 
                // if(this.a==this.b){
                //   return;
                // }
                this.searchList = res.result.songs;
                storage.set(`${this.parents}`, JSON.stringify(res.result.songs)); 
           })
           .catch(err => {
             console.log(err);
           });
       } else {
          this.searchList = data_searchList;
        }
    
    
  }, 
  methods:{
     send(txt1){
      //单个值提交
      this.$store.commit("edit",txt1)
      //子传父
      this.$emit('changeCom',"2")

    },
    send2(txt2){
       //单个值提交
     this.$store.commit("edit",txt2)
       //子传父
      this.$emit('changeCom',"2")

    }
  }
};
</script>

<style lang="scss" scoped>
.SearchList {
  width: 100%;
  height: 100%;
  .searchTitle {
    font-size: 30px;
    color: #507daf;
    padding: 30px;
    border-bottom: 1px solid #eee;
  }
  ul {
    width: 100%;
    li {
      &:nth-child(n+7){
        display:none;
      }
      width: 100%;
      padding: 0px 30px;
      color: #333;
      font-size: 30px;
      i {
        display: inline-block;
        width: 7%;
        font-family: "iconfont";
      }
      span {
        display: inline-block;
        width: 90%;
        padding: 30px 0px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>