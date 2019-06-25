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
                <div class="flex items-center mx-auto mb-4 w-48 h-48 overflow-hidden">
                    <img :src="kid.picture" alt="">
                </div>
                <div class="flex justify-center mb-4">
                    <span class="w-16 text-center">Name:</span>{{ kid.name }}
                </div>
                <div class="mx-auto">
                    <button class="button--grey" @click="detected = ''">
                        Rescan QR Code
                    </button>
                    <button class="button--grey" :disabled="action.length == 0" @click="manageAttendance()">
                        Check {{ action }}
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
      manageAttendance() {
          let action = ''
          switch (this.action) {
              case 'In':
              action = 'check_in';
              break;
              case 'Out':
              action = 'check_out';
              break;
              default:
          }

          this.$axios.post(`access/manageAttendance`, {
              kid_id: this.kid.id,
              action: action
          })
          .then((res) => {
              this.$message.success(`${this.kid.name} has check ${this.action.toLowerCase()} successfully`, 2);
              console.warn(res.data);
              this.$router.push('/')
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
