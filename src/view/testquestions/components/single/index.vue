<template>
    <div class="options-wrap">
        <div class="option clearfix" v-for="(item,index) in options" :key="index">
            <div class="option-content">
                <Input placeholder="请输入选项内容..." v-model="item.text">
                    <template slot="prepend">{{item.value}}</template>
                </Input>
                <Icon type="ios-bookmark" size="32" v-if="item.right_answer==true"  class="sel-option" color="rgb(71,203,137)"  @click="checked_answer(item)"/>
                <Icon type="ios-bookmark-outline"  size="32" v-else class="sel-option"  @click="checked_answer(item)" />
            </div>
            <span v-if="index>0">
                <Icon type="ios-trash-outline" size="28"  @click="del_option(item)" />
            </span>
        </div>
        <div class="option clearfix">
            <div class="option-add" @click="add_option">
                 <Icon type="md-add" size="28" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "single-exam",
    props:{
        exam_options:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    data() {
        return {
            options:[]
        }
    },
    watch:{
        options:{
            handler:function(new_val,old_val) {
                this.$emit("change-option",new_val)
            },
            deep: true
        }
    },
    mounted(){
        this.options=this.exam_options.map((item)=>{
            return item
        })
    },
    methods: {

        /*
		* 添加选项
		* 作者：gzt
		* 时间：2020-06-05 22:55:25
		*/
		add_option () {
			var option_val = String.fromCharCode(this.options.length + 65);
			this.options.push({
                value: option_val,
                sort: this.options.length,
				text: "",
				right_answer: false
			});
        },
       /*
       *删除选项
       *作者：gzt
       *时间：2020-11-22 21:04:03
       */
		del_option (option) {
			let index = this.options.findIndex(
				ent => ent.value === option.value
			);
			if (index != -1) {
				this.options.splice(index, 1);
			}
			// 重新改变索引
			for (let i = 0; i < this.options.length; i++) {
				this.options[i].value = String.fromCharCode(i + 65);
			}
		},
		/*
        *选择答案
        *作者：gzt
        *时间：2020-11-22 21:03:47
        */
		checked_answer (option) {
            this.options = this.options.map(ent => ({
                    sort: ent.sort,
					text: ent.text,
					value: ent.value,
					right_answer: false
				}));
            this.options.find(
                ent => ent.value === option.value
            ).right_answer = true;
		},
    }
}
</script>

<style lang="less" scoped>
	.options-wrap {
		.option {
			margin: 20px 0;
			line-height: 40px;
			.option-content {
				width: 90%;
				float: left;
				position: relative;
				.sel-option {
                    z-index: 200;
					position: absolute;
					right: -20px;
					bottom: -1px;
					cursor: pointer;
					height: 32px;
					width: 45px;
				}
			}
			span {
				margin-left: 20px;
				cursor: pointer;
			}
			.option-add {
                width: 90%;
				cursor: pointer;
				border: 1px dashed #dddddd;
				text-align: center;
				color: rgb(171, 196, 255);
			}
		}
	}
</style>
