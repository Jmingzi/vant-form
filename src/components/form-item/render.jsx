import Vue from 'vue'
import Composition, { ref, onUnmounted } from '@vue/composition-api'
import { PageButton } from 'esc-ui'
import {
  Field,
  Radio,
  RadioGroup,
  Cell,
  Picker,
  Popup,
  Switch,
  DatetimePicker,
  Area,
  Toast,
  Dialog,
  Icon,
  Button,
  Checkbox,
  CheckboxGroup
} from 'vant'
import dayjs from 'dayjs'
import area from './area'
import {
  getParentRef,
  isInvalidValue,
  triggerUpload,
  httpGet,
  http,
  registerUrlmap,
  beforeRequest,
  validate
} from './utils'
import {
  typeArea,
  typeDate,
  typePicker,
  typeField,
  typeFile,
  typeLocate,
  typeRadio,
  typeSwitch,
  typeSmsCode,
  typeCheckbox,
  typeFormConfirm,
  typeDesc,
  getBlockFieldValue,
  parseBlockFieldValue,
  smsTime,
  smsTimer,
  resetSmsTime
} from './config'
import './hack.less'

Vue.use(Composition)

const currentPickerIndex = ref(-1)

export default (params) => {
  const { props: { schema, data, submit }, scopedSlots } = params
  onUnmounted(() => {
    resetSmsTime()
  })

  const validateParams = (params) => {
    if (params) {
      // 校验参数关联的控件
      const relationItem = []
      schema.forEach(it => {
        if (params.some(x => x.value === `$$${it.field}`)) {
          relationItem.push(it)
        }
      })
      return validate(relationItem, data)
    }
  }

  const children = schema.map((item, schemaIndex) => {
    if ((item.relation || []).some(re => {
      // 兼容手动输入 boolean 值的情况
      if (re.value === 'true' || re.value === 'false') {
        // eslint-disable-next-line
        re.value = eval(re.value)
      }
      if (re.type === 'reg') {
        // 需要正则匹配
        let reg
        try {
          // eslint-disable-next-line
          reg = eval(re.value)
        } catch (e) {
          // eslint-disable-next-line
          console.log(re.value)
        }
        if (reg) {
          const result = !reg.test(data[re.field])
          if (re.reverse) {
            return !result || !data[re.field]
          }
          return result
        }
      }
      // 默认字符串对比
      return data[re.field] !== re.value
    })) {
      return null
    }

    const props = {
      ...item,
      value: parseBlockFieldValue(item, data[item.field]),
      'left-icon': item.info && 'info-o'
    }
    const on = {
      input (val) {
        setVal(data, item.field, getBlockFieldValue(item, data[item.field], val))
        checkRuler(item, val)
      },
      'click-left-icon': () => {
        Dialog.alert({ message: item.info })
      }
    }
    if (typeField.includes(item.type)) {
      return (
        <Field
          class={!item.label && 'no-label'}
          {...{ props, on }}
          placeholder={props.placeholder}
        />
      )
    } else if (typeSmsCode.includes(item.type)) {
      return (
        <Field
          label={item.label}
          required={item.required}
          center={true}
          placeholder="请输入"
          value={props.value}
          on={on}
          scopedSlots={{
            button: () => (
              <Button
                size="small"
                type="primary"
                disabled={smsTime.value > 0}
                onClick={async () => {
                  if (!validateParams(item.params)) {
                    return
                  }
                  item.params = beforeRequest(item.params, data)
                  await httpGet(item.dataUrl, item.params)
                  smsTime.value = 60
                  smsTimer.value = setInterval(() => {
                    smsTime.value--
                    if (smsTime.value <= 0) {
                      resetSmsTime()
                    }
                  }, 1000)
                }}
              >
                {smsTime.value > 0 ? `${smsTime.value}s后重发` : '发送验证码'}
              </Button>
            )
          }}
        />
      )
    } else if (typeDesc.includes(item.type)) {
      return (
        <div class="van-cell">
          <span class="c-999">{item.label}</span>
        </div>
      )
    } else if (typeCheckbox.includes(item.type)) {
      return (
        <div class={['van-cell flex-column', { 'van-cell--required': item.required }]}>
          <p class="mb10">{item.label}</p>
          <CheckboxGroup
            value={props.value ? props.value.split('/') : []}
            on={{
              input (val) {
                setVal(data, item.field, val.join('/'))
              }
            }}
          >
            {
              item.options.map(x => (
                <Checkbox class="mb10" name={x.value} checked-color="#07c160" shape="square">{x.label}</Checkbox>
              ))
            }
          </CheckboxGroup>
        </div>
      )
    } else if (typeFormConfirm.includes(item.type)) {
      return (
        <div class="van-cell render-custom__confirm">
          <Checkbox
            checked-color="#07c160"
            value={props.value}
            on={on}
            style={{ alignItems: 'flex-start' }}
            shape="square"
          >
            {item.text}
          </Checkbox>
        </div>
      )
    } else if (typeRadio.includes(item.type)) {
      return (
        <Cell
          title={item.label}
          required={item.required}
          title-class="van-field__label"
          scopedSlots={{
            icon: () => {
              if (item.info) {
                return <Icon name={'info-o'} onClick={() => Dialog.alert({ message: item.info })} />
              }
            },
            default: () => (
              <RadioGroup {...{ props, on }}>
                <div class="flex">
                  {
                    item.options.map((x, index) => (
                      <Radio checked-color="#07c160" class="mr20" name={x.value}>{ x.label }</Radio>
                    ))
                  }
                </div>
              </RadioGroup>
            )
          }}
        />
      )
    } else if (typePicker.includes(item.type)) {
      const value = item.type === 'picker-multi'
        ? props.value
        : item.options.find(x => x.value === props.value)?.label
      return (
        <Field
          readonly={true}
          clickable={true}
          label={item.label}
          value={value}
          placeholder={props.placeholder}
          is-link={true}
          required={item.required}
          on={{
            click: async () => {
              function dataCallback (data) {
                let result = data
                const [dataPath, label = 'label', value = 'value'] = item.fieldMap.split('/')
                if (dataPath) {
                  const { pref, field } = getParentRef(dataPath, data)
                  result = pref ? pref[field] : result
                }
                if (!result || result.length === 0) {
                  Toast('没有可选数据哦')
                } else {
                  item.options = result.map(x => ({
                    label: x[label],
                    value: x[value]
                  }))
                  currentPickerIndex.value = schemaIndex
                  item.showPicker = true
                }
              }

              // 动态接口
              if (item.dataUrl) {
                if (item.jsonp) {
                  scriptLoad(item, dataCallback)
                  return
                }
                // 校验参数
                if (!validateParams(item.params)) {
                  return
                }
                item.params = beforeRequest(item.params, data)
                const res = await httpGet(item.dataUrl, item.params)
                if (!res.data.success) {
                  return Promise.reject(res.data)
                }
                dataCallback(res.data)
              } else {
                currentPickerIndex.value = schemaIndex
                item.showPicker = true
              }
            }
          }}
        />
      )
    } else if (typeSwitch.includes(item.type)) {
      return (
        <Cell
          title={item.label}
          title-class="van-field__label"
          center={true}
          required={item.required}
          scopedSlots={{
            'right-icon': () => (
              <div class="flex flex-grow-1" style={{ flexDirection: 'row-reverse' }}>
                <span class="ml5 c-999">{props.value === true ? '是' : '否'}</span>
                <Switch
                  active-color="#07c160"
                  value={props.value}
                  onInput={on.input}
                  size={'24px'}
                />
              </div>
            )
          }}
        />
      )
    } else if (typeDate.includes(item.type)) {
      return (
        <Field
          readonly={true}
          clickable={true}
          label={item.label}
          value={props.value}
          placeholder={props.placeholder}
          required={item.required}
          is-link={true}
          on={{
            click () {
              currentPickerIndex.value = schemaIndex
              item.showPicker = true
            }
          }}
        />
      )
    } else if (typeFile.includes(item.type)) {
      return (
        <Cell
          class="van-field"
          title-class="van-field__label"
          title={item.label}
          required={item.required}
          center={true}
          on={{
            click () {
              triggerUpload(e => {
                const urlKey = registerUrlmap(item.dataUrl)
                http.post(urlKey, { file: e.target.files[0] }, { isUpload: true }).then((res) => {
                  setVal(data, item.field, res.data)
                })
              })
            }
          }}
          scopedSlots={{
            'right-icon': () => (
              <span>附件</span>
            ),
            default: () => <div class="th1">{data[item.field]}</div>
          }}
        />
      )
    } else if (typeArea.includes(item.type)) {
      return (
        <Field
          readonly={true}
          clickable={true}
          label={item.label}
          placeholder={props.placeholder}
          is-link={true}
          required={item.required}
          value={props.value}
          on={{
            click () {
              currentPickerIndex.value = schemaIndex
              item.showPicker = true
            }
          }}
        />
      )
    } else if (typeLocate.includes(item.type)) {
      return (
        <Field
          readonly={true}
          clickable={true}
          label={item.label}
          placeholder={props.placeholder}
          is-link={true}
          required={item.required}
          value={props.value}
        />
      )
    }
  }).concat(renderPopup(schema[currentPickerIndex.value], data))

  return (
    <div class="render-custom">
      {children}
      { scopedSlots && scopedSlots.default ? scopedSlots.default() : (
        <PageButton
          buttons={[{
            text: '提 交',
            color: 'rgb(255, 77, 77)',
            click () {
              submit(schema, data)
            }
          }]}
        />
      )}
    </div>
  )
}

