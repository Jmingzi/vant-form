<template>
  <div class="editor f14">
    <div class="top h50 flex flex-center-between plr20" style="background:linear-gradient(180deg,#3d424a,#262a30)">
      <span class="f16 c-fff">{{ orgName ? `编辑 - ${orgName}` : '表单编辑器' }}</span>
      <div class="flex items-center">
        <span class="c-ccc flex-center mr20 cp">
          <icon name="upgrade" />
          <span>导入</span>
        </span>
        <span class="c-ccc flex-center mr20 cp">
          <icon name="down" />
          <span>导出</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handleSave">
          <icon name="description" />
          <span>保存到本地</span>
        </span>
        <span class="c-ccc mr20 flex-center cp" @click="handleDelLocal">
          <icon name="delete" />
          <span>清除本地</span>
        </span>
        <Button
          v-if="current"
          style="margin-right: 10px"
          size="small"
          type="danger"
          @click="handleDel"
        >
          删除控件
        </Button>
        <Button
          size="small"
          @click="handlePreview"
          type="info"
        >
          预览
        </Button>
      </div>
    </div>
    <div class="flex">
      <div class="editor__left flex-shrink-0">
        <p class="ml20 pl5 mb10">基础控件</p>
        <draggable
          class="flex flex-wrap pl20"
          :list="itemList"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="clone"
          :sort="false"
        >
          <div
            class="editor__item flex-center plr5 items-center c-999"
            v-for="element in itemList"
            :key="element.id"
          >
            {{ element.label }}
          </div>
        </draggable>
        <p class="ml20 pl5 mb10">内置控件</p>
        <draggable
          class="flex flex-wrap pl20"
          :list="builtIn"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="clone"
          :sort="false"
        >
          <div
            class="editor__item flex-center plr5 items-center c-999"
            v-for="element in builtIn"
            :key="element.id"
          >
            {{ element.label }}
          </div>
        </draggable>
      </div>
      <div
        class="editor__center flex-shrink-0"
        overflow-a
        :class="{ 'no-list': dataList.length === 0 }"
      >
        <draggable
          class="editor__center--drag"
          :list="dataList"
          :animation="150"
          group="people"
          @change="log"
        >
          <div
            class="editor__item plr10 flex items-center"
            v-for="element in dataList"
            :class="{ active: current && current.id === element.id }"
            :key="element.id"
            @click="setCurrent(element)"
          >
            <span v-if="element.required" style="color: red">*</span>
            <Icon v-if="element.info" name="info-o" />
            <span>{{ element.label }}</span>
          </div>
        </draggable>
      </div>
      <div class="editor__right pb50">
      <template v-if="schema">
        <div class="bd bb bd-eee" v-for="item in schema" :key="item.id">
          <Field
            v-if="item.type === 'field'"
            :label="item.label"
            :placeholder="`请输入${item.label}`"
            :value="current[item.field]"
            @input="val => handleInput(val, item.field)"
          />
          <Field
            :label="item.label"
            v-else-if="item.type === 'radio'"
          >
            <RadioGroup
              slot="input"
              class="flex align-items"
              :value="current[item.field]"
              @input="val => handleInput(val, item.field)"
            >
              <Radio class="mr10" v-for="i in item.options" :key="i" :name="i">{{ i }}/</Radio>
            </RadioGroup>
          </Field>
          <Field
            v-else-if="item.type === 'switch'"
            :label="item.label"
            center
          >
            <VSwitch
              slot="right-icon"
              :value="current[item.field]"
              @input="val => handleInput(val, item.field)"
            />
          </Field>
          <Options
            v-else-if="item.type === 'option'"
            :value="current[item.field]"
            :label="item.label"
            :emptyItem="{ label: '', value: '' }"
          />
          <Options
            v-else-if="item.type === 'option2'"
            :value="current[item.field]"
            :label="item.label"
            :emptyItem="{ field: '', value: '' }"
          />
        </div>
      </template>
    </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { defineComponent, toRefs, computed, watch, ref } from '@vue/composition-api'
import draggable from 'vuedraggable'
// eslint-disable-next-line
import { setCurrent, setDataList, state } from './data'
import itemList, { builtIn } from './widget'
import formSchema from './field-schema'
import { Field, Radio, RadioGroup, Switch, Cell, Button, Toast, Icon } from 'vant'
// import { getTemplate } from '../../api'
import Options from './options'
import { getUid } from '../../components/form-item/utils'
import Render from '../../components/form-item/render'

