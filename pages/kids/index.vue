<template>
  <section class="container flex flex-wrap py-10">
      <a-spin class="w-full" tip="Loading..." :spinning="loading">
          <div class="flex justify-end mb-4">
              <nuxt-link to="/kids/create">
                  <a-button type="primary">
                      Add new kid
                  </a-button>
              </nuxt-link>
          </div>
          <div class="flex flex-col md:flex-row border shadow-md md:h-56 mb-4" v-for="(item, index) in kids">
              <div class="md:w-1/4 flex items-center overflow-hidden">
                  <img :src="item.picture" alt="" slot="cover">
              </div>
              <div class="md:w-3/4 p-6 my-auto">
                  <div class="flex">
                      <span class="w-16 text-left">Name:</span>{{ item.name }}
                  </div>
                  <div class="flex">
                      <span class="w-16 text-left">Gender:</span>{{ item.gender }}
                  </div>
                  <div class="flex">
                      <span class="w-16 text-left">DOB:</span>{{ item.birthdate | moment('DD-MM-YYYY') }}
                  </div>
                  <div class="flex">
                      <span class="w-16 text-left">Age:</span>{{ diff(item.birthdate) }}
                  </div>
                  <div class="flex mb-4">
                      <span class="w-16 text-left">Allergies:</span>{{ item.allergies }}
                  </div>
                  <div class="flex my-auto">
                      <button type="button" name="button" class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mr-4" @click="manageQRModal(item)">
                          <a-icon type="qrcode"/>
                          <span class="pl-2">Show QR</span>
                      </button>
                      <button type="button" name="button" class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mr-4" @click="$router.push(`/kids/${item.id}`)">
                          <a-icon type="edit"/>
                          <span class="pl-2">Edit Info</span>
                      </button>
                      <a-popconfirm :title="`Delete ${item.name}?`" @confirm="deleteKid(item)" okText="Yes" cancelText="No">
                          <div class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 cursor-pointer">
                              <a-icon type="delete"/>
                              <span class="pl-2">Delete</span>
                          </div>
                      </a-popconfirm>
                  </div>
              </div>
          </div>
          <!-- <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, xl: 4 }" :dataSource="kids">
              <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-card hoverable class="group">
                      <img :src="item.picture" alt="" slot="cover">
                      <a-card-meta :title="item.name">
                          <template slot="description">
                              <div class="flex">
                                  <span class="w-16 text-left">Gender:</span>{{ item.gender }}
                              </div>
                              <div class="flex">
                                  <span class="w-16 text-left">DOB:</span>{{ item.birthdate | moment('DD-MM-YYYY') }}
                              </div>
                              <div class="flex">
                                  <span class="w-16 text-left">Age:</span>{{ diff(item.birthdate) }}
                              </div>
                              <div class="flex">
                                  <span class="w-16 text-left">Allergies:</span>{{ item.allergies }}
                              </div>
                          </template>
                      </a-card-meta>
                      <template class="ant-card-actions" slot="actions">
                          <a-icon type="qrcode" @click="manageQRModal(item)"/>
                          <a-icon type="edit" @click="$router.push(`/kids/${item.id}`)"/>
                          <a-popconfirm :title="`Delete ${item.name}?`" @confirm="deleteKid(item)" okText="Yes" cancelText="No">
                              <a-icon type="delete"/>
                          </a-popconfirm>
                      </template>
                  </a-card>
              </a-list-item>
          </a-list> -->
      </a-spin>
      <a-modal :title="modal_data.name" v-model="manage_qr_modal" @ok="manage_qr_modal = !manage_qr_modal">
          <template slot="footer">
              <a-button class="mb-2" type="primary" @click="adminCheckIn('check_in')">
                  Check In
              </a-button>
              <a-button class="mb-2" type="primary" @click="adminCheckIn('check_out')">
                  Check Out
              </a-button>
              <a-button class="mb-2" type="primary" @click="manage_qr_modal = !manage_qr_modal">
                  Resend QR Code
              </a-button>
              <a-button class="mb-2" type="primary" @click="manage_qr_modal = !manage_qr_modal">
                  Close
              </a-button>
          </template>
          <div class="flex justify-center">
              <img :src="modal_data.barcode_number" class="w-full" alt="">
          </div>
      </a-modal>
  </section>
</template>

<script>
import Vue from 'vue'
import { List, Card, Spin, Popconfirm } from 'ant-design-vue'
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

Vue.use(List);
Vue.use(Card);
Vue.use(Spin);
Vue.use(Popconfirm);

export default {
    components: {
        VueCropper
    },
    middleware: 'authenticated',
    data() {
        return {
            kids: [],
            modal_data: {},
            manage_qr_modal: false,
            loading: true
        }
    },
    mounted() {
        this.getKidsListing()
    },
    methods: {
        adminCheckIn(action) {
            let cta = ''
            if(action == 'check_in'){
                cta = 'in'
            } else {
                cta = 'out'
            }
            this.$axios.post(`access/admin`, {
                kid_id: this.modal_data.id,
                action: action
            })
            .then((res) => {
                this.$message.success(`${this.modal_data.name} has check ${cta} successfully`, 2);
                console.warn(res.data);
                this.manage_qr_modal = false
            })
        },
        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                alert('Please select an image file');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imgSrc = event.target.result;
                    // rebuild cropperjs with the updated source
                    this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        manageQRModal(data) {
            this.modal_data = data
            this.manage_qr_modal = true
        },
        deleteKid(data){
            this.$axios.delete(`/kids/${data.id}`,)
            .then((res) => {
                this.$message.success(`Deleted ${data.name}`, 2);
                this.getKidsListing()
            })
        },
        getKidsListing(){
            this.$axios.get('/kids')
            .then((res) => {
                console.warn(res);
                this.kids = res.data
                this.loading = false
            })
        },
        diff(date){
            let a = this.$moment();
            let b = this.$moment(date);
            return a.diff(b, 'years')
        },
        onChange(date, dateString) {
            console.log(date, dateString);
        }
    }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
