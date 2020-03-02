<script lang="jsx">
import Render from '@/components/form-item/render'
import { PageButton } from 'esc-ui'
import { validate } from '@/components/form-item/utils'
import { ref } from '@vue/composition-api'
import { Toast } from 'vant'

export default {
  setup (p, ctx) {
    const route = ctx.root.$route
    const isMobile = /iphone|android/.test(navigator.userAgent)
    const data = ref({})
    let dataList = localStorage.getItem(route.query?.key)
    // eslint-disable-next-line
    if (dataList) {
      dataList = ref(JSON.parse(dataList))
    } else {
      dataList = ref([])
    }
    const render = () => (
      <div>
        <Render schema={dataList.value} data={data.value} />
        <PageButton buttons={[{
          text: '提 交',
          color: 'rgb(255, 77, 77)',
          click () {
            // 校验
            if (validate(dataList.value, data.value)) {
              Toast('提交成功，data 已打印在控制台！')
              console.log(JSON.stringify(data.value))
            }
          }
        }]} />
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
