<template>
  <div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :show-summary="showSummary"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer">
        <span v-if="IsShowSumColumns" style="margin-left:10px;"
          >合计：
          <label
            v-for="item in sumColumns"
            style="margin-right:10px;"
            v-bind:key="item"
            >{{ item.Title }}:{{ item.Value }}</label
          >
        </span>
      </slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <div
      v-if="searchable && searchPlace === 'bottom'"
      class="search-con search-con-top"
    >
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          :value="item.key"
          :key="`search-col-${item.key}`"
          >{{ item.title }}</Option
        >
      </Select>
      <Input
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button
        style="margin-left:10px"
        @click="handleSearch"
        class="search-btn"
        type="primary"
        icon="ios-search"
        >搜索</Button
      >
    </div>
    <a id="hrefToExportTable" style="display: nonewidth: 0pxheight: 0px"></a>
  </div>
</template>

<script>
import TablesEdit from "./edit.vue";
import handleBtns from "./handle-btns";
import "./index.less";
export default {
  name: "Tables",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    searchcolumns: {
      type: Array,
      default() {
        return [];
      }
    },
    /**
     * @description 全局设置按钮
     */
    ActionButtons: {
      type: Array,
      default() {
        return [];
      }
    },
    ShowButtons: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    sumColumns: {
      type: Array,
      default() {
        return [];
      }
    },
    IsShowSumColumns: {
      type: Boolean,
      default: false
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: true
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    /**
     * @description 是否在表格底部开启合计行
     */
    showSummary: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },

    /**
     * @description 搜索框是否显示
     */
    searchInput: {
      type: Boolean,
      default: true
    },

    /**
     * @description 搜索框按钮是否显示
     */
    searchBtn: {
      type: Boolean,
      default: true
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: "top"
    },

    /**
     * @description 是否可添加
     */
    showDelete: {
      type: Boolean,
      default: true
    },
    /**
     * @description 是否充值密码
     */
    showresetPassword: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可修改
     */
    showUpdate: {
      type: Boolean,
      default: true
    },

    /**
     * @description 是否可拉取更新
     */
    showPull: {
      type: Boolean,
      default: false
    },

    /**
     * @description 是否可删除
     */
    showAdd: {
      type: Boolean,
      default: true
    },
    /**
     * @description 是否批量添加
     */
    showBatchAdd: {
      type: Boolean,
      default: false
    },

    /**
     * @description 是否上架
     */
    UpperShelf: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否下架
     */
    LowerShelf: {
      type: Boolean,
      default: false
    },
    /**
     * @description 恢复
     */
    Recovery: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可关联商户
     */
    showRel: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可导入数据
     */
    showExport: {
      type: Boolean,
      default: false
    },
    showAuthorization: {
      type: Boolean,
      default: false
    },
    showDownLoadTemplete: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: "",
      edittingText: "",
      searchValue: "",
      searchKey: "",
      selectData: []
    };
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: val => {
              this.edittingText = val;
            },
            "on-start-edit": params => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`;
              this.$emit("on-start-edit", params);
            },
            "on-cancel-edit": params => {
              this.edittingCellId = "";
              this.$emit("on-cancel-edit", params);
            },
            "on-save-edit": params => {
              this.value[params.row.initRowIndex][
                params.column.key
              ] = this.edittingText;
              this.$emit("input", this.value);
              this.$emit(
                "on-save-edit",
                Object.assign(params, { value: this.edittingText })
              );
              this.edittingCellId = "";
            }
          }
        });
      };
      return item;
    },
    surportHandle(item) {
      let options = item.options || [];
      let insideBtns = [];
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item]);
      });
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h(
          "div",
          btns.map(item => item(h, params, this))
        );
      };
      return item;
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item;
        if (res.editable) res = this.suportEdit(res, index);
        if (res.key === "handle") res = this.surportHandle(res);
        return res;
      });
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key !== "handle"
          ? this.columns[0].key
          : this.columns.length > 1
          ? this.columns[1].key
          : "";
    },
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    handleSearch() {
      this.$emit("on-handle-Search", this.searchKey, this.searchValue);
      // this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    },
    handleAdd() {
      this.$emit("addBtnEvent");
    },
    handleAction(data) {
      // this.$emit(data.handleEvent, this.selectData[0])
      // this.$emit('handleAdd')
      data.handleEvent();
    },
    handleAuthorization() {
      if (this.selectData.length <= 0) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择要授权的数据。"
        });
        return;
      }
      this.$emit("authorizationEvent", this.selectData);
    },
    handleBatchAdd() {
      this.$emit("batchAddBtnEvent");
    },
    handleExport() {
      this.$emit("exportEvent");
    },
    handleDownLoadTemplete() {
      this.$emit("DownLoadTemplete");
    },
    handleRel() {
      if (this.selectData.length <= 0) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择要关联的项目。"
        });
        return;
      }
      this.$emit("relBtnItem", this.selectData);
    },
    handleUpdate() {
      if (this.selectData.length > 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "一次只能修改一条记录。"
        });
        return;
      }
      if (this.selectData.length < 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择一条修改记录。"
        });
        return;
      }
      this.$emit("updateBtnEvent", this.selectData[0]);
    },
    handleUpper() {
      if (this.selectData.length > 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "一次只能修改一条记录。"
        });
        return;
      }
      if (this.selectData.length < 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择一条修改记录。"
        });
        return;
      }
      this.$emit("upperBtnEvent", this.selectData[0]);
    },
    handleLower() {
      if (this.selectData.length > 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "一次只能修改一条记录。"
        });
        return;
      }
      if (this.selectData.length < 1) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择一条修改记录。"
        });
        return;
      }
      this.$emit("lowerBtnEvent", this.selectData[0]);
    },
    handleRecovery() {
      if (this.selectData.length <= 0) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择要恢复的项目。"
        });
        return;
      }
      this.$emit("recoverybtnItem", this.selectData);
    },

    handlePull() {
      this.$emit("pullbtnItem", "");
    },
    handleResetPassword() {
      if (this.selectData.length <= 0) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择要重置的项目。"
        });
        return;
      }
      this.$emit("resetbtnItem", this.selectData[0]);
    },
    handleDelete() {
      if (this.selectData.length <= 0) {
        this.$Modal.error({
          title: "修改错误",
          content: "请选择要删除的项目。"
        });
        return;
      }
      this.$emit("deletebtnItem", this.selectData);
      this.selectData = [];
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    exportCsv(params) {
      // this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow() {
      // this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("on-current-change", currentRow, oldCurrentRow);
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
    },
    onSelectCancel(selection, row) {
      // this.$emit("on-select-cancel", selection, row)
    },
    onSelectAll(selection) {
      // this.$emit("on-select-all", selection)
    },
    onSelectionChange(selection) {
      this.selectData = selection;
      // this.$emit("on-selection-change", selection)
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column.key, column.order, column);
    },
    onFilterChange(row) {
      // this.$emit("on-filter-change", row)
    },
    onRowClick(row, index) {
      // 放出来的话单击行可以选中第一列的复选框。
      // this.insideTableData[index]._checked =
      // this.insideTableData[index]._checked === true ? false : true
      this.$refs.tablesMain.toggleSelect(index);
      this.$emit("on-row-click", row, index);
    },
    onRowDblclick(row, index) {
      // this.$emit("on-row-dblclick", row, index)
    },
    onExpand(row, status) {
      // this.$emit("on-expand", row, status)
    }
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns);
      this.setDefaultSearchKey();
    },
    value(val) {
      this.handleTableData();
      // this.handleSearch()
    },
    sumColumns(val) {}
  },
  mounted() {
    this.handleColumns(this.columns);
    this.setDefaultSearchKey();
    this.handleTableData();
  }
};
</script>
