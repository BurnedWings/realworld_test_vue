<template>
  <div class="user-view">
    <div class="userHeader"></div>
    <div class="user-container">
      <div class="navbar-container">
        <div class="navbar-bottom">
          <transition name="infoTransition">
            <div v-if="isShowUserInfoNav" class="userInfo-container">
              <img :src="oneUserInfo.image" alt="" />
              <span>{{ oneUserInfo.username }}</span>
            </div>
          </transition>
          <ul>
            <li @click="$router.push({ name: 'userArticle' })">文章</li>
            <li @click="$router.push({ name: 'userTrends' })">动态</li>
            <li @click="$router.push({ name: 'userConcern' })">关注</li>
            <li @click="$router.push({ name: 'userFans' })">粉丝</li>
            <li @click="$router.push({ name: 'userInfo',params:{oneUserInfo} })">个人资料</li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="main-container">
        <div class="left-part">
          <div class="img-container">
            <img :src="oneUserInfo.image" alt="" />
          </div>
          <div class="easyMessageBox">
            <div
              v-loading="!oneUserInfo.username"
              element-loading-background="rgba(0, 0, 0, 0)"
              class="userName"
            >
              {{ oneUserInfo.username }}
            </div>
            <input
              v-if="!isLoginUser"
              class="btn btn-block"
              type="submit"
              value="关注"
            />
            <input
              v-if="isLoginUser"
              class="btn btn-block"
              type="submit"
              value="个人设置"
              @click="toSettingView"
            />
          </div>
        </div>
        <div class="right-part">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const headerNav = document.querySelector(".header");
export default {
  name: "UserView",
  data() {
    return {
      isShowUserInfoNav: false,
      oneUserInfo:{}
    };
  },
  methods: {
    updateHeaderStyle() {
      headerNav.style.position = "absolute";
    },
    clearHeaderStyle() {
      headerNav.style.position = "fixed";
    },
    changeNav() {
      const osTop =
        document.documentElement.scrollTop || document.body.srcollTop;
      if (osTop >= 400) {
        this.isShowUserInfoNav = true;
      } else {
        this.isShowUserInfoNav = false;
      }
    },
    async getUserViewInfo() {
      try {
        await this.$store.dispatch("getOneUserInfo",this.userId);
        this.oneUserInfo=this.$store.state.user.oneUserInfo
      } catch (error) {}
    },
    toSettingView(){
      this.$router.push('/userSetting')
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    },
    
  },
  watch:{
    isLoginUser(){
      this.getUserViewInfo()
    }
  },
  mounted() {
    this.updateHeaderStyle();
    window.addEventListener("scroll", this.changeNav);
    this.getUserViewInfo();
  },
  beforeDestroy() {
    this.clearHeaderStyle();
    this.$store.state.user.oneUserInfo={}
  },
};
</script>

<style lang="less">
.user-view {
  width: 100%;
  height: 100%;
  position: relative;
  .userHeader {
    transition: all 0.5s;
    width: 100%;
    height: 64px;
    background-color: var(--theme_userView);
  }
  .user-container {
    transition: all 0.5s;
    width: 100%;
    background-color: var(--theme_userView);
    .navbar-container {
      z-index: 1;
      background-color: var(--theme_userView);
      transition: all 0.5s;
      width: 100%;
      height: 72px;
      position: sticky;
      top: -24px;
      .navbar-bottom {
        transition: all 0.5s;
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 31px;

        .infoTransition-enter-active,
        .infoTransition-leave-active {
          transition: opacity 0.3s;
        }

        .infoTransition-enter, .infoTransition-leave-to /* .infoTransition-leave-active below version 2.1.8 */ {
          opacity: 0;
        }

        .userInfo-container {
          width: 230px;
          position: relative;
          left: 155px;
          top: -5px;

          img {
            border-radius: 50%;
            width: 32px;
            margin-right: 10px;
          }
          span {
            font-size: 14px;
            font-weight: 600;
          }
        }
        ul {
          width: 70%;
          position: absolute;
          top: -5px;
          right: 10%;
          width: 60%;
          line-height: 24px;
          li {
            display: inline-block;
            margin-left: 10px;
            margin-right: 50px;
            cursor: pointer;
          }
        }
      }
      .line {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        background-color: rgb(131, 130, 130);
      }
    }
    .main-container {
      width: 80%;
      margin: 20px auto;
      .left-part {
        width: 23%;
        height: 100%;
        float: left;
        margin-right: 10px;
        .img-container {
          width: 100%;
          cursor: pointer;
          z-index: 1;
          position: relative;
          top: -50px;
          img {
            width: 97%;
            border-radius: 50%;
            border: 1px solid rgba(131, 130, 130, 0.388);
          }
        }
        .easyMessageBox {
          position: relative;
          top: -30px;
          .userName {
            font-size: 20px;
            font-style: normal;
            font-weight: 300;
            line-height: 24px;
          }
          .btn {
            transition: all 0.5s;
            font-size: 14px;
            background-color: var(--theme_userView_btn_bg);
            color: var(--theme_userView_btn_text);
            border: var(--theme_userView_btn_border);
          }
          .btn-block {
            height: 30px;
            width: 100%;
            font-weight: 600;
            line-height: 15px;
            display: block;
            margin-top: 15px;
            box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%),
              0 2px 10px 0 rgb(0 0 0 / 12%);
          }
          .btn:hover {
            background-color: var(--theme_userView_btn_bg_hover);
          }
        }
      }
      .right-part {
        width: 75%;
        min-height: 609px;
        float: right;
        padding-left: 10px;
        margin-top: -20px;
      }
    }
  }
  .user-container::after,
  .user-container::before {
    content: "";
    display: table;
  }

  .user-container::after {
    clear: both;
  }
}
</style>