<template>
  <div class="play">
    <div class="bg_covers" :style="{'background-image':`url(${this.$route.query.picUrl})`}"></div>
    <div class="main">
      <div class="main_title">
        <div class="logo">
          <i>
            <img src="../assets/logo1.png" alt />
          </i>
          <span>网易云音乐</span>
        </div>
      </div>
      <div class="main_circle">
        <div class="circle_bg">
          <div class="bg_box" :style="{'background-image':`url(${bg_co})`}">
            <div
              class="img_box"
              @click="toPause(flag=!flag)"
              :style="{'animation-play-state':flag?'running':'paused'}"
            >
              <img :src="this.$route.query.picUrl" alt />
            </div>
            <audio :src="`${url}`" id="myMusic" ref="audio" @timeupdate="currentTimes"></audio>
            <i @click="toStart(flag=!flag)" v-show="!flag">&#xe623;</i>
          </div>
        </div>
      </div>
      <div class="main_line">
        <img src="../assets/needle-ip6.png" alt />
      </div>
      <div class="main_words">
        <div class="words_title">
          <span>{{obj_name.name}}-</span>
          <i v-for="(item,index) in singer" v-text="index>0?`/${item.name}`:`${item.name}`" :key="index"></i>
        </div>
        <div class="words_content">
          <p>{{curWords}}</p>
          <p class="next_p">{{nextWords}}</p> 
        </div>
      </div>
      <div class="main_more">
        <p>查看完整歌词 ></p>
        <span>&#xe61a;</span>
      </div>
    </div>
    <div class="play_foot">
      <div class="open">打开</div>
      <div class="down">下载</div>
    </div>
    <div class="toHome" @click="toHome">
      <i>&#xe68b;</i>
    </div>
  </div>
</template>

<script>
import Api from "../allAxios";

var bg_co = require("../assets/disc.png");

