import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { Field, Button, Checkbox } from 'vant'

export default defineComponent({
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    label: String,
    emptyItem: Object
  },
  setup (props, ctx) {
    const emptyItemArr = Object.keys(props.emptyItem)
    const isRelation = emptyItemArr[0] === 'field'
    return () => (
      <div class="p15 flex bg-fff">
        <span style="width: 100px">{props.label}</span>
        <div class="flex-grow-1">
          <Button
            size={'mini'}
            type={'primary'}
            onClick={() => props.value.push({ ...props.emptyItem })}
          >添加</Button>
          {
            props.value.map((it, i) => {
              return (
                <div class="flex mb10">
                  <div class="flex flex-wrap flex-grow-1">
                    <div class="flex flex-shrink-0 flex-grow-1 width-100">
                      <Field
                        style={{ padding: 0 }}
                        label-width={40}
                        label={emptyItemArr[0]}
                        v-model={it[emptyItemArr[0]]}
                        placeholder={'请输入'}
                      />
                      <Field
                        style={{ padding: 0 }}
                        label-width={40}
                        label={emptyItemArr[1]}
                        v-model={it[emptyItemArr[1]]}
                        placeholder={'请输入'}
                      />
                    </div>
                    {
                      isRelation && (
                        <div class="flex flex-grow-1 space-between">
                          <Checkbox
                            class="width-50"
                            shape="square"
                            value={it.type === 'reg'}
                            onInput={(val) => { Vue.set(it, 'type', val ? 'reg' : '') }}
                          >是否正则校验</Checkbox>
                          <Checkbox
                            class="width-50"
                            shape="square"
                            value={it.reverse}
                            onInput={(val) => { Vue.set(it, 'reverse', val) }}
                          >是否对结果取反</Checkbox>
                        </div>
                      )
                    }
                  </div>
                  <div class={'flex'}>
                    <Button
                      size={'mini'}
                      type={'danger'}
                      onClick={() => props.value.splice(i, 1)}
                    >删除</Button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
})
