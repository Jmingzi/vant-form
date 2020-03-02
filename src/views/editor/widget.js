export default [
  {
    id: 1,
    label: '输入框',
    type: 'text',
    required: false,
    field: '',
    placeholder: '请输入',
    errMsg: '',
    ruler: '',
    relation: [],
    info: '',
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 2,
    label: '单选框',
    type: 'radio',
    required: false,
    options: [],
    field: '',
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    info: '',
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 3,
    label: '下拉选择',
    type: 'picker',
    dataUrl: '',
    jsonp: '',
    params: [],
    fieldMap: 'path/label/value',
    showPicker: false,
    required: false,
    options: [],
    field: '',
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 8,
    label: '复选框',
    type: 'checkbox',
    required: false,
    field: '',
    options: [],
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 4,
    label: '开关',
    type: 'switch',
    required: false,
    field: '',
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 5,
    label: '日期时间',
    type: 'date',
    required: false,
    format: 'YYYY/MM/DD',
    minDate: '',
    maxDate: '',
    isMinNow: false,
    isMaxNow: false,
    field: '',
    showPicker: false,
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 6,
    label: '省市区组件',
    type: 'area',
    required: false,
    showPicker: false,
    field: '',
    placeholder: '请选择',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 7,
    label: '附件',
    type: 'file',
    required: false,
    field: '',
    placeholder: '请选择',
    dataUrl: '',
    errMsg: '',
    ruler: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  },
  {
    id: 9,
    label: '说明文字',
    type: 'desc',
    ruler: '',
    field: '',
    relation: [],
    displayInAdmin: false,
    displayInMobile: false
  }
]

export const builtIn = [
  {
    id: 990,
    type: 'text',
    label: '姓名',
    placeholder: '请输入',
    field: 'userName',
    required: true,
    errMsg: '姓名不合法',
    // 是否在后台展示
    displayInAdmin: true,
    displayInMobile: true,
    // 校验规则
    ruler: undefined,
    // 索引 1 ~ 10
    fieldIndex10: true
  },
  {
    id: 991,
    type: 'tel',
    label: '手机号',
    placeholder: '请输入',
    field: 'mobile',
    required: true,
    errMsg: '手机号不合法',
    displayInAdmin: true,
    displayInMobile: true,
    ruler: '/^\\d{11}$/',
    fieldIndex9: true
  },
  {
    id: 992,
    type: 'radio',
    label: '性别',
    required: true,
    field: 'sex',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' }
    ]
  },
  {
    id: 993,
    type: 'text',
    label: '身份证',
    placeholder: '请输入',
    required: true,
    field: 'idCard',
    errMsg: '请输入正确的身份证号码',
    ruler: '/^\\d{17}(\\d|x)\\s*$/i',
    displayInAdmin: true,
    displayInMobile: true,
    fieldIndex8: true
  },
  {
    type: 'sms',
    required: true,
    label: '短信验证码',
    field: 'authCode',
    params: [{ label: 'mobile', value: '$$mobile' }],
    dataUrl: '',
    fieldMap: 'path/label/value',
    ruler: '/^\\d{6}$/'
  },
  {
    type: 'form-confirm',
    required: true,
    label: '承诺事项',
    text: '承诺事项：本人承诺以上为事实!',
    field: 'formConfirm',
    placeholder: '请勾选'
  }
]
