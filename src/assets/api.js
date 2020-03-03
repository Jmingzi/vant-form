import { Toast } from 'vant'
import { Http, Loading } from 'esc-ui'

export const http = new Http({
  baseUrl: `${location.origin.replace(`:${location.port}`, '')}:3030`,
  urlMap: {
    editor: {
      savefile: '/savefile',
      download: '/download',
      import: '/import',
      upload: '/upload'
    }
  },
  notify: Toast,
  loadingMethods: Loading.instance,
  contentType: 'application/json',
  beforeThen (res) {
    res.data = res.data || res.value
    return res
  }
})
