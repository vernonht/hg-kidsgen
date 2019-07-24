<template>
  <section class="container flex flex-wrap px-4 py-10">
      <a-spin class="w-full" tip="Loading..." :spinning="loading">
          <div class="flex justify-center mb-4">
              <div class="">
                  <a-input-search placeholder="Search kids" style="width: 200px" @search="search"/>
              </div>
              <div class="ml-auto">
                  <nuxt-link to="/kids/create">
                      <a-button type="primary">
                          Add new kid
                      </a-button>
                  </nuxt-link>
              </div>
          </div>
          <div class="flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-lg md:h-56 mb-4 trans" v-for="(item, index) in kids">
              <div class="md:w-1/4 flex items-center justify-center border border-r overflow-hidden">
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
                  <div class="flex flex-col md:flex-row my-auto">
                      <button type="button" name="button" class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mb-4 md:mr-4" @click="manageQRModal(item)">
                          <a-icon type="qrcode"/>
                          <span class="pl-2">Show QR</span>
                      </button>
                      <button type="button" name="button" class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mb-4 md:mr-4" @click="attendanceModal(item.attendance)">
                          <a-icon type="check-square"/>
                          <span class="pl-2">Attendance</span>
                      </button>
                      <button type="button" name="button" class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mb-4 md:mr-4" @click="$router.push(`/kids/${item.id}`)">
                          <a-icon type="edit"/>
                          <span class="pl-2">Edit Info</span>
                      </button>
                      <a-popconfirm :title="`Delete ${item.name}?`" @confirm="deleteKid(item)" okText="Yes" cancelText="No">
                          <div class="flex items-center border rounded bg-gray-100 hover:bg-gray-200 trans px-4 py-2 mb-4 cursor-pointer">
                              <a-icon type="delete"/>
                              <span class="pl-2">Delete</span>
                          </div>
                      </a-popconfirm>
                  </div>
              </div>
          </div>
      </a-spin>
      <a-modal :title="modal_data.name" v-model="manage_qr_modal" @ok="manage_qr_modal = !manage_qr_modal">
          <template slot="footer">
              <a-button class="mb-2" type="primary" @click="adminCheckIn('check_in')">
                  Check In
              </a-button>
              <a-button class="mb-2" type="primary" @click="adminCheckIn('check_out')">
                  Check Out
              </a-button>
              <a-button class="mb-2" type="primary" @click="resendQR()">
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
      <a-modal :title="modal_data.name" v-model="attendance_modal" :width="700" @ok="attendance_modal = !attendance_modal">
          <template slot="footer">
              <a-button class="mb-2" type="primary" @click="attendance_modal = !attendance_modal">
                  Close
              </a-button>
          </template>
          <div class="flex justify-center mb-4">
              <h4 class="border border-black rounded-lg font-bold text-xl px-8 py-1">Latest 5 attendance records</h4>
          </div>
          <div class="px-4 mb-10" v-for="(item, key) in attendance_data" v-if="!_.isEmpty(attendance_data)">
              <div class="flex">
                  <h4 class="border border-black rounded-lg font-bold text-xl px-8 py-1">{{ key }}</h4>
              </div>
              <ul :id="`attendance${key}`" class="attendance w-full bg-white">
                  <li class="table-header">
                      <span>Check In Time</span>
                      <span>Check In Method</span>
                      <span>Check Out Time</span>
                      <span>Check Out Method</span>
                  </li>
                  <li class="table-row trans">
                      <span>{{ convertToTime(_.get(_.find(item, {'action': 'check_in'}), 'created_at')) }}</span>
                      <span>{{ _.get(_.find(item, {'action': 'check_in'}), 'checkin_method') || '-' }}</span>
                      <span>{{ convertToTime(_.get(_.find(item, {'action': 'check_out'}), 'created_at')) }}</span>
                      <span>{{ _.get(_.find(item, {'action': 'check_out'}), 'checkin_method') || '-' }}</span>
                  </li>
              </ul>
              <!-- <div class="flex justify-end py-2">
                  <button type="button" class="bg-white border rounded px-4 py-1 mr-2" @click="doit('attendance'+key, 'csv')">Export to CSV</button>
                  <button type="button" class="bg-white border rounded px-4 py-1" @click="doit('attendance'+key, 'xlsx')">Export to XLSX</button>
              </div> -->
          </div>
          <div class="flex justify-center px-4 mb-4" v-if="_.isEmpty(attendance_data)">
              No data
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
            attendance_data: [],
            attendance_modal: false,
            loading: true
        }
    },
    mounted() {
        this.getKidsListing()
    },
    methods: {
        search(value) {
            this.loading = true
            this.$axios.get(`search/${value}`)
            .then((res) => {
                // console.warn(res.data);
                this.kids = res.data
                this.loading = false
            })
        },
        doit(id, type, fn, dl) {
            var elt = document.getElementById(id);
            var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
            return dl ?
            XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
            XLSX.writeFile(wb, fn || ('test.' + (type || 'xlsx')));
        },
        convertToTime(val) {
            if(val) {
                return this.$moment(val).format('hh:mm')
            } else {
                return '-'
            }
        },
        resendQR() {
            // console.warn(this.modal_data.id);
            this.$axios.get(`resendQR/${this.modal_data.id}`)
            .then((res) => {
                this.$message.success(`QR code sent`, 2);
                // console.warn(res.data);
            })
        },
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
                // console.warn(res.data);
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
        attendanceModal(data) {
            _.forEach(data, (value)=> {
                value.date = this.$moment(value.created_at).format('YYYY-MM-DD')
            });

            let grouped = _.groupBy(data, 'date');
            // console.warn(grouped);
            this.attendance_data = grouped
            this.attendance_modal = true
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
                // console.warn(res);
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

.table-header {
    display: flex;
    background-color: #95A5A6;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    @apply font-bold rounded mb-4 text-white;
}

.table-header span, .table-row span {
    width: 25%;
    padding: 15px;
}

.table-row {
    display: flex;
    background-color: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(0,0,0,0.1);
    @apply mb-4;
}

.table-row:hover {
    background-color: #eee;
}
</style>
