<template>
  <div class="right">
    <div class="right-top">回复我的</div>
    <div class="right-main">
      <div v-for="(message,index) in messageList" :key="message._id" class="main-item">
        <div class="data-item">
          <div class="data-container">
            <div class="side-bar"></div>
            <img class="user-img" :src="$myBaseUrl+message.user.image" />
            <div class="item-message-container">
              <span class="user-name">{{message.user.username}}</span>
              <span class="item-title">回复了你的评论</span>
              <br />
              <span class="user-bio">{{message.body}}</span>
            </div>
            <div v-if="message.comment&&message.toReplyId" class="own-message">
              <span>{{message.toReplyId.body}}</span>
            </div>
            <div v-if="message.comment&&message.toReplyId===null" class="own-message">
              <span>{{message.comment.body}}</span>
            </div>
            <div v-if="message.trendComment&&message.toReplyId" class="own-message">
              <span>{{message.toReplyId.body}}</span>
            </div>
            <div v-if="message.trendComment&&message.toReplyId===null" class="own-message">
              <span>{{message.trendComment.body}}</span>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div class="messageDate">{{$dayjs(message.createdAt).format("YYYY/MM/DD HH:mm")}}</div>
          <div
            v-if="message.article"
            @click="showComment(index,message.user._id,message.article,message.comment._id,true,message._id)"
            class="my-toReply"
          >
            <i class="iconfont icon-taolun"></i>
            回复
          </div>
          <div
            v-if="message.trend"
            @click="showComment(index,message.user._id,message.trend,message.trendComment._id,false,message._id)"
            class="my-toReply"
          >
            <i class="iconfont icon-taolun"></i>
            回复
          </div>
          <div
            @click="kudosTheReply(message.article,message.trend,message._id,message.user._id)"
            class="my-kudos"
          >
            <i v-if="statusList[index].status===0" class="iconfont icon-dianzan"></i>
            <i v-else class="my-kudos-i iconfont icon-dianzan"></i>
            点赞
          </div>
        </div>
        <div id="my-message-comment-container" :class="'my-message-comment-container'+index"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store/index";
const MessageInput = () => import("@/components/MessageInput");
export default {
  name: "Reply",
  components: {
    MessageInput
  },
  data() {
    return {
      messageList: null,
      statusList: null,
      commentAreaIndex: null
    };
  },
  methods: {
    //获取消息
    async getMessage() {
      const ret = await this.$API.message.getMessage();
      if (ret.code === 200) {
        if (ret.replyArr) {
          this.messageList = ret.replyArr;
          this.statusList = ret.statusArr;
          return;
        }
        this.messageList = ret.retArr;
        this.statusList = ret.statusArr;
      }
    },
    //点赞
    async kudosTheReply(article, trend, id, ofUserId) {
      if (article) {
        //文章回复点赞
        article = article.toString();
        id = id.toString();
        ofUserId = ofUserId.toString();
        const replyKudos = {};
        replyKudos.reply = id;
        replyKudos.ofUser = ofUserId;
        const ret = await this.$API.comment.replyKudos(replyKudos);
        if (ret.code === 200) {
          this.getMessage();
          if (ret.cancel) {
            return this.$message({
              type: "warning",
              message: "已取消点赞！"
            });
          }
          this.$message({
            type: "success",
            message: "点赞成功！"
          });
        }
      } else {
        trend = trend.toString();
        id = id.toString();
        ofUserId = ofUserId.toString();
        //动态回复点赞
        const replyKudos = {};
        replyKudos.trendReply = id;
        replyKudos.ofUser = ofUserId;
        const ret = await this.$API.trend.replyKudos(replyKudos);
        if (ret.code === 200) {
          this.getMessage();
          if (ret.cancel) {
            return this.$message({
              type: "warning",
              message: "已取消点赞！"
            });
          }
          this.$message({
            type: "success",
            message: "点赞成功！"
          });
        }
      }
    },
    //显示回复框
    showComment(
      index,
      replyId,
      articleOrTrend,
      commentOrTrendComment,
      is,
      toReplyId
    ) {
      const commentArea = document.querySelector(
        `.my-message-comment-container${index}`
      );
      // if (!commentArea.firstChild) {
      // }
      if (this.commentAreaIndex != null) {
        const oldCommentArea = document.querySelector(
          `.my-message-comment-container${this.commentAreaIndex}`
        );
        oldCommentArea.removeChild(oldCommentArea.firstChild);
      }
      this.$nextTick(() => {
        const myDiv = document.createElement("div");
        myDiv.classList.add("test");
        commentArea.appendChild(myDiv);
        const CommentComponent = Vue.extend(MessageInput);
        new CommentComponent({ store }).$mount(".test");
        this.commentAreaIndex = index;
      });
      if (is) {
        setTimeout(() => {
          this.$bus.$emit(
            "myFocus",
            articleOrTrend,
            commentOrTrendComment,
            replyId,
            toReplyId
          );
        }, 50);
      } else {
        setTimeout(() => {
          this.$bus.$emit(
            "reply",
            articleOrTrend,
            commentOrTrendComment,
            replyId,
            toReplyId
          );
        }, 50);
      }
    },
    //改变消息状态
    async changeUnCheckedReply() {
      const ret = await this.$API.message.changeUnCheckedReply();
      if (ret.code === 200) {
        this.$store.dispatch("getTotalCount");
      }
    }
  },
  mounted() {
    this.getMessage();
    if (this.$store.state.user.replyCount > 0) {
      this.changeUnCheckedReply();
    }
  }
};
</script>

