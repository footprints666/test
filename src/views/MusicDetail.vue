<template>
  <div class="MusicDetail">
    <div class="detail_top" id="tops">
      <div class="bg_cover" :style="{'background-image':`url(${obj.coverImgUrl})`}"></div>
      <div class="left-box">
        <img :src="obj.coverImgUrl" alt />
        <span>
          <i>&#xe616;</i>
          <small
            v-text="obj.playCount>10000?`${Math.round(obj.playCount/10000*10)/10}万`:obj.playCount"
          ></small>
        </span>
        <p>歌单</p>
      </div>
      <div class="right-box">
        <h3>{{obj.name}}</h3>
        <div class="right-box-bottom">
          <div class="img_box">
            <img :src="`${ peopleUrl}`" alt="" />  
          </div>
          <span >{{nicknames}}</span> 
        </div>
      </div>
    </div>
    <div class="detail_description">
      <div class="detail_tag">
        <span>标签：</span>
        <em v-for="(item,index) in obj.tags" :key="index" v-text="item"></em>
      </div>
      <div id="detail_desc" :class="flag?'':'ellips'">
        <div>
          <!-- <div :class="flag?'ellips':''"> -->
          <span>简介：</span>
          <i v-for="(items,index) in list" :key="index">
            <em v-text="items"></em>
            <br />
          </i>
        </div>
        <div :class="flag?'btns rotates':'btns '" @click="flag=!flag">
          <i>&#xe635;</i>
        </div>
      </div>
    </div>
    <div class="songList">
      <div class="songTitle">歌曲列表</div>
      <ul>
        <li v-for="(item,index) in obj.tracks" :key="index" @click="toPlay(item.id,obj.coverImgUrl)">
          <div class="song_left">{{index+1}}</div>
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
    <div class="comment">
      <div class="comment_title">
        最新评论
        <span v-text="`(${obj.commentCount})`"></span>
      </div>
      <div class="comment_list">
        <ul>
          <li v-for="(item,index) in list1" :key="index">
            <div class="list_left">
              <div class="img_combox">
                <img :src="item.user.avatarUrl" alt />
              </div>
            </div>
            <div class="list_right">
              <div class="combox1">
                <div class="combox1_left">
                  <p>{{item.user.nickname}}</p>
                  <span>{{ item.time | toDate()}}</span>
                </div>
                <div class="combox1_right">
                  <em v-text="item.likedCount>0?`${item.likedCount}`:``">{{item.likedCount}}</em>
                  <i>&#xe611;</i>
                </div>
              </div>
              <div
                class="combox2"
                v-html="item.beReplied.length===0?`${item.content}`:`回复<a style='color:#507daf''>@${item.beReplied[0].user.nickname}</a> ：   ${item.content}`"
              ></div>
              <div
                class="combox3"
                v-show="item.beReplied.length!==0"
                v-text="item.beReplied.length===0?`${item.content}`:`@${item.beReplied[0].user.nickname}：   ${item.beReplied[0].content}`"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 未生效 -->
<!--     <a class="toTop" @click="toTop" href="#tops">
      <i>&#xe61e;</i>
    </a> -->
    <div class="toHome" @click="toHome">
      <i>&#xe68b;</i>
    </div>
  </div>
</template>

<script>
import Api from "../allAxios";

