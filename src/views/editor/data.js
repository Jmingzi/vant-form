import Vue from 'vue'
import Composition, { reactive } from '@vue/composition-api'

Vue.use(Composition)

export const state = reactive({
  current: null,
  dataList: []
})

export function setCurrent (item) {
  state.current = item
}

export function setDataList (arr) {
  state.dataList = arr
}