function renderPicker (item, data) {
  return (
    <Popup
      value={item.showPicker}
      position="bottom"
      on={{
        input () {
          item.showPicker = false
        }
      }}
    >
      {
        item.type === 'picker-multi' ? (
          <Picker
            show-toolbar={true}
            columns={item.options}
            on={{
              cancel () {
                item.showPicker = false
              },
              confirm (label) {
                item.showPicker = false
                setVal(data, item.field, label.filter(Boolean).join('/'))
              }
            }}
          />
        ) : (
          <Picker
            show-toolbar={true}
            columns={item.options.map(x => x.label)}
            on={{
              cancel () {
                item.showPicker = false
              },
              confirm (label) {
                item.showPicker = false
                setVal(data, item.field, item.options.find(x => x.label === label).value)
              }
            }}
          />
        )
      }
    </Popup>
  )
}

function renderDate (item, data) {
  const isTime = item.type === 'time'
  const value = isTime
    ? data[item.field] ? data[item.field] : dayjs().format('HH:mm')
    : data[item.field] ? new Date(dayjs(data[item.field]).valueOf()) : new Date()

  let minDate
  let maxDate
  if (item.isMinNow) {
    minDate = dayjs().format('YYYY/MM/DD')
  } else if (item.minDate) {
    minDate = item.minDate
  }
  if (item.isMaxNow) {
    maxDate = dayjs().format('YYYY/MM/DD')
  } else if (item.maxDate) {
    maxDate = item.maxDate
  }

  return (
    <Popup
      value={item.showPicker}
      position="bottom"
      on={{
        input () {
          item.showPicker = false
        }
      }}
    >
      <DatetimePicker
        value={value}
        type={item.type}
        min-date={minDate && new Date(minDate)}
        max-date={maxDate && new Date(maxDate)}
        on={{
          confirm (val) {
            item.showPicker = false
            setVal(
              data,
              item.field,
              isTime ? val : dayjs(val).format(item.format || 'YYYY/MM/DD')
            )
          },
          cancel () {
            item.showPicker = false
          }
        }}
      />
    </Popup>
  )
}