<style lang='less' scoped>
.right {
  width: 910px;
  height: 100%;
  float: right;
  transition: all 0.3s;
  .right-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
    background-color: var(--theme_inner_bg_color);
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
    transition: background-color 0.3s;
    cursor: default;
  }
  .right-main {
    width: 100%;
    height: 615px;
    overflow-y: auto;
    background-color: var(--theme_inner_bg_color);
    border-radius: 5px;
    transition: background-color 0.3s;
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
    .main-item {
      margin-top: 20px;
      #my-message-comment-container {
        width: 100%;
        padding-left: 23px;
      }
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .data-item {
        margin-bottom: 0px;
        // transition: all 0.4s;
        .data-container {
          // transition: all 0.5s;
          font-weight: 600;
          position: relative;
          height: 70px;
          .own-message {
            position: absolute;
            right: 0;
            top: 5px;
            width: 65px;
            height: 66px;
            line-height: 13px;
            font-weight: 300;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            cursor: default;
          }
          &:after {
            /*伪元素是行内元素 正常浏览器清除浮动方法*/
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
          }
          .side-bar {
            width: 3px;
            height: 70px;
            float: left;
            background-color: rgb(13, 71, 161);
          }
          .user-img {
            float: left;
            width: 50px;
            border-radius: 50%;
            line-height: 50px;
            margin-left: 20px;
            margin-top: 35px;
            transform: translateY(-50%);
            cursor: pointer;
          }
          .item-message-container {
            float: left;
            margin-top: 35px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 14px;
            line-height: 24px;
            max-height: 70px;
            transform: translateY(-50%);
            margin-left: 8px;
            width: 820px;
            &:after {
              /*伪元素是行内元素 正常浏览器清除浮动方法*/
              content: "";
              display: block;
              height: 0;
              clear: both;
              visibility: hidden;
            }
            .user-name {
              font-weight: 600;
              cursor: pointer;
              // transition: color 0.4s;
              margin-left: 2px;
              &:hover {
                color: var(--theme_search_input_blue_color);
              }
            }
            .item-title {
              margin-left: 10px;
              cursor: pointer;
            }
            .user-bio {
              font-weight: 500;
              cursor: default;
            }
          }
        }
      }
      .data-item:hover {
        background-color: var(--theme_search_data_title_hover_bg);
      }
      .bottom-box {
        min-height: 23px;
        float: right;
        width: 95%;
        margin-top: -18px;
        margin-right: 20px;
        .messageDate {
          margin-left: 55px;
          font-size: 14px;
          float: left;
        }
        .my-toReply {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
        }
        .my-kudos {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
          .my-kudos-i {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
  }
  .right-main::-webkit-scrollbar {
    width: 3px;
  }
}
</style>