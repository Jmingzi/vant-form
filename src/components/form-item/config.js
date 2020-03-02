import Vue from 'vue'
import Composition, { ref } from '@vue/composition-api'

Vue.use(Composition)

export const typeField = ['text', 'tel', 'number', 'textarea']
export const typeRadio = ['radio', 'cell-radio']
export const typePicker = ['picker', 'picker-multi']
export const typeSwitch = ['switch']
export const typeDate = ['date', 'time']
export const typeFile = ['file']
export const typeArea = ['area']
export const typeLocate = ['locate']
export const typeSmsCode = ['sms']
export const typeCheckbox = ['checkbox']
export const typeFormConfirm = ['form-confirm']
export const typeDesc = ['desc']

export function getBlockFieldValue (item, blockFieldVal, fieldVal) {
  if (item.blockFieldIndex !== undefined) {
    const arr = blockFieldVal ? blockFieldVal.split('$$') : []
    arr[item.blockFieldIndex] = fieldVal
    return arr.join('$$')
  }
  return fieldVal
}

export function parseBlockFieldValue (item, blockFieldVal) {
  if (item.blockFieldIndex !== undefined) {
    const arr = blockFieldVal ? blockFieldVal.split('$$') : []
    return arr[item.blockFieldIndex]
  }
  return blockFieldVal
}

export const smsTime = ref(-1)
export const smsTimer = ref(null)
export function resetSmsTime () {
  smsTime.value = -1
  if (smsTimer.value) {
    clearInterval(smsTimer.value)
    smsTimer.value = null
  }
}
