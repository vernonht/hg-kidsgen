<template>
    <div class="flex items-center bg-white py-4 sticky top-0 border-b z-10">
        <a-icon class="text-xl mx-4" type="bars" @click="visible = !visible"/>
            <div class="ml-auto mx-4">
                <a-dropdown v-if="$store.state.user.details.name">
                    <div class="ant-dropdown-link cursor-pointer">
                        {{ $store.state.user.details.name }} <a-icon type="down" />
                    </div>
                    <a-menu slot="overlay" @click="onClick">
                        <a-menu-item key="logout">Logout</a-menu-item>
                    </a-menu>
                </a-dropdown>
                <a-button @click="showLogin = true" v-else>Login</a-button>
            </div>
            <login :showLogin="showLogin" @modal="handleModal"/>
            <div>
                <a-drawer title="Menu" :placement="placement" :closable="true" @close="onClose" :visible="visible">
                    <div class="" @click="visible = false">
                        <nuxt-link to="/">
                            <div class="border-b px-4 py-2 hover:bg-gray-200 trans cursor-pointer">
                                Home
                            </div>
                        </nuxt-link>
                    </div>
                    <div class="" @click="visible = false">
                        <nuxt-link to="/qrcode">
                            <div class="border-b px-4 py-2 hover:bg-gray-200 trans cursor-pointer">
                                Check In/Out
                            </div>
                        </nuxt-link>
                    </div>
                    <div class="" @click="visible = false">
                        <nuxt-link to="/kids">
                            <div class="border-b px-4 py-2 hover:bg-gray-200 trans cursor-pointer">
                                Kids
                            </div>
                        </nuxt-link>
                    </div>
                    <div class="" @click="visible = false">
                        <nuxt-link to="/stats">
                            <div class="border-b px-4 py-2 hover:bg-gray-200 trans cursor-pointer">
                                Stats
                            </div>
                        </nuxt-link>
                    </div>
                </a-drawer>
            </div>
    </div>
</template>
<script>
import Login from '~/components/Login'
import Vue from 'vue'
import { Layout, Menu, Drawer, Dropdown } from 'ant-design-vue'
import Cookies from 'js-cookie';

Vue.use(Layout);
Vue.use(Menu);
Vue.use(Drawer);
Vue.use(Dropdown);
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
    mounted() {
        if(Cookies.get('token')) {
            this.getUserDetails()
        }
    },
    methods: {
        onClick({ key }) {
            if(key == 'logout') {
                this.$store.commit('token/remove')
                this.$store.commit('user/remove')
                location.href = '/'
                console.log(`Click on item ${key}`);
            }
        },
        getUserDetails() {
            this.$axios.post(`/user`)
            .then((res) => {
                this.$store.commit('user/add', res.data.success)
            })
        },
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