export default defineComponent({
  name: 'editor',
  components: {
    draggable,
    Field,
    Radio,
    RadioGroup,
    VSwitch: Switch,
    Cell,
    Options,
    Button,
    Icon,
    Render
  },
  setup (props, ctx) {
    // const params = ctx.root.$route.params
    const localKey = 'widget'
    const localData = localStorage.getItem(localKey)
    const orgName = ref('')
    // if (params && params.id) {
    // getTemplate(params.id).then(res => {
    //   orgName.value = res.data.orgName
    if (localData) {
      setDataList(JSON.parse(localData))
      Toast('存在草稿，已还原草稿内容')
    }
    //   setDataList(res.data.config.map((x, i) => {
    //     if (x.id) {
    //       return x
    //     }
    //     x.id = i
    //     return x
    //   }))
    // })
    // }

    const schema = computed(() => {
      if (state.current) {
        const currentTypeArr = formSchema.type(state.current).options
        const item = itemList.find(x => currentTypeArr.includes(x.type)) || itemList[0]
        const arr = Object.keys({ ...item, ...state.current }).map(k => {
          let schema = formSchema[k]
          if (schema instanceof Function) {
            schema = schema(state.current)
          }
          if (schema) {
            schema = { ...schema, field: k }
          }
          return schema
        })
        return arr.filter(Boolean)
      }
    })

    watch(() => state.current, val => {
      if (val && !val.field) {
        val.field = getUid()
      }
    })

    // watch(() => state.dataList, val => {
    //   console.log(val)
    // }, { deep: true, lazy: true })

    const handleSave = (toast = true) => {
      localStorage.setItem(localKey, JSON.stringify(state.dataList))
      toast && Toast('保存到本地成功')
    }
    const clone = (item) => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.id = Date.now()
      return newItem
    }

    return {
      itemList,
      builtIn,
      schema,
      ...toRefs(state),
      orgName,
      setCurrent,
      clone,
      handleSave,
      log (evt) {
        if (evt.added) {
          setCurrent(evt.added.element)
        }
      },
      handleInput (val, field) {
        if (state.current[field] === undefined) {
          Vue.set(state.current, field, val)
        } else {
          state.current[field] = val
        }
      },
      handleDel () {
        const index = state.dataList.findIndex(x => x.id === state.current.id)
        if (index > -1) {
          state.dataList.splice(index, 1)
          setCurrent(null)
          Toast('删除成功')
        } else {
          Toast('该控件不存在')
        }
      },
      handleDelLocal () {
        localStorage.removeItem(localKey)
        Toast('删除本地成功')
        setDataList([])
        setCurrent()
      },
      handlePreview () {
        handleSave(false)
        ctx.root.$router.push(`/preview?key=${localKey}`)
      }
    }
  }
})
</script>

<style lang="less">
.editor {
  .cp {
    cursor: pointer;
  }
  &__left {
    width: 200px;
    padding-top: 20px;
    .editor__item {
      width: 75px;
      height: 40px;
      // margin: 0 auto 10px auto;
      font-size: 12px;
      border: 1px #ccc dashed;
      margin-bottom: 10px;
      &:nth-of-type(2n - 1) {
        margin-right: 10px;
      }
    }
  }
  &__center {
    width: 400px;
    height: e('calc(100vh - 50px)');
    background-color: #eee;
    padding: 20px;
    &--drag {
      min-height: 100%;
    }
    &.no-list {
      position: relative;
      &:after {
        content: '请从左侧拖入组件到此处';
        width: 100%;
        position: absolute;
        left: 0;
        text-align: center;
        top: 30%;
        color: #999;
      }
    }
    .editor__item {
      min-height: 50px;
      border: 1px #ddd solid;
    }
    .active {
      border: 1px blue dashed;
    }
    .sortable-chosen {
      /*border: 1px ;*/
      opacity: 0.5;
    }
  }
  &__right {
    flex-grow: 1;
    height: e('calc(100vh - 50px)');
    overflow: auto;
  }
  &__item {
    background-color: #ffffff;
    cursor: move;
  }
}
</style>
