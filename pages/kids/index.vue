<template>
  <section class="container flex flex-wrap px-4 py-10">
      <a-spin class="w-full" tip="Loading..." :spinning="loading">
          <div class="flex justify-center mb-4">
              <div class="">
                  <a-input-search placeholder="Search kids" style="width: 200px" @search="search"/>
              </div>
              <div class="ml-auto">
                  <nuxt-link to="/kids/create">
                      <button>
                          Add new kid
                      </button>
                  </nuxt-link>
              </div>
          </div>
          <div class="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg mb-4 trans" v-for="(item, index) in kids">
              <div class="md:w-1/4 flex items-center justify-center border overflow-hidden">
                  <div class="" v-if="item.picture">
                      <img :src="item.picture" alt="" slot="cover" >
                  </div>
                  <a-avatar shape="round" :size="128" icon="user" style="display: flex; justify-content: center; align-items: center" v-else/>
              </div>
              <div class="md:w-3/4 p-6 my-auto text-left grid grid-cols-5 gap-2">
                  <span class="col-span-2 md:col-span-1">Name:</span>
                  <span class="col-span-3 md:col-span-4">{{ item.name }}</span>

                  <span class="col-span-2 md:col-span-1">Gender:</span>
                  <span class="col-span-3 md:col-span-4">{{ _.capitalize(item.gender) }}</span>

                  <span class="col-span-2 md:col-span-1">DOB:</span>
                  <span class="col-span-3 md:col-span-4">{{ item.birthdate | moment('DD-MM-YYYY') }}</span>

                  <span class="col-span-2 md:col-span-1">Age:</span>
                  <span class="col-span-3 md:col-span-4">{{ diff(item.birthdate) }}</span>

                  <span class="col-span-2 md:col-span-1">Allergies:</span>
                  <span class="col-span-3 md:col-span-4">{{ item.allergies }}</span>

                  <span class="col-span-2 md:col-span-1">Points</span>
                  <span class="col-span-3 md:col-span-3">{{sumPoints(item.points)}}</span>
                  <button type="button" class="col-end-6 col-span-5 md:col-span-1" @click="editPointsModal(item)">
                      <a-icon type="smile" theme="twoTone" />
                      <span class="pl-2">Points</span>
                  </button>

                  <span class="col-span-5 font-bold">Parent details</span>
                  <span class="col-span-5 grid grid-col-1 md:grid-cols-3 gap-2 py-2 md:py-0" v-for="p in item.kid_parents">
                      <span>{{ _.get(_.find(parents, {id: p.parent_id}), 'name') }}</span>
                      <a :href="`tel:${ _.get(_.find(parents, {id: p.parent_id}), 'contact') }`">{{ _.get(_.find(parents, {id: p.parent_id}), 'contact') }}</a>
                      <a :href="`mailto:${ _.get(_.find(parents, {id: p.parent_id}), 'email') }`">{{ _.get(_.find(parents, {id: p.parent_id}), 'email') }}</a>
                  </span>

                  <button type="button" class="col-span-5 md:col-span-2 lg:col-span-1" @click="manageQRModal(item)">
                      <a-icon type="qrcode"/>
                      <span class="pl-2">Show QR</span>
                  </button>
                  <button type="button" class="col-span-5 md:col-span-2 lg:col-span-1" @click="attendanceModal(item)">
                      <a-icon type="check-square" theme="twoTone" twoToneColor="#52c41a"/>
                      <span class="pl-2">Attendance</span>
                  </button>
                  <button type="button" class="col-span-5 md:col-span-2 lg:col-span-1" @click="$router.push(`/kids/${item.id}`)">
                      <a-icon type="edit"/>
                      <span class="pl-2">Edit Info</span>
                  </button>
                  <a-popconfirm :title="`Delete ${item.name}?`" @confirm="deleteKid(item)" okText="Yes" cancelText="No">
                      <button class="cursor-pointer col-span-5 md:col-span-2 lg:col-span-1">
                          <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
                          <span class="pl-2">Delete</span>
                      </button>
                  </a-popconfirm>
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
              <a-button class="mb-2" type="primary" :loading="resend_qr" @click="resendQR()">
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
              <h4 class="border border-black rounded-lg font-bold text-xl px-8 py-1">Attendance records</h4>
          </div>
          <div class="px-4 mb-10" v-for="(item, key) in attendance_data" v-if="!_.isEmpty(attendance_data)">
              <div class="flex">
                  <h4 class="border border-black rounded-lg font-bold text-xl px-8 py-1">{{ key }}</h4>
              </div>
              <ul :id="`attendance${key}`" class="attendance w-full bg-white">
                  <li class="table-header">
                      <span>Date time</span>
                      <span>Action</span>
                  </li>
                  <li class="table-row trans" v-for="item2 in item">
                      <span class="flex items-center">{{ convertToTime(_.get(item2, 'created_at')) }}</span>
                      <span class="flex items-center">
                          <div class="">
                              {{ _.capitalize(_.get(item2, 'checkin_method')) }} {{ _.replace(_.get(item2, 'action'), '_', ' ') }}
                          </div>
                          <div class="flex items-center ml-auto">
                              <a-icon type="edit" class="cursor-pointer" @click="editAttendanceModal(item2)"/>
                          </div>
                      </span>
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
      <a-modal title="Attendance" :visible="edit_attendance_modal" :confirmLoading="loading" @ok="editAttendance" @cancel="edit_attendance_modal = false">
          <el-date-picker v-model="edit_attendance_data.created_at" type="datetime" placeholder="Select date and time"></el-date-picker>
          <el-select v-model="edit_attendance_data.action" placeholder="Select">
           <el-option
             v-for="item in type"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
      </a-modal>
      <a-modal title="Manage Points" :visible="edit_points_modal" :confirmLoading="loading" @ok="editPoints" @cancel="edit_points_modal = false">
          <div class="grid grid-cols-3 gap-4 mb-4">
              <span class="col-span-1">Name</span>
              <span class="col-span-2">{{_.get(edit_points_data.kid, ['name'])}}</span>

              <span class="col-span-1">Points</span>
              <div class="col-span-2">
                  <a-input-number id="points" :max="100" v-model="edit_points_data.points" />
              </div>

              <span class="col-span-1">Description</span>
              <div class="col-span-2">
                  <a-textarea
                  v-model="edit_points_data.description"
                  placeholder="Briefly tell us why"
                  :autoSize="{ minRows: 2, maxRows: 5 }"
                  />
              </div>

          </div>
          <a-collapse v-model="active_point_history">
              <a-collapse-panel header="Points History" key="1">
                  <a-timeline mode="alternate">
                      <a-timeline-item :color="_.get(h, ['points']) > 0 ? 'green':'red'" v-for="h in _.get(edit_points_data, ['kid', 'points'])">
                          <a-tag :color="_.get(h, ['points']) > 0 ? 'green':'red'">{{ _.get(h, ['points']) }}</a-tag>
                          <span>{{ _.get(h, ['description']) }}</span>
                          <span>{{ _.get(h, ['created_at']) | moment('DD-MM-YYYY') }}</span>
                      </a-timeline-item>
                  </a-timeline>
              </a-collapse-panel>
          </a-collapse>
      </a-modal>
  </section>
