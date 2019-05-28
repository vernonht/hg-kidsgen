<template>
  <section class="container flex flex-wrap py-10">
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, xl: 4 }" :dataSource="kids">
          <a-list-item slot="renderItem" slot-scope="item, index">
              <a-spin :spinning="loading">
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
                      </template>
                  </a-card>
              </a-spin>
          </a-list-item>
      </a-list>
  </section>
</template>

<script>
import Vue from 'vue'
import { List, Card, Spin } from 'ant-design-vue'

Vue.use(List);
Vue.use(Card);
Vue.use(Spin);

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
        this.$axios.get('/kids')
        .then((res) => {
            console.warn(res);
            this.kids = res.data
            this.loading = false
        })
    },
    methods: {
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
