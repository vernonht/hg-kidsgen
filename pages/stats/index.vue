<template>
  <section class="container flex mx-auto py-10">
      <a-spin class="w-full" tip="Loading..." :spinning="loading">
          <!-- <bar-chart :datacollection="datacollection" v-if="!loading"/> -->
          <div class="px-4">
              <line-chart :datacollection="datacollection2" v-if="!loading"/>
          </div>
          <div class="flex justify-end px-4 my-4">
              <a-select
              size="large"
              mode="multiple"
              placeholder="Filter Kid"
              optionFilterProp="children"
              allowClear
              @change="handleChange"
              style="width: 400px"
              >
              <a-select-option :value="i.id" v-for="i in kids" :key="i.id">{{ i.name }}</a-select-option>
          </a-select>
          </div>
          <div class="overflow-auto px-4 mb-4" v-for="(item, key) in attendance">
              <div class="flex">
                  <h4 class="border border-black rounded-lg font-bold text-xl px-8 py-1">{{ key }}</h4>
              </div>
              <table :id="`attendance${key}`" class="attendance w-full border bg-white">
                  <tr class="border">
                      <th>Kid Name</th>
                      <th>Date Time</th>
                      <th>Action</th>
                  </tr>
                  <tr class="border trans" v-for="(x, index) in item">
                      <td>{{ _.get(x, ['kid', 'name']) }}</td>
                      <td>{{ convertToTime(_.get(x, 'created_at')) }}</td>
                      <td>{{ _.capitalize(_.get(x, 'checkin_method')) }} {{ _.replace(_.get(x, 'action'), '_', ' ') }}</td>
                      <!-- <td>{{ convertToTime(_.get(_.find(x, {'action': 'check_in'}), 'created_at')) }}</td>
                      <td>{{ _.get(_.find(x, {'action': 'check_in'}), 'checkin_method') || '-' }}</td>
                      <td>{{ convertToTime(_.get(_.find(x, {'action': 'check_out'}), 'created_at')) }}</td>
                      <td>{{ _.get(_.find(x, {'action': 'check_out'}), 'checkin_method') || '-' }}</td> -->
                  </tr>
                  <tr class="border trans">
                      <td>Total:</td>
                      <td :colspan="2" class="text-right">
                          {{ Object.keys(item).length }} {{Object.keys(item).length > 1 ? 'records' : 'record'}}
                          {{ Object.keys(grouped_attendance[key]).length }} {{Object.keys(grouped_attendance[key]).length > 1 ? 'kids' : 'kid'}}
                      </td>
                  </tr>
              </table>
              <div class="flex justify-end py-2">
                  <button type="button" class="bg-white border rounded px-8 py-1 mr-2" @click="doit('attendance'+key, 'csv')">Export to CSV</button>
                  <button type="button" class="bg-white border rounded px-8 py-1" @click="doit('attendance'+key, 'xlsx')">Export to XLSX</button>
              </div>
          </div>
      </a-spin>
  </section>
</template>

<script>
import Vue from 'vue'
import { List, Card, Spin, Popconfirm, Select } from 'ant-design-vue'
import BarChart from '@/components/BarChart'
import LineChart from '@/components/LineChart'
import XLSX from 'xlsx';

Vue.use(List);
Vue.use(Card);
Vue.use(Spin);
Vue.use(Popconfirm);
Vue.use(Select);

export default {
    components: {
      BarChart,
      LineChart,
  },
    middleware: 'authenticated',
    data() {
        return {
            attendance: {},
            grouped_attendance: {},
            boys_attendance: {},
            girls_attendance: {},
            datacollection: {},
            datacollection2: {},
            loading: true,
            date_filter: '',
            kid_ids: [],
            kids: []
        }
    },
    mounted() {
        this.getKids()
        this.getStats()
    },
    methods: {
        handleChange (value) {
            console.warn(value);
            this.getStats('', value)
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
        getKids() {
            this.$axios.get('/kids')
            .then((res) => {
                this.kids = res.data
            })
        },
        getStats(dateFilter, kidFilter) {
            this.$axios.post('/stats', {
                filter: '',
                kid: kidFilter || []
            })
            .then((res) => {
                let data = []
                let boys = []
                let girls = []
                this.attendance = res.data
                _.forEach(res.data, (value, key)=> {
                    this.grouped_attendance[key] = _.groupBy(value, 'kid_id');
                    data.push(Object.keys(this.grouped_attendance[key]).length)
                    this.boys_attendance[key] = _.groupBy(_.filter(value, function(o) { return o.kid.gender == 'male'; }), 'kid_id');
                    boys.push(Object.keys(this.boys_attendance[key]).length)
                    this.girls_attendance[key] = _.groupBy(_.filter(value, function(o) { return o.kid.gender == 'female'; }), 'kid_id');
                    girls.push(Object.keys(this.girls_attendance[key]).length)
                });
                let keys = _.keys(this.grouped_attendance)

                this.datacollection = {
                  //Data to be represented on x-axis
                  labels: keys,
                  datasets: [
                    {
                      label: 'Data One',
                      backgroundColor: '#f87979',
                      pointBackgroundColor: 'white',
                      borderWidth: 1,
                      pointBorderColor: '#249EBF',
                      //Data to be represented on y-axis
                      data: [40, 20, 30]
                  },
                    {
                      label: 'Data Two',
                      backgroundColor: '#249EBF',
                      pointBackgroundColor: 'white',
                      borderWidth: 1,
                      pointBorderColor: '#249EBF',
                      //Data to be represented on y-axis
                      data: [40, 20, 30]
                    }
                  ]
                },
                this.datacollection2 = {
                    //Data to be represented on x-axis
                    labels: keys,
                    datasets: [
                        {
                            label: 'Total Kids',
                            backgroundColor: '#f87979',
                            borderColor: '#f87979',
                            //Data to be represented on y-axis
                            data: data,
                            fill: false,
                            lineTension: 0
                        },
                        {
                            label: 'Boys',
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            //Data to be represented on y-axis
                            data: boys,
                            fill: false,
                            lineTension: 0
                        },
                        {
                            label: 'Girls',
                            backgroundColor: 'pink',
                            borderColor: 'pink',
                            //Data to be represented on y-axis
                            data: girls,
                            fill: false,
                            lineTension: 0
                        }
                    ]
                },
                this.loading = false
            })
        },
    }
}
</script>
<style scoped>
.attendance tr:nth-child(odd){background-color: #f2f2f2;}

.attendance tr:hover {background-color: #ddd;}

.attendance th {
    padding: 12px 8px;
    text-align: left;
    background-color: grey;
    color: white;
}
.attendance td, .attendance th {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
