import { Toast } from 'vant'
import { Http, Loading } from 'esc-ui'

export const http = new Http({
  baseUrl: location.port && 'http://localhost:3030',
  urlMap: {
    editor: {
      savefile: '/vant-form/savefile',
      download: '/vant-form/download',
      import: '/vant-form/import',
      upload: '/vant-form/upload'
    }
  },
  notify: Toast,
  loadingMethods: Loading.instance,
  contentType: 'application/json'
})