export default {
  name: "MusicPlay",
  data() {
    return {
      flag: false,
      obj: {},
      url: "",
      bg_co: bg_co,
      audioUrl: "",
      obj_name:{},
      singer:'',
      list:[],
      curWords:'',
      nextWords:'',
     
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

    let data_MusicWords = JSON.parse(storage.get(ids + "_words"));
    let data_songUrl = JSON.parse(storage.get(ids + "_songUrl"));
    let data_songNames = JSON.parse(storage.get(ids + "_songNames"));
    var ids = this.$route.query.id;
    if (!data_MusicWords | !data_songUrl | !data_songNames) {
      // 歌词接口
      Api(`/lyric?id=${ids}`)
        .then(res => {
          console.log(res);
          var str = res.lrc.lyric;
          // console.log(str);
          //将字符串分割成数组
          var strArr=str.split('\n');
          console.log(strArr)
          for (let i of strArr){
             //对数组的每项里的时间，根据[]的索引进行截取 slice("开始索引","结束索引") 结束索引取结束索引的前一个
              var t=i.slice(i.indexOf("[")+1,i.indexOf("]"));
              // console.log(t)
              //将分钟转换成秒，保留三位小数
              // toFixed() 方法可把 Number 四舍五入为指定小数位数的数字
              var time=(t.split(":")[0] * 60+parseFloat(t.split(":")[1])).toFixed(3);
              console.log(time);
              if(time){
                this.list.push({
                 times:time,
                 words:i.slice(i.indexOf(']')+1,i.length)
                })
                console.log(this.list)
              }
          }
          storage.set(ids + "_words", JSON.stringify(res.lrc.lyric));
        })
        .catch(err => {
          console.log(err);
        });

      //音乐url接口
     /*  Api(`/song/url?id=${ids}`)
        .then(res => {
          // console.log(res.data);
          this.url = res.data[0].url;
          // console.log(this.url);
          storage.set(ids + "_songUrl", JSON.stringify(res.data[0].url));
        })
        .catch(err => {
          console.log(err);
        });
 */

     //专辑内容接口
      /*    Api(`/album?id=${ids}`)
        .then(res => {
          console.log("专辑:",res);
          //  this.obj_name= res.songs[0];
          //  this.singer=res.songs[0].ar;
          // storage.set(ids + "_songNames", JSON.stringify(res.songs[0]));
        })
        .catch(err => {
          console.log(err);
        });
    */

      //歌曲详情接口
      Api(`/song/detail?ids=${ids}`)
        .then(res => {
          this.url=`https://music.163.com/song/media/outer/url?id=${ids}.mp3`
          // console.log(res.songs[0]);
           this.obj_name= res.songs[0];
           this.singer=res.songs[0].ar;
          storage.set(ids + "_songNames", JSON.stringify(res.songs[0]));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.obj = data_MusicWords;
      this.url = data_songUrl;
      this.obj_name=data_songNames;
    }
  },
  methods: {
    toStart() {
      this.$refs.audio.play();
    },
    toPause() {
      this.$refs.audio.pause();
    },
    toHome() {
      this.$router.push({
        path: "/"
      });
    },
    currentTimes(){
      var currentT=this.$refs.audio.currentTime;
      console.log(currentT)
      for(let i in this.list){
        if(currentT>=this.list[i].times){
          if(this.curWords!=this.list[i].words&&this.list[i].words){
            this.curWords=this.list[i].words;
            console.log(typeof(i));
            this.nextWords=this.list[Number(i)+1].words;
          }
        }
      }
     },
  }
};
</script>

<style lang="scss" scoped>
@mixin background {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  filter: blur(40px);
  transform: scale(1.5);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
@mixin afters {
  content: "";
  width: 100%;
  height: 100%;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.25);
}
@mixin back {
  background: {
    size: cover;
    repeat: no-repeat;
    position: center;
  }
}
@mixin flexs {
  display: flex;
  justify-content: center;
  align-items: center;
}
@mixin imgs {
  max-width: 100%;
  max-height: 100%;
  height:100%;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.pause {
  animation-play-state: paused;
}

.play {
  width: 100%;
  height: 100%;
  z-index: 50;
  position: relative;
  overflow: hidden;
  padding: 0px 20px 20px;
  box-sizing: border-box;
  .bg_covers {
    @include background;
    &::after {
      @include afters;
      position: absolute;
      z-index: 0;
    }
  }
  .main {
    z-index: 999;
    width: 100%;
    height: 90vh;
    position: relative;
    .main_title {
      width: 100%;
      height: 5vh;
      padding-top: 40px;
      .logo {
        height: 100%;
        width: 25vw;
        display: flex;
        justify-content: space-around;
        align-items: center;
        i {
          font-style: normal;
          display: inline-block;
          width: 35px;
          height: 35px;
          img {
            @include imgs;
          }
        }
        span {
          color: #fff;
          font-size: 28px;
        }
      }
    }
    .main_circle {
      width: 100%;
      margin-top: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .circle_bg {
        width: 80vw;
        height: 80vw;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.1);
        @include flexs;
        // opacity:0.1;
        .bg_box {
          width: 80vw;
          height: 80vw;
          border-radius: 50%;
          position: relative;
          @include back;
          @include flexs;
          .img_box {
            width: 51vw;
            height: 51vw;
            border-radius: 50%;
            margin-left: 10px;
            overflow: hidden;
            animation: rotate 15s linear infinite;
            animation-play-state: paused;

            img {
              @include imgs;
            }
          }
          i {
            font-family: "iconfont";
            font-size: 150px;
            position: absolute;
            opacity: 0.5;
          }
        }
      }
    }
    .main_line {
      position: absolute;
      top: 0;
      left: 40%;
      height: 22vh;
      width: auto;
      img {
        @include imgs;
      }
    }
    .main_words {
      width: 100%;
      height: 20vh;
      overflow: hidden;
      // text-overflow: clip;
      // display: -webkit-box;
      // -webkit-line-clamp: 3;
      // -webkit-box-orient: vertical;
      margin-top: 25px;
      text-align: center;
      .words_title {
        span {
          font-size: 36px;
          color: #fefefe;
        }
        i {
          font-size: 32px;
          color: hsla(0, 0%, 100%, 0.6);
        }
      }
      .words_content {
        font-size: 32px;
        color: #fefefe;
        margin-top: 40px;
        // overflow: hidden;
        // text-overflow: clip;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
        height: 100px;
        p {
          height: 60px;
          line-height: 60px;
          &.next_p{
            color: hsla(0, 0%, 100%, 0.6);
          }
        }
      }
    }
    .main_more {
      width: 100%;
      color: hsla(0, 0%, 100%, 0.4);
      text-align: center;
      margin-top: 30px;
      p {
        font-size: 30px;
      }
      span {
        font-family: "iconfont";
        font-size: 50px;
        margin-top: 15px;
        display: block;
      }
    }
  }
  .play_foot {
    width: 100%;
    padding: 30px 0px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 36px;
    .open {
      border: 2px solid #ff3a3a;
      width: 45vw;
      padding: 15px 0px;
      border-radius: 50px;
      text-align: center;
      color: #ff3a3a;
    }
    .down {
      border: 2px solid #ff3a3a;
      width: 45vw;
      padding: 15px 0px;
      border-radius: 50px;
      text-align: center;
      background-color: #ff3a3a;
      color: #fff;
    }
  }
  .toHome {
    width: 100px;
    height: 50px;
    position: fixed;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color:red;
    z-index: 999;

    i {
      font-family: "iconfont";
      transform: rotateY(180deg);

      color: #fff;
    }
  }
}
</style>