import {
  typeSwitch,
  typePicker,
  typeRadio,
  typeLocate,
  typeFile,
  typeField,
  typeDate,
  typeArea,
  typeFormConfirm,
  typeCheckbox,
  typeDesc,
  typeSmsCode
} from '../../components/form-item/config'

export default {
  label: {
    label: '标题',
    type: 'field'
  },
  type: (item) => {
    let options = []
    if (typeArea.includes(item.type)) {
      options = typeArea
    } else if (typeDate.includes(item.type)) {
      options = typeDate
    } else if (typeField.includes(item.type)) {
      options = typeField
    } else if (typeFile.includes(item.type)) {
      options = typeFile
    } else if (typeRadio.includes(item.type)) {
      options = typeRadio
    } else if (typePicker.includes(item.type)) {
      options = typePicker
    } else if (typeSwitch.includes(item.type)) {
      options = typeSwitch
    } else if (typeLocate.includes(item.type)) {
      options = typeLocate
    } else if (typeFormConfirm.includes(item.type)) {
      options = typeFormConfirm
    } else if (typeSmsCode.includes(item.type)) {
      options = typeSmsCode
    } else if (typeDesc.includes(item.type)) {
      options = typeDesc
    } else if (typeCheckbox.includes(item.type)) {
      options = typeCheckbox
    }
    return {
      label: '类型',
      type: 'radio',
      options
    }
  },
  required: {
    label: '是否必填',
    type: 'switch'
  },
  field: {
    label: '字段名',
    type: 'field'
  },
  placeholder: {
    label: '空提示语',
    type: 'field'
  },
  errMsg: {
    label: '错误提示语',
    type: 'field'
  },
  ruler: {
    label: '校验值的正则',
    type: 'field'
  },
  dataUrl: {
    label: '动态数据地址',
    type: 'field'
  },
  fieldMap: {
    label: '返回结果校准',
    type: 'field'
  },
  jsonp: {
    label: '全局变量名',
    type: 'field'
  },
  format: {
    label: '日期格式',
    type: 'field'
  },
  options: {
    label: '选项',
    type: 'option'
  },
  params: {
    label: '参数',
    type: 'option'
  },
  info: {
    label: '控件说明',
    type: 'field'
  },
  relation: {
    label: '联动关系',
    type: 'option2'
  },
  minDate: {
    label: '最小日期',
    type: 'field',
    placeholder: '2020/01/25'
  },
  maxDate: {
    label: '最大日期',
    type: 'field',
    placeholder: '2020/01/25'
  },
  toNowDays: {
    label: '最大日期为距当前(x)天',
    type: 'field'
  },
  isMinNow: {
    label: '最小为当前时间',
    type: 'switch'
  },
  isMaxNow: {
    label: '最大为当前时间',
    type: 'switch'
  },
  id: {
    label: '控件id',
    type: 'field'
  },
  displayInAdmin: {
    label: '字段在后台特殊地方展示',
    type: 'switch'
  },
  displayInMobile: {
    label: '字段在手机特殊地方展示',
    type: 'switch'
  },
  blockFieldIndex: {
    label: '字段关联索引',
    type: 'field'
  },
  text: {
    label: '文本内容',
    type: 'field'
  }
}
