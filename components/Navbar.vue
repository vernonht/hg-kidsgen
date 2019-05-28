<template>
    <div class="flex items-center bg-white py-4 sticky top-0 border-b z-10">
        <a-icon class="text-xl mx-4" type="bars" @click="visible = !visible"/>
            <div class="ml-auto mx-4">
                <a-button @click="showLogin = true">Login</a-button>
            </div>
            <login :showLogin="showLogin" @modal="handleModal"/>
            <div>
                <a-drawer title="Menu" :placement="placement" :closable="false" @close="onClose" :visible="visible">
                    <nuxt-link to="/kids">
                        <div class="hover:text-blue-600 cursor-pointer">
                            Kids
                        </div>
                    </nuxt-link>
                </a-drawer>
            </div>
    </div>
</template>
<script>
import Login from '~/components/Login'
import Vue from 'vue'
import { Layout, Menu, Drawer } from 'ant-design-vue'

Vue.use(Layout);
Vue.use(Menu);
Vue.use(Drawer);
  export default {
      components: {
          Login
      },
    data() {
      return {
          showLogin: false,
          visible: false,
          placement: 'left'
      };
    },
    methods: {
        handleModal(val) {
            this.showLogin = val
        },
        onBreakpoint(broken) {
          console.log(broken);
      },
        onClose() {
          this.visible = false
        }
    }
  }
</script>
<style>
</style>
