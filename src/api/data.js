import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const getDepartmentList = () => {
  return [{
    id: '25941eb8-8a30-4fca-8a10-96aa898ff270',
    value: 'siluzhilv',
    label: '爱儿派'
  },
  {
    id: 'eb577d9b-5ab1-409a-a83e-c80c85b2eb6b',
    value: 'shanxiqinyi',
    label: '爱儿派教育'
  },
  {
    id: '6794aa8b-f67f-41d4-b7e4-b4109f04849b',
    value: 'test',
    label: '测试'
  }]
}

export const getModuleList = () => {
  return [{
    ModuleCode: 'BaseManage',
    ModuleTitle: '基础管理',
    Sort: 0,
    Children: []
  },
  {
    ModuleCode: 'ProductManage',
    ModuleTitle: '商品管理',
    Sort: 1,
    Children: []
  },
  {
    ModuleCode: 'OrderManage',
    ModuleTitle: '订单管理',
    Sort: 2,
    Children: []
  },
  {
    ModuleCode: 'Report',
    ModuleTitle: '统计报表',
    Sort: 3,
    Children: []
  }
  ]
}
export const getPermissionList = () => {
  return [{
    id: 'aaf10a14-1b8c-4d3e-9683-d4fad26514c7',
    value: 'list',
    label: '列表'
  },
  {
    id: 'a2752f1a-b4b2-4a03-9639-f5eb94cf1664',
    value: 'add',
    label: '添加'
  },
  {
    id: 'd4b464f0-3334-44a2-aabb-fe1c904f7f1e',
    value: 'edit',
    label: '编辑'
  },
  {
    id: '00ac3a80-6f60-4ad4-80ad-2964d6245ab6',
    value: 'delete',
    label: '删除'
  }
  ]
}
export const getditributorList = () => {
  return [
    {
      value: '1',
      label: '同业渠道'
    },
    {
      value: '2',
      label: 'OTA渠道'
    },
    {
      value: '3',
      label: '区域渠道'
    },
    {
      value: '4',
      label: '资源渠道'
    }
  ]
}

export const getPublicSearchColumns = () => {
  return [
    {
      label: '状态',
      type: 'select',
      value: '-1',
      selectdata: [
        {
          label: '全部',
          value: '-1'
        },
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '0'
        }
      ]
    },
    {
      label: '关键字',
      type: '',
      value: '',
      selectdata: []
    }
  ]
}
