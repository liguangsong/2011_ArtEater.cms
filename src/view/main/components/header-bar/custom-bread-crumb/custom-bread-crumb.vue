<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="(item,_idx) in list" :to="item.to" :key="`bread-crumb-${item.name}`">
        <common-icon style="margin-right: 4px;" :type="item.icon || ''"/>
        <template v-if="_idx==list.length-1">
          <Tooltip content="点击刷新本页">
            <div style="display:inline-block;cursor: pointer;" @click="handleItemClick(item)">{{ showTitle(item) }}</div>
          </Tooltip>
        </template>
        <template v-else>
          <div style="display:inline-block;">{{ showTitle(item) }}</div>
        </template>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
import CommonIcon from '_c/common-icon'
import './custom-bread-crumb.less'
export default {
  name: 'customBreadCrumb',
  components: {
    CommonIcon
  },
  inject:['reload'],
  
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    },
    handleItemClick(item){
      this.reload()
    }
  }
}
</script>
