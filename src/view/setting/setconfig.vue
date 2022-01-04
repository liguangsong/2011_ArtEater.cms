<template>
  <div class="container-wrap">
    <Form
      ref="form"
      :model="form"
      label-position="right"
      :label-width="150"
      :rules="ruleValidate"
    >
      <div style="width: 1050px">
        <div class="formItem">
          <FormItem label="每次签到得" prop="signUpScore">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.signUpScore"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>积分</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="积分兑换人民币比例" prop="scoreMoneyPercent">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.scoreMoneyPercent"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>:1</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="正确率高" prop="percentH">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.percentH"
                  placeholder="请输入比例"
                ></Input>
              </div>
              <div class="comment">
                <label>%</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="第一次答题得" prop="firstExamScore">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.firstExamScore"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>积分</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <!-- <FormItem label="科目是否合并购买">
            <div class="inputDiv">
              <div class="input">
                <i-switch v-model="form.isSubjectAllBuy" size="large" />
              </div>
              <div class="comment"></div>
            </div>
          </FormItem> -->
        </div>
        <div class="formItem">
          <FormItem label="正确率中" prop="percentM">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.percentM"
                  placeholder="请输入比例"
                ></Input>
              </div>
              <div class="comment">
                <label>%</label>
              </div>
            </div>
          </FormItem>
        </div>
        <!-- <div class="formItem">
                    <FormItem label="公告错题比例" prop="allErrorPercent">
                        <div class="inputDiv">
                            <div class="input">
                                <Input type="number" v-model="form.allErrorPercent" placeholder="请输入百分比"></Input>
                            </div>
                            <div class="comment">
                                <label>%</label>
                            </div>
                        </div>
                    </FormItem>
                </div> -->

        <div class="formItem">
          <FormItem label="第二次到多次答题得" prop="secondExamScore">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.secondExamScore"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>积分</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="推荐是否展示视频">
            <div class="inputDiv">
              <div class="input">
                <i-switch v-model="form.isShowVideo" size="large" />
              </div>
              <div class="comment"></div>
            </div>
          </FormItem>
        </div>
        <div class="formItem"></div>
        <div class="formItem">
          <FormItem label="分享拉新得" prop="shareScore">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.shareScore"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>积分</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem">
          <FormItem label="套课是否合并购买">
            <i-switch v-model="form.isCoursesAllBuy" size="large" />
          </FormItem>
        </div>
        <div class="formItem"></div>
        <div class="formItem">
          <FormItem label="每元花费得" prop="shopScore">
            <div class="inputDiv">
              <div class="input">
                <Input
                  type="number"
                  v-model="form.shopScore"
                  placeholder="请输入积分"
                ></Input>
              </div>
              <div class="comment">
                <label>积分</label>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="formItem"></div>
        <div class="formItem"></div>
        <div class="formItem" style="width: 700px">
          <FormItem label="版权说明">
            <div class="inputDiv">
              <div class="input">
                <Input
                  v-model="form.version"
                  :maxlength="50"
                  :show-word-limit="true"
                  type="textarea"
                  placeholder="请输入版权说明"
                ></Input>
              </div>
              <div class="comment"></div>
            </div>
          </FormItem>
        </div>
      </div>
    </Form>
    <div style="width: 700px; text-align: center">
      <Button type="primary" size="large" @click="handleSave">保存</Button>
    </div>
  </div>
</template> 

