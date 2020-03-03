<script lang="jsx">
import Render from '@/components/form-item/render'
// import { PageButton } from 'esc-ui'
import { validate } from '@/components/form-item/utils'
import { ref } from '@vue/composition-api'
import { Toast } from 'vant'
import { http } from '../assets/api'

export default {
  setup (p, ctx) {
    const route = ctx.root.$route
    const isMobile = /iphone|android/i.test(navigator.userAgent)
    const data = ref({})
    const dataList = ref([])
    http.get('editor/import', { name: route.query.key }).then(res => {
      dataList.value = res.data
    })

    const render = () => (
      <div style="width:100%;height:100%;padding-top:10px;overflow:auto;">
        <Render
          schema={dataList.value}
          data={data.value}
          submit={(schema, data) => {
            // 校验
            if (validate(schema, data)) {
              Toast('提交成功，data 已打印在控制台！')
              // eslint-disable-next-line
              console.log(JSON.stringify(data))
            }
          }}
        />
      </div>
    )

    return () => (
      <div class="preview">
        {
          isMobile ? render() : (
            <div class="preview__mobile">{ render() }</div>
          )
        }
      </div>
    )
  }
}
</script>

<style lang="less">
.preview {
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #eee;
  &__mobile {
    width: 375px;
    height: 600px;
    margin: 0 auto;
    transform: translateZ(0);
    overflow: auto;
  }
}
</style>
