<template v-if="(index+1)==data.length">
    <template v-for="(colSpanColumn, colSpanColumnIndex) in colSpanColumns">
        <table-tr
            :row="colSpanColumn"
            :key="colSpanColumn.key"
            :prefix-cls="prefixCls"

        >
            <td :colspan="colSpanColumn.colspan" :class="alignCls(colSpanColumn, colSpanColumn.tableBody)">
                <Cell
                    :natural-index="Number(colSpanColumnIndex+data.length)"
                    :index="Number(colSpanColumnIndex+data.length)"
                    :prefix-cls="prefixCls"
                    :row="colSpanColumn"
                    :key="colSpanColumn.key"
                    :column="colSpanColumn"
                ></Cell>
            </td>
            <template v-for="(colSpanBody, colSpanBodyIndex) in colSpanColumn.tableBody"  :class="alignCls(colSpanColumn, colSpanBody)">
                <td :colspan="colSpanBody.colspan" :class="alignCls(colSpanBody, colSpanBody)">
                    <Cell
                        :natural-index="Number(colSpanBodyIndex+data.length)"
                        :index="Number(colSpanBodyIndex+data.length)"
                        :prefix-cls="prefixCls"
                        :row="colSpanBody"
                        :key="colSpanBody.key"
                        :column="colSpanBody"
                    ></Cell>
                </td>
            </template>
        </table-tr>
    </template>

</template>
<script>
    // todo :key="row"
    import TableTr from './table-tr.vue';
    import TableCell from './cell.vue';
    import Expand from './expand.js';
    import Mixin from './mixin';

    export default {
        name: 'TableBody',
        mixins: [ Mixin ],
        components: { TableCell, Expand, TableTr },
        props: {
            prefixCls: String,
            styleObject: Object,
            columns: Array,
            data: Array,    // rebuildData
            objData: Object,
            columnsWidth: Object,
            fixed: {
                type: [Boolean, String],
                default: false
            },
            draggable: {
                type: Boolean,
                default: false
            },
            rowKey: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            expandRender () {
                let render = function () {
                    return '';
                };
                for (let i = 0; i < this.columns.length; i++) {
                    const column = this.columns[i];
                    if (column.type && column.type === 'expand') {
                        if (column.render) render = column.render;
                    }
                }
                return render;
            }
        },
        methods: {
            rowChecked (_index) {
                return this.objData[_index] && this.objData[_index]._isChecked;
            },
            rowDisabled(_index){
                return this.objData[_index] && this.objData[_index]._isDisabled;
            },
            rowExpanded(_index){
                return this.objData[_index] && this.objData[_index]._isExpanded;
            },
            handleMouseIn (_index) {
                this.$parent.handleMouseIn(_index);
            },
            handleMouseOut (_index) {
                this.$parent.handleMouseOut(_index);
            },
            clickCurrentRow (_index) {
                this.$parent.clickCurrentRow(_index);
            },
            dblclickCurrentRow (_index) {
                this.$parent.dblclickCurrentRow(_index);
            }
        }
    };
</script>
