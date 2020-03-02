import emojiRegx from 'emoji-regex'
import { Toast } from 'vant'
import { Http, Loading } from 'esc-ui'
// import { online } from '../../assets/api'

const emoji = emojiRegx()

export const getParentRef = (field, data) => {
  const fieldSpace = field.split('.')
  if (fieldSpace.length > 1) {
    let res = data[fieldSpace.shift()]
    while (fieldSpace.length > 1 && res !== undefined) {
      res = res[fieldSpace.shift()]
    }
    return {
      pref: res,
      field: fieldSpace[0]
    }
  }
  return {
    pref: data,
    field
  }
}

let fileInput = null
export function triggerUpload (callback) {
  if (!fileInput) {
    fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    document.body.appendChild(fileInput)
  }

  fileInput.onchange = (e) => {
    fileInput.remove()
    fileInput = null
    callback(e)
  }
  fileInput.click()
}

export function isDef (val) {
  return val !== undefined && val !== null
}

export function isUnDef (val) {
  return val === undefined || val === null
}

export function isValidValue (val) {
  return isDef(val) && val !== ''
}

export function isInvalidValue (val) {
  return isUnDef(val) || val === ''
}

export function getUid () {
  const uuid = 'yxxxy-yxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return uuid
}

export function validate (form, data) {
  // 校验必填项
  // 1 先校验是否为空
  // 2 再校验是否合法
  for (let i = 0; i < form.length; i++) {
    // for (let j = 0; j < form.value[i].length; j++) {
    const item = form[i]
    const value = data[item.field]
    let relationValid = true
    // 存在联动，该控件满足联动条件后才去校验他的值
    if (item.relation && item.relation.length) {
      relationValid = item.relation.every(re => {
        // 联动控件的值
        const reValue = data[i][re.field]
        if (re.type === 'reg') {
          // 需要正则匹配
          let reg
          try {
            // eslint-disable-next-line
            reg = eval(re.value)
          } catch (e) {
          }
          if (reg) {
            const result = reg.test(reValue)
            if (re.reverse) {
              // 存在值的时候 且 条件相反
              return !result && isValidValue(reValue)
            }
            return result
          }
        }
        return reValue === re.value
      })
    }
    if (
      relationValid &&
      item.required &&
      isInvalidValue(value)
    ) {
      Toast(`${item.placeholder || '请输入'}${item.label}`)
      return
    } else if (
      relationValid &&
      item.ruler instanceof RegExp &&
      !item.ruler.test(value) &&
      (isValidValue(value) || item.required)
    ) {
      Toast(item.errMsg || `${item.label}不合法`)
      return
    } else if (emoji.test(value)) {
      Toast(`${item.label}不能输入表情`)
      return
    }
    // }
  }
  return true
}

export const online = location.protocol === 'https:'
const urlMap = {}
const handleBeforeCatch = (res) => {
  return res.msg || res.message || (res.error && (res.error.msg || res.error.message)) || '服务异常，请稍后再试'
}
export const http = new Http({
  baseUrl: online ? location.origin : '',
  urlMap,
  notify: Toast,
  loadingMethods: Loading.instance,
  contentType: 'application/json',
  beforeThen (res) {
    res.data = res.data || res.value
    return res
  },
  beforeCatch (res) {
    res.msg = handleBeforeCatch(res)
    return res
  }
})

export function registerUrlmap (url) {
  const arr = url.split('/')
  const urlKey = arr.pop() + '/' + arr.pop()
  urlMap[urlKey] = url
  return urlKey
}

export async function httpGet (url, data) {
  if (/^http/.test(url)) {
    // 完整的Url
    Loading.instance.open()
    await http.instance.get(url, { params: data }).catch(err => {
      Toast(handleBeforeCatch(err))
      return Promise.reject(err)
    })
    Loading.instance.close()
  } else {
    const urlKey = registerUrlmap(url)
    return http.get(urlKey, data)
  }
}

export const parseJson = str => {
  let res = {}
  if (!str || typeof str !== 'string') {
    return res
  }
  try {
    res = JSON.parse(str)
  } catch (e) {
  }
  return res
}

export function cookieGet (name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

export function beforeRequest (params, schemaData) {
  if (!params) {
    return undefined
  }
  params.forEach((it) => {
    if (it.value === '$$orgId') {
      it.value = cookieGet('orgId')
    } else if (it.value === '$$userId') {
      it.value = cookieGet('userId')
    } else if (/^\$\$/.test(it.value)) {
      const { pref, field } = getParentRef(it.value.replace('$$', ''), schemaData)
      it.value = pref[field]
    }
  })
  return params.reduce((sum, it) => { sum[it.label] = it.value; return sum }, {})
}
