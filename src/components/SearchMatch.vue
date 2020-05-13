<template>
  <div id="SearchMatch">
     <!-- <div>我是SearchMatch</div>  -->
    <ol>
      <li v-for="(item,index) in listMatch" :key="index" @click="toPlay(item.id,item.artists[0].img1v1Url)">
        <div class="comNew_left">
          <p>{{ item.name }}</p>
          <span>
            <i
              v-for="(items,index) in item.artists"
              v-text="index>0?`/${items.name}`:`${items.name}`"
              :key="index"
            ></i>
            - {{ item.name }}
          </span>
        </div>
        <div class="comNew_right">
          <em>&#xe623;</em>
        </div>
      </li>
    </ol>
    <!-- <div ref="div1" class="div1">{{keywords}}</div> -->
    <div v-text="flag?'暂无搜索结果':''" class="results"></div>  
  </div>
</template>

<script>
import Api from "../allAxios";
// import {mapState} from 'vuex'

export default {
  name: "SearchMatch",
  data() {
    return {
      listMatch: [],
      // keywords:this.parents,
      flag: false,
      lengths: "",
      // result:""
      // results:""
      keywords:"",
    
    };
  },
  props: {
    parents: {
      type: String
    }
  },
  mounted:function(){
    // 兄弟组件通信  有时不确定何时会触发事件，一般会在 mounted 或 created 钩子中来监听
    // 在mounted钩子函数中，把发送过来的数据用$on接收，然后赋值
    // vmson.$on("data-a", val => this.keywords=val);
    // vmson.$on("data-b", val => this.keywords=val);
   /*  vmson.$on("data-c", function(val){
      // console.log(val)
      this.keywords=val;
      console.log(this.keywords);
    });
   */
  },
   
  //此处有待完善
  created: function() {
    let storage = {};
    storage.get = key => {
      return localStorage.getItem(key);
    };
    storage.set = (key, val) => {
      return localStorage.setItem(key, val);
    };
     console.log(this.$store.state.keys)
     let data_searchMatch = JSON.parse(storage.get(`${this.$store.state.keys}_match`));
      // console.log(this.parents);
     if (!data_searchMatch) {
      //搜索接口
      console.log(this.$store.state.keys);
      Api(`/search/suggest?keywords="${this.$store.state.keys}"&type=mobile`)
        .then(res => {
          console.log(res)
          console.log(res.result)
          if(!res.result){
            this.flag=true;
            return;
          }
          this.listMatch = res.result.songs;
        
          storage.set(`${this.$store.state.keys}_match`, JSON.stringify(res.result.songs));
        })
        .catch(err => {
          console.log(err);
        });
     } else {
       this.listMatch = data_searchMatch;
     }    
  },
  methods: {
    toPlay(tag, picUrl) {
      this.$router.push({
        path: "/play",
        query: {
          id: tag,
          picUrl: picUrl
        }
      });
    },
    
  },
  
};
</script>

<style lang="scss" scoped>
#SearchMatch {
  ol {
    width: 100%;
    li {
      width: 100%;
      display: flex;
      padding: 20px 20px;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      .comNew_left {
        width: 80%;
        p {
          font-size: 34px;
        }
        span {
          font-size: 24px;
          color: #888;
          i {
            font-style: normal;
          }
        }
      }
      .comNew_right {
        width: 20%;
        text-align: right;
        em {
          font-family: "iconfont";
          font-style: normal;
          font-size: 50px;
          opacity: 0.6;
        }
      }
    }
  }
  .results{
      font-size:12px;
      color:#888;
      text-align: center;
      padding-top:40px;
    }
}
</style>