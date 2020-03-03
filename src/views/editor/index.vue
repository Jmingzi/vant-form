<template>
  <div class="editor f14">
    <div class="top h50 flex flex-center-between plr20" style="background:linear-gradient(180deg,#3d424a,#262a30)">
      <div class="flex-center">
        <span class="f16 c-fff">{{ '表单编辑器 - ' }}</span>
        <span class="c-ccc ml10">{{ fileName || '请编辑文件名' }}</span>
        <a href="javascript:;" class="c-aaa ml5" @click="handleFileName"><icon name="edit" /></a>
      </div>
      <div v-if="fileName" class="flex items-center">
        <span class="c-ccc flex-center mr20 cp" @click="handleImport(false)">
          <icon name="upgrade" />
          <span>本地导入</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handleExport(false)">
          <icon name="down" />
          <span>本地导出</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handleImport(true)">
          <icon name="upgrade" />
          <span>远程导入</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handleExport(true)">
          <icon name="down" />
          <span>远程下载</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handleSave">
          <icon name="description" />
          <span>保存</span>
        </span>
        <span class="c-ccc flex-center mr20 cp" @click="handlePreview">
          <icon name="video-o" />
          <span>预览</span>
        </span>
        <Button
          v-if="current"
          size="small"
          type="danger"
          @click="handleDel"
        >
          删除控件
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
import { Field, Radio, RadioGroup, Switch, Cell, Button, Toast, Icon, Dialog } from 'vant'
import Options from './options'
import { getUid, triggerUpload } from '../../components/form-item/utils'
import { http } from '../../assets/api'
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
    const fileName = ref(localStorage.getItem('vant-form-file-name'))
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

    const handleSave = async (toast = true, force) => {
      if (!state.dataList.length) {
        Toast('请添加内容')
        return
      }
      await Dialog.confirm({ message: '确定要保存吗？' })
      await http.post('editor/savefile', {
        name: fileName.value,
        content: JSON.stringify(state.dataList),
        force
      }).catch(res => {
        if (res.msg === '文件已存在') {
          confirm('文件已存在，是否覆盖？')
          handleSave(toast, true)
        }
      })
      toast && Toast('保存到服务器成功')
    }
    const clone = (item) => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.id = Date.now()
      return newItem
    }
    const handleName = () => {
      const name = fileName.value ? fileName.value : prompt('请输入文件名，例如 schema.json')
      if (/\.json$/.test(name)) {
        return name
      } else {
        Toast('必须是 json 文件')
        return false
      }
    }
    const handleExport = (fromServer) => {
      if (fromServer) {
        http.get('editor/download', { name: fileName.value }).then(() => {
          let url = `${location.origin.replace(`:${location.port}`, '')}:3030/download`
          url += `?name=${fileName.value}&download=true`
          location.href = url
        })
      } else {
        Toast('请先保存，再远程下载')
      }
    }

    return {
      itemList,
      builtIn,
      schema,
      ...toRefs(state),
      fileName,
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
      async handleDel () {
        await Dialog.confirm({ message: '确定要删除吗？' })
        const index = state.dataList.findIndex(x => x.id === state.current.id)
        if (index > -1) {
          state.dataList.splice(index, 1)
          setCurrent(null)
          Toast('删除成功')
        } else {
          Toast('该控件不存在')
        }
      },
      async handlePreview () {
        await Dialog.confirm({ message: '确认保存过了吗？' })
        ctx.root.$router.push(`/preview?key=${fileName.value}`)
      },
      handleImport (fromServer) {
        if (fromServer) {
          const name = handleName()
          if (name) {
            http.get('editor/import', { name }).then(res => {
              setDataList(res.data)
              Toast('导入成功')
            })
          }
        } else {
          // 上传文件
          triggerUpload(async (e) => {
            const res = await http.post('editor/upload', { file: e.target.files[0] }, { isUpload: true })
            setDataList(res.data)
            Toast('导入成功')
          })
        }
      },
      handleExport,
      handleFileName () {
        const name = handleName()
        if (name) {
          fileName.value = name
          localStorage.setItem('vant-form-file-name', name)
        }
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