</template>

<script>
export default {
    middleware: 'authenticated',
    data() {
        return {
            kids: [],
            parents: [],
            modal_data: {},
            manage_qr_modal: false,
            attendance_data: [],
            attendance_modal: false,
            edit_attendance_data: {},
            edit_attendance_modal: false,
            edit_points_data: {
                data: {},
                id: '',
                points: '',
                description: ''
            },
            edit_points_modal: false,
            type: [
                {label: 'Check In', value: 'check_in'},
                {label: 'Check Out', value: 'check_out'}
            ],
            resend_qr: false,
            loading: true,
            active_point_history: []
        }
    },
    mounted() {
        this.getKidsListing()
    },
    methods: {
        editPointsModal(data) {
            this.edit_points_modal = true
            this.edit_points_data.kid = data
            this.edit_points_data.points = 0
            this.edit_points_data.description = ''
        },
        editPoints() {
            this.loading = true
            this.$axios.post(`points/`, {
                kid_id: this.edit_points_data.kid.id,
                points: this.edit_points_data.points,
                description: this.edit_points_data.description,
            })
            .then((res) => {
                this.loading = false
                this.getKidsListing()
                this.$Swal.fire({
                    type: 'success',
                    text: `Points successfully ${this.edit_points_data.points > 0 ? 'added':'deducted'}`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.edit_points_modal = false
                })
            }).catch((e)=> {
                this.loading = false
            })
        },
        editAttendance() {
            this.loading = true
            this.$axios.put(`access/${this.edit_attendance_data.id}`, {
                datetime: this.edit_attendance_data.created_at,
                action: this.edit_attendance_data.action
            })
            .then((res) => {
                console.warn(res.data);
                // this.kids = res.data
                this.loading = false
                this.edit_attendance_modal = false
                this.getKidsListing()
                this.$Swal.fire({
                    type: 'success',
                    text: `Attendance successfully updated`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.attendance_modal = false
                })
            }).catch((e)=> {
                this.loading = false
            })
        },
        editAttendanceModal(data) {
            this.edit_attendance_modal = true
            this.edit_attendance_data = _.cloneDeep(data)
            this.edit_attendance_data.created_at = this.$moment.utc(this.edit_attendance_data.created_at).local().format('YYYY/MM/DD HH:mm:ss')
        },
        search(value) {
            this.loading = true
            this.$axios.get(`search/${value}`)
            .then((res) => {
                // console.warn(res.data);
                this.kids = res.data
                this.loading = false
            }).catch((e)=> {
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
                return this.$moment.utc(val).local().format('DD/MM/YYYY HH:mm:ss')
            } else {
                return '-'
            }
        },
        resendQR() {
            this.resend_qr = true
            this.$axios.get(`resendQR/${this.modal_data.id}`)
            .then((res) => {
                this.$Swal.fire({
                    type: 'success',
                    text: `QR code sent`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.resend_qr = false
                })
                // this.$message.success(`QR code sent`, 2);
                // console.warn(res.data);
            }).catch((e)=> {
                this.loading = false
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
                this.$Swal.fire({
                    type: 'success',
                    text: `${this.modal_data.name} has check ${cta} successfully`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.manage_qr_modal = false
                });
                // this.$message.success(`${this.modal_data.name} has check ${cta} successfully`, 2);
                // console.warn(res.data);
            }).catch((e)=> {
                this.loading = false
            })
        },
        manageQRModal(data) {
            this.modal_data = data
            this.manage_qr_modal = true
        },
        attendanceModal(data) {
            this.modal_data = data
            _.forEach(data.attendance, (value)=> {
                value.date = this.$moment(value.created_at).format('YYYY-MM-DD')
            });

            let grouped = _.groupBy(data.attendance, 'date');
            this.attendance_data = []
            this.attendance_data = _.cloneDeep(grouped)
            this.attendance_modal = true
        },
        deleteKid(data){
            this.$axios.delete(`/kids/${data.id}`,)
            .then((res) => {
                this.$Swal.fire({
                    type: 'success',
                    text: `Deleted ${data.name}`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.getKidsListing()
                });
                // this.$message.success(`Deleted ${data.name}`, 2);
            }).catch((e)=> {
                this.loading = false
            })
        },
        async getKidsListing(){
            try {
                let res = await this.$axios.get('/kids')
                this.kids = res.data
                let res2 = await this.$axios.get('/parents')
                this.parents = res2.data
            } catch (e) {
                this.loading = false
            } finally {
                this.loading = false
            }
        },
        diff(date){
            let a = this.$moment();
            let b = this.$moment(date);
            return a.diff(b, 'years')
        },
        sumPoints(data){
            let res = _.reduce(data, function(result, value, key) {
                result.push(value.points);
                return result;
            }, []);
            return _.sum(res)
        },
        onChange(date, dateString) {
            console.log(date, dateString);
        }
    }
}
</script>

<style lang="scss">
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: start;
    text-align: center;
}

.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
    width: 50%;
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

button{
    @apply flex items-center justify-center border rounded bg-gray-100 px-4 py-1 transition duration-500;
    &:hover{
        @apply bg-gray-200;
        border-color: #1cacd7;
        background: #1cacd7;
        color: white
    }
}
</style>
