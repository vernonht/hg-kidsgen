<template>
    <section class="container">
        <div class="flex" v-if="detected == ''">
            <qrcode-stream @decode="onDecode"></qrcode-stream>
        </div>
        <div class="flex flex-col py-10" v-else>
            <div class="mx-auto" v-if="loading">
                <a-icon type="loading" />
                Loading data
            </div>
            <div class="mx-auto" v-else>
                <div class="flex items-center mx-auto mb-4 w-56 h-56 overflow-hidden">
                    <img :src="kid.picture" alt="">
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-1/2 text-right font-bold pr-2">Name:</span>
                    <span class="w-1/2 text-left">{{ kid.name }}</span>
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-1/2 text-right font-bold pr-2">Gender:</span>
                    <span class="w-1/2 text-left">{{ kid.gender }}</span>
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-1/2 text-right font-bold pr-2">Birth Date:</span>
                    <span class="w-1/2 text-left">{{ kid.birthdate }}</span>
                </div>
                <div class="flex justify-center mb-4" v-if="getWeek(kid.birthdate)">
                    <span class="w-1/2 text-left"></span>
                    <span class="w-1/2 text-left text-red-600">{{ getWeek(kid.birthdate) }}</span>
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-1/2 text-right font-bold pr-2">Allergies:</span>
                    <span class="w-1/2 text-left">{{ kid.allergies }}</span>
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-1/2 text-right font-bold pr-2">Last {{ _.replace(kid.attendance.action, '_', ' ') }}:</span>
                    <span class="w-1/2 text-left">{{ $moment.utc(kid.attendance.created_at).local().format('DD/MM/YYYY hh:mm a') }}</span>
                </div>
                <div class="mx-auto">
                    <button class="button--grey" @click="rescan()">
                        Rescan QR Code
                    </button>
                    <button class="button--grey" @click="manageAttendance('check_in')">
                        Check In
                    </button>
                    <button class="button--grey" @click="manageAttendance('check_out')">
                        Check Out
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import VueQuagga from 'vue-quaggajs';

// register component 'v-quagga'
Vue.use(VueQuagga);

export default {
  name: 'VueBarcodeTest',
  data () {
    return {
      detected: '',
      kid: {},
      action: '',
      loading: true,
    }
  },
  methods: {
      getWeek(date) {
          if(this.$moment(date, "YYYY-MM-DD").week() == this.$moment().week() ) {
              return 'Birthday is this week!'
          }
      },
      rescan() {
          this.detected = ''
          this.kid = {}
          this.loading = true
      },
      manageAttendance(action) {

          this.$axios.post(`access/manageAttendance`, {
              kid_id: this.kid.id,
              action: action
          })
          .then((res) => {
              this.$Swal.fire({
                  type: 'success',
                  text: `${this.kid.name} has ${_.replace(action, '_', ' ')} successfully`,
                  showConfirmButton: false,
                  timer: 2000
              }).then(()=> {
                  this.$router.push('/')
              });
              // this.$message.success(`${this.kid.name} has check ${this.action.toLowerCase()} successfully`, 2);
              // console.warn(res.data);
          })
      },
      onDecode (decodedString) {
          this.detected = decodedString
          // this.detected = 'eyJpdiI6Im5sU0x2V1pnZ3JnQTI0a0hDRXlXUXc9PSIsInZhbHVlIjoiU09jRnJhWWFqWjJcL2hVc0kxeE9GNWc9PSIsIm1hYyI6ImVlOGNkNjQ0OTM4YzJjMTVmNTM1MzUxYTdkMDU4NzM3YTIzYmJlZmQzMGM4OGRkNTc3NWJmMGRhYTRmZjdiOGYifQ=='
          this.$axios.get(`/access/${this.detected}`)
          .then((res) => {
              // console.warn(res.data);
              this.kid = res.data
              if(this.kid.attendance) {
                  if(this.kid.attendance.action == 'check_in'){
                      this.action = 'Out'
                  } else {
                      this.action = 'In'
                  }
              } else {
                  this.action = 'In'
              }
              this.loading = false
          })
          // console.log('detected', decodedString)
      }

  }
}
</script>
