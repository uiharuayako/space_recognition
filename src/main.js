import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App.vue';
import Meta from 'vue-meta';
import BaiduMap from "vue-baidu-map";
import Axios from 'axios';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
Vue.use(Meta);
Vue.use(Antd);
Vue.prototype.$axios=Axios;
Axios.defaults.baseURL = '/api'
Vue.use(BaiduMap,{ak:'M4jKcZ4K9kHMtevZOXlfszDnlo89GwhG'})
new Vue({
  render: h => h(App),
}).$mount('#app')