<template>
  <div class="my-create-view">
    <div class="edit-view">
      <Editor
        :initialValue="editorText"
        height="510px"
        ref="toastuiEditor"
        @change="getHtml"
        :options="editorOptions"
        initialEditType="wysiwyg"
        previewStyle="vertical"
      />
    </div>

    <div class="article-message">
      <el-form
        :model="articleMessage"
        status-icon
        :rules="rules"
        ref="articleMessage"
        label-width="100px"
        class="demo-ruleForm article-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="articleMessage.title"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            v-model="articleMessage.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
            v-model="articleMessage.category"
            placeholder="请选择分类"
            clearable
          >
            <el-option label="分类一" value="shanghai"></el-option>
            <el-option label="分类二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tagList" ref="tagItem">
          <el-tag
            class="my-tag-item"
            :key="index"
            v-for="(tag, index) in articleMessage.tagList"
            closable
            :disable-transitions="false"
            @close="closeTagItem(index)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag my-tag-input"
            v-if="isTagInputShow"
            v-model="tagInput"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
            @input="strCode"
          >
          </el-input>
          <el-button
            v-if="isTagButtonShow"
            class="button-new-tag"
            size="small"
            @click="changeInput"
            >+添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('articleMessage')"
            >提交</el-button
          >
          <el-button @click="resetForm('articleMessage')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
export default {
  name: "CreateArticle",
  components: {
    Editor,
  },
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入标题"));
      } else {
        callback();
      }
    };
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入摘要"));
      } else {
        callback();
      }
    };
    var validateCategory = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择分类"));
      } else {
        callback();
      }
    };
    var validateTagList = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请添加标签"));
      } else {
        callback();
      }
    };

    return {
      editorText: "",
      tagInput: "",
      isTagInputShow: false,
      isTagButtonShow: true,
      editorOptions: {
        hideModeSwitch: false,
      },
      articleMessage: {
        title: "",
        description: "",
        category: "",
        body: "",
        tagList: [],
      },
      rules: {
        title: [{ validator: validateTitle, trigger: "blur" }],
        description: [{ validator: validateDescription, trigger: "blur" }],
        category: [{ validator: validateCategory, trigger: "change" }],
        tagList: [{ validator: validateTagList, trigger: "blur" }],
      },
      myTheme: "",
    };
  },
  computed: {
    messageHeight() {},
  },
  methods: {
    getHtml() {
      this.editorText = this.$refs.toastuiEditor.invoke("getHTML");
    },
    submitForm(formName) {
      if (this.editorText === "") {
        return this.$message({
          type: "warning",
          message: "还没有添加文章内容哦！",
        });
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //验证成功
          this.articleMessage.body = this.editorText;
          const ret = await this.$API.article.createArticle(
            this.articleMessage
          );
          if (ret.code === 200) {
            this.$refs[formName].resetFields();
            this.$refs.toastuiEditor.invoke("reset");
          }
        } else {
          //验证失败
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.toastuiEditor.invoke("reset");
      this.editorText = "";
    },
    //标签输入框事件
    handleInputConfirm() {
      try {
        // this.$refs.tagItem.clearValidate()
        if (this.tagInput.trim() === "") {
          return this.$message({
            type: "error",
            message: "标签值不能为空",
          });
        }
        let result = this.articleMessage.tagList.every((item) => {
          return item != this.tagInput;
        });
        if (!result) {
          this.tagInput = "";
          return this.$message({
            type: "error",
            message: "此标签已存在",
          });
        }
        this.articleMessage.tagList.push(this.tagInput);
        this.tagInput = null;
        this.isTagInputShow = false;
        this.isTagButtonShow = true;
      } catch (error) {}
    },
    //改变tag input样式
    changeInput() {
      if (this.articleMessage.tagList.length > 2) {
        return this.$message({
          type: "error",
          message: "最多设置三个标签",
        });
      }
      this.isTagInputShow = true;
      this.isTagButtonShow = false;
      this.tagInput = "";
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //删除单个标签项(tag)
    closeTagItem(index) {
      this.articleMessage.tagList.splice(index, 1);
    },
    //自定义图片上传
    async myImgUpload() {
      const editor = this.$refs.toastuiEditor;
      editor.invoke("removeHook", "addImageBlobHook");
      editor.invoke("addHook", "addImageBlobHook", async (blob, callback) => {
        const formData = new FormData();
        formData.append("files", blob);
        const ret = await this.$API.article.handleImg(formData);
        if (ret.code === 200) {
          const url = ret.url;
          callback(url);
        }
      });
    },
    strCode() {
      //获取字符串的字节数
      let str = this.tagInput
      var count = 0; //初始化字节数递加变量并获取字符串参数的字符个数
      if (str) {
        //如果存在字符串，则执行
        const len = str.length;
        for (let i = 0; i < len; i++) {
          //遍历字符串，枚举每个字符
          if (str.charCodeAt(i) > 255) {
            //字符编码大于255，说明是双字节字符(即是中文)
            count += 2; //则累加2个
          } else {
            count++; //否则递加一次
          }
        }
        if(count>10){
          this.tagInput=str.slice(0,str.length-1)
          this.$message({
            type: "error",
            message: "内容超过最大长度",
          });
        }
      }
    },
  },
  mounted() {
    //可能会有样式问题
    // this.myTheme = document.documentElement.style.getPropertyValue(
    //   "--theme_inner_bg_color"
    // );
    // document.documentElement.style.setProperty(
    //   "--theme_inner_bg_color",
    //   "white"
    // );
    this.myImgUpload();
  },
  beforeDestroy() {
    //可能会有样式问题
    // document.documentElement.style.setProperty(
    //   "--theme_inner_bg_color",
    //   this.myTheme
    // );
  },
};
</script>

<style lang="less" scoped >
:deep(.el-textarea__inner) {
  max-height: 150px;
}
.my-create-view {
  transition: all 0.5s;
  width: 100%;
  height: 1200px;
  background-color: var(--theme_outer_bg_color);
  .edit-view {
    transition: inherit;
    background-color: white;
    width: 70%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 0.5rem;
    margin-top: 100px;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
  }
  .article-message {
    transition: inherit;
    width: 70%;
    background-color: white;
    position: absolute;
    top: 670px;
    left: 50%;
    transform: translate(-50%, 0);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .article-form {
      margin-top: 20px;
      width: 90%;
      .my-tag-input {
        width: 100px;
      }
      .my-tag-item {
        margin-right: 5px;
      }
    }
  }
  @media screen and (max-width: 585px) {
    .edit-view {
      width: 404px;
    }
    .article-message {
      width: 404px;
    }
  }
}
</style>