<script>
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
export default {
  name: "subjectsmanageindex",
  data() {
    var self = this;
    return {
      form: {
        signUpScore: 0, // 签到送积分数量
        firstExamScore: 0, // 第一次答题送积分
        secondExamScore: 0, // 第二次到多次答题送积分
        shareScore: 0, // 分享拉新送积分
        shopScore: 0, // 购物送积分
        scoreMoneyPercent: 0, // 积分兑换人民币比例
        allErrorPercent: 0, // 全局错误率
        // isSubjectAllBuy: false, // 科目是否合并购买
        isShowVideo: false, // 推荐是否展示视频
        isCoursesAllBuy: false, // 套课是否合并购买
        percentH: "", // 正确率高
        percentM: "", // 正确率高
        version: "", // 版权说明
      },
      ruleValidate: {
        signUpScore: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        firstExamScore: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        secondExamScore: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        shareScore: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        shopScore: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        scoreMoneyPercent: [
          {
            required: true,
            message: "请输入正确的积分",
            trigger: "blur",
            validator: verification.validateInt,
          },
        ],
        allErrorPercent: [
          {
            required: true,
            message: "请输入最多包含两位小数的比例",
            trigger: "blur",
            validator: verification.validateFloat2,
          },
        ],
        percentH: [
          {
            required: true,
            message: "请输入最多包含两位小数的比例",
            trigger: "blur",
            validator: verification.validateFloat2,
          },
        ],
        percentM: [
          {
            required: true,
            message: "请输入最多包含两位小数的比例",
            trigger: "blur",
            validator: verification.validateFloat2,
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    var self = this;
    this.ParseServer.Config.get().then((config) => {
      // self.form.isSubjectAllBuy = config.get("isSubjectAllBuy");
      self.form.isShowVideo = config.get("isShowVideo");
      self.form.isCoursesAllBuy = config.get("isCoursesAllBuy");
      self.form.signUpScore = parseInt(config.get("signUpScore"));
      self.form.firstExamScore = parseInt(config.get("firstExamScore"));
      self.form.secondExamScore = parseInt(config.get("secondExamScore"));
      self.form.shareScore = parseInt(config.get("shareScore"));
      self.form.shopScore = parseInt(config.get("shopScore"));
      self.form.scoreMoneyPercent = parseInt(config.get("scoreMoneyPercent"));
      self.form.allErrorPercent = parseFloat(config.get("allErrorPercent"));
      self.form.percentH = parseFloat(config.get("percentH"));
      self.form.percentM = parseFloat(config.get("percentM"));
      self.form.version = config.get("version");
    });
  },
  methods: {
    /** 保存配置 */
    handleSave() {
      var self = this;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          self.$Message.error("请检查表单项");
          // self.modalLoading = false
          // setTimeout(() => {
          //     self.modalLoading = true
          // }, 100)
          return false;
        } else {
          this.ParseServer.Config.save({
            // isSubjectAllBuy: self.form.isSubjectAllBuy,
            isShowVideo: self.form.isShowVideo,
            isCoursesAllBuy: self.form.isCoursesAllBuy,
            signUpScore: parseInt(self.form.signUpScore),
            firstExamScore: parseInt(self.form.firstExamScore),
            secondExamScore: parseInt(self.form.secondExamScore),
            shareScore: parseInt(self.form.shareScore),
            shopScore: parseInt(self.form.shopScore),
            scoreMoneyPercent: parseInt(self.form.scoreMoneyPercent),
            allErrorPercent: parseFloat(self.form.allErrorPercent),
            percentH: parseFloat(self.form.percentH),
            percentM: parseFloat(self.form.percentM),
            version: self.form.version,
          }).then(function (config) {
            // self.form.isSubjectAllBuy = config.get("isSubjectAllBuy");
            self.form.isShowVideo = config.get("isShowVideo");
            self.form.isCoursesAllBuy = config.get("isCoursesAllBuy");
            self.form.signUpScore = parseInt(config.get("signUpScore"));
            self.form.firstExamScore = parseInt(config.get("firstExamScore"));
            self.form.secondExamScore = parseInt(config.get("secondExamScore"));
            self.form.shareScore = parseInt(config.get("shareScore"));
            self.form.shopScore = parseInt(config.get("shopScore"));
            self.form.scoreMoneyPercent = parseInt(
              config.get("scoreMoneyPercent")
            );
            self.form.allErrorPercent = parseFloat(
              config.get("allErrorPercent")
            );
            self.form.percentH = parseFloat(config.get("percentH"));
            self.form.percentM = parseFloat(config.get("percentM"));
            self.form.version = config.get("version");
            self.$Message.success("保存成功");
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.formItem {
  width: 350px;
  display: inline-block;
}
.inputDiv {
  display: flex;
}
.inputDiv .input {
  flex: 1;
}
.inputDiv .comment {
  width: 50px;
  text-indent: 2px;
}
</style>