function renderArea (item, data) {
  return (
    <Popup
      value={item.showPicker}
      position="bottom"
      on={{
        input () {
          item.showPicker = false
        }
      }}
    >
      <Area
        columns-num={3}
        area-list={area}
        on={{
          cancel () {
            item.showPicker = false
          },
          confirm (val) {
            item.showPicker = false
            setVal(data, item.field, val.map(x => x.name).join(''))
          }
        }}
      />
    </Popup>
  )
}

function renderPopup (item, data) {
  if (!item) {
    return null
  } else if (typePicker.includes(item.type)) {
    return renderPicker(item, data)
  } else if (typeDate.includes(item.type)) {
    return renderDate(item, data)
  } else if (typeArea.includes(item.type)) {
    return renderArea(item, data)
  }
}

function setVal (data, field, val) {
  if (data[field] === undefined) {
    Vue.set(data, field, val)
  } else {
    data[field] = val
  }
}

function checkRuler (item, val) {
  if (!item.ruler) {
    return
  }
  let msg = ''
  try {
    // eslint-disable-next-line
    item.ruler = eval(item.ruler)
  } catch (e) {
  }
  if (
    item.ruler instanceof RegExp &&
    !item.ruler.test(val)
  ) {
    msg = item.errMsg || `${item.label}不合法`
  }
  // 不存在值 且 非必填 提示语去除
  if (isInvalidValue(val) && !item.required) {
    msg = ''
  }
  setVal(item, 'error-message', msg)
}

function scriptLoad (item, callback) {
  if (window[item.jsonp]) {
    callback && callback(window[item.jsonp])
    return
  }
  const s = document.createElement('script')
  s.src = item.dataUrl
  s.onload = () => {
    callback && callback(window[item.jsonp])
  }
  document.body.appendChild(s)
}
