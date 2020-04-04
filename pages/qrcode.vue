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
                <kid-info :kid="kid" :parents="parents" :loading="loading" @setLoading="setLoading" @updated="onDecode(detected)"/>
                <div class="grid grid-cols-3 gap-2 mx-auto">
                    <button class="button col-span-1" @click="rescan()">
                        <a-icon type="sync" />
                        <span class="pl-2">Rescan QR Code</span>
                    </button>
                    <button class="button col-span-1" @click="manageAttendance('check_in')">
                        <a-icon type="login" />
                        <span class="pl-2">Check In</span>
                    </button>
                    <button class="button col-span-1" @click="manageAttendance('check_out')">
                        <a-icon type="logout" />
                        <span class="pl-2">Check Out</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import KidInfo from '@/components/KidInfo'
    import Vue from 'vue'
    import VueQuagga from 'vue-quaggajs';

    // register component 'v-quagga'
    Vue.use(VueQuagga);

    export default {
        components: {
            KidInfo
        },
        name: 'VueBarcodeTest',
        data () {
            return {
                detected: '',
                kid: {},
                parents: [],
                action: '', //Depreciated, using manual check in/out
                loading: true,
            }
        },
        created() {
            this.getParents()
        },
        mounted() {
        },
        methods: {
            setLoading(val) {
                this.loading = val
            },
            async getParents() {
                let res = await this.$axios.get('/parents')
                this.parents = res.data
            },
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
