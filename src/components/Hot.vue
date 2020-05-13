<template>
  <div class="hot">
    <div class="hot_bg" :style="{'background-image':`url(${bg})`}">
      <div class="img_box" :style="{'background-image':`url(${bg_img})`}"></div>
      <div class="text">
        <span>更新日期：</span>
        <i>{{ this.obj_hot.updateTime| toDate()}}</i>
      </div>
    </div>
    <div class="songList">
       <ul>
        <li v-for="(item,index) in this.obj_hot.tracks" :key="index"  @click="toPlay(item.id,item.al.picUrl)">
          <div class="song_left" v-text="index<=9?`0${index+1}`:`${index+1}`"></div>
          <div class="box0">
            <div class="song_center">
              <p>{{ item.name}}</p>
              <span>
                <em
                  v-for="(items,index) in item.ar"
                  :key="index"
                  v-text="index>0?`/${items.name}`:`${items.name}`"
                >歌手</em> -
                <i>{{ item.al.name }}</i>
              </span>
            </div>
            <div class="song_right">&#xe623;</div>
          </div>
        </li>
      </ul> 
    </div>
    <div class="more">
        <p>查看完整榜单 ></p>
    </div>
  </div>
</template>

<script>
import Api from "../allAxios";
var bg = require("../assets/hot_music_bg_2x.jpg");
var bg_img = require("../assets/index_icon_2x.png");

export default {
  name: "Hot",
  data() {
    return {
      bg: bg,
      bg_img: bg_img,
      obj_hot: "",
      
    };
  },
  created() {
    let storage = {};
    storage.get = key => {
      return localStorage.getItem(key);
    };
    storage.set = (key, val) => {
      return localStorage.setItem(key, val);
    };

    let data_hot = JSON.parse(storage.get("hot"));
    if (!data_hot) {
      //热歌榜接口
      Api(`/top/list?idx=1`)
        .then(res => {
          console.log(res.playlist);
          this.obj_hot = res.playlist;
          storage.set("hot", JSON.stringify(res.playlist));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.obj_hot = data_hot;
    }
  },
  filters: {
    toDate(val) {
      var now = new Date(val),
        m = now.getMonth() + 1,
        d = now.getDate();
      console.log(m, d);
      var m1 = m <= 9 ? `0${m}` : `${m}`;
      var d1 = d <= 9 ? `0${d}` : `${d}`;
      return `${m1}月${d1}日`;
    }
  },
  methods:{
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
@mixin imgs {
  max-width: 100%;
  max-height: 100%;
}
@mixin backgrounds {
  background: {
    repeat: no-repeat;
    size: cover;
  }
}
@mixin titles {
  width: 100%;
  height: 46px;
  line-height: 46px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 24px;
  color: #666;
  padding-left: 30px;
}
@mixin flexs {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hot {
  width: 100%;
  height: 100%;
  .hot_bg {
    width: 100%;
    height: 25vh;
    padding: 40px;
    box-sizing: border-box;
    .img_box {
      width: 50vw;
      height: 70%;
      @include backgrounds;
      background-position: -54px -60px;
    }
    .text {
      color: hsla(0, 0%, 100%, 0.8);
      font-size: 24px;
    }
  }
  .songList {
    width: 100%;
    ul {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      li {
        &:nth-child(n+21){
            display:none;
        }
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0 0;
        .song_left {
          font-size: 34px;
          color: #999;
          width: 10%;
        }
        .box0 {
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 90%;
          padding-bottom: 20px;
          .song_center {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 34px;
              color: #333;
            }
            span {
              font-size: 24px;
              color: #888;
            }
          }
          .song_right {
            width: 10%;
            font-family: "iconfont";
            font-size: 60px;
            opacity: 0.5;
          }
        }
      }
    }
  }
  .more{
      width:100%;
      height:8vh;
      @include flexs;
      p{
          font-size:28px;
          color:#999;
      }
  }
}
</style>