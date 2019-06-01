<template>
  <section class="container flex flex-wrap py-10">
      <a-spin tip="Loading..." :spinning="loading">
          <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, xl: 4 }" :dataSource="kids">
              <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-card hoverable class="group">
                      <img :src="item.picture" alt="" slot="cover">
                      <a-card-meta :title="item.name">
                          <template slot="description">
                              <div class="flex">
                                  <span class="w-16 text-left">Gender:</span>{{ item.gender }}
                              </div>
                              <div class="flex">
                                  <span class="w-16 text-left">DOB:</span>{{ item.dob | moment('DD-MM-YYYY') }}
                              </div>
                              <div class="flex">
                                  <span class="w-16 text-left">Age:</span>{{ diff(item.dob) }}
                              </div>
                          </template>
                      </a-card-meta>
                      <template class="ant-card-actions" slot="actions">
                          <a-icon type="edit" @click="$router.push(`/kids/${item.id}`)"/>
                          <a-popconfirm :title="`Delete ${item.name}?`" @confirm="deleteKid(item)" okText="Yes" cancelText="No">
                              <a-icon type="delete"/>
                          </a-popconfirm>
                      </template>
                  </a-card>
              </a-list-item>
          </a-list>
      </a-spin>
  </section>
</template>

<script>
import Vue from 'vue'
import { List, Card, Spin, Popconfirm } from 'ant-design-vue'

Vue.use(List);
Vue.use(Card);
Vue.use(Spin);
Vue.use(Popconfirm);

export default {
    components: {
    },
    data() {
        return {
            kids: [],
            loading: true
        }
    },
    mounted() {
        this.getKidsListing()
    },
    methods: {
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