export default {
  name: "MusicDetail",
  data() {
    return {
      current: 0,
      obj: {},
      list: [],
      flag: false,
      list1: [],
      obj2: {},
      peopleUrl:"",
      nicknames:""
    };
  },
  filters: {
    toDate(val) {
      let d = new Date(val),
        hour = d.getHours(),
        minute = d.getMinutes(),
        now = new Date(),
        hour1 = now.getHours();
      return hour > hour1 ? `昨天${hour}:${minute}` : `${hour}:${minute}`;
    }
  },
  created() {
    let storage = {};
    storage.get = key => {
      return localStorage.getItem(key);
    };
    storage.set = (key, val) => {
      return localStorage.setItem(key, val);
    };

    let data_detailMusic = JSON.parse(storage.get(id));
    let data_comment = JSON.parse(storage.get(id + "_com"));
    var id = this.$route.query.id;
    console.log(id);
    if (!data_detailMusic | !data_comment) {
      //歌单详情接口
      Api(`/playlist/detail?id=${id}`)
        .then(res => {
          console.log(res.playlist);
          this.obj = res.playlist;
          this.peopleUrl=res.playlist.creator.avatarUrl;
          this.nicknames=res.playlist.creator.nickname;
          console.log(this.nicknames)
          var str = res.playlist.description;
           this.list = str.split("\n");
          // console.log(this.list);
          storage.set(id, JSON.stringify(res.playlist));
        })
        .catch(err => {
          console.log(err);
        });

      //歌单评论接口
      Api(`/comment/playlist?id=${id}&& limit=20`)
        .then(res => {
          // console.log(res);
          this.list1 = res.comments;
          this.obj2 = res.comments[this.current].beReplied[0];
          // console.log(this.obj2);
          // console.log(res.comments[0].beReplied[0].user.nickname);
          storage.set(id + "_com", JSON.stringify(res.comments));
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.obj = data_detailMusic;
      this.list1 = data_comment;
    }
  },
  methods: {
    rotates() {
      this.css.transform = "rotateX(180deg)";
    },
    toTop() {},
    toHome() {
      this.$router.push({
        path: "/"
      });
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
@mixin titles {
  width: 100%;
  height: 46px;
  line-height: 46px;
  background: rgba(0, 0, 0, 0.05);
  font-size: 24px;
  color: #666;
  padding-left: 30px;
}

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
  z-index: 1;
}
@mixin afters {
  content: "";
  width: 100%;
  height: 100%;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.25);
}

.MusicDetail {
  width: 100%;
  height: 100%;
  .detail_top {
    width: 100%;
    height: 380px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 30px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    .bg_cover {
      @include background;
      &::after {
       @include afters;
      }
    }
    .left-box {
      min-width: 260px;
      height: 260px;
      margin-right: 20px;
      position: relative;
      z-index: 2;
      img {
        max-width: 100%;
        max-height: 100%;
      }
      span {
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        text-align: right;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.1);
        i {
          font-style: normal;
          font-family: "iconfont";
        }
        small {
          font-size: 24px;
        }
      }
      p {
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background-color: rgba(70, 6, 6, 0.8);
        border-radius: 0 20px 20px 0;
        font-size: 12px;
        position: absolute;
        top: 20px;
      }
    }
    .right-box {
      z-index: 2;
      text-align: left;
      padding: 40px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      h3 {
        font-size: 34px;
        font-weight: normal;
        color: #efef;
      }
      .right-box-bottom {
        width: 100%;
        height: 180px;
        display: flex;
        // justify-content: space-around;
        align-items: center;
        .img_box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          // background-color:red;
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        span {
          font-size: 30px;
          color: #fff;
          padding-left: 20px;
        }
      }
    }
  }
  .detail_description {
    width: 100%;
    padding: 20px 30px;
    line-height: 50px;
    position: relative;
    box-sizing: border-box;
    color: #666;
    .detail_tag {
      width: 100%;
      margin-bottom: 20px;
      span {
        font-size: 28px;
      }
      em {
        font-size: 24px;
        border-radius: 30px;
        border: 2px solid #eee;
        padding: 10px 20px;
        margin-right: 20px;
        font-style: normal;
      }
    }
    #detail_desc {
      width: 100%;
      font-size: 28px;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      &.ellips {
        -webkit-line-clamp: 3;
      }
      div {
        width: 100%;
        i {
          font-style: normal;
          em {
            font-style: normal;
          }
        }
      }
      .btns {
        text-align: right;
        padding: 0 30px;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        right: 30px;
        &.rotates {
          transform: rotateX(180deg);
        }
        i {
          font-style: normal;
          font-family: "iconfont";
          display: inline-block;
          font-size: 40px;
          color: #999;
          opacity: 0.6;
        }
      }
    }
  }
  .songList {
    width: 100%;
    .songTitle {
      @include titles;
    }
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
            width:10%;
            font-family: "iconfont";
            font-size: 60px;
            opacity: 0.5;
          }
        }
      }
    }
  }
  .comment {
    width: 100%;
    .comment_title {
      @include titles;
    }
    .comment_list {
      width: 100%;
      ul {
        width: 100%;
        padding: 0 30px;
        box-sizing: border-box;
        li {
          &:nth-child(n+11){
            display:none;
          }
          display: flex;
          justify-content: space-between;
          // align-items: center;
          padding: 20px 0;
          .list_left {
            width: 10vw;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .img_combox {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              overflow: hidden;
              background-color:rgba(0, 0, 0, 0.1);
              img {
                max-width: 100%;
                max-height: 100%;
              }
            }
          }
          .list_right {
            width: 90vw;
            .combox1 {
              width: 100%;
              display: flex;
              justify-content: space-between;
              // align-items: center;
              .combox1_left {
                width: 90%;
                p {
                  font-size: 28px;
                  color: #666;
                }
                span {
                  font-size: 18px;
                  color: #999;
                }
              }
              .combox1_right {
                width: 10%;
                text-align: right;
                em {
                  font-size: 22px;
                  color: #999;
                  margin-right: 10px;
                }
                i {
                  font-family: "iconfont";
                  opacity: 0.5;
                  font-size: 40px;
                }
              }
            }
            .combox2 {
              font-size: 30px;
              color: #333;
              margin: 20px 0;
            }
            .combox3 {
              width: 98%;
              // padding:10px 20px;
              border: 2px solid #eee;
              padding: 20px;
              box-sizing: border-box;
              color: #888;
              font-size: 28px;
            }
          }
        }
      }
    }
  }
  .toTop {
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 50px;
    right: 30px;
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-family: "iconfont";
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