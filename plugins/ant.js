import Vue from 'vue'
import { Button, DatePicker, message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';  // or 'ant-design-vue/dist/antd.less'

Vue.use(Button);
Vue.use(DatePicker);
Vue.prototype.$message = message
