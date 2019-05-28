<template>
    <section class="overflow-x-hidden py-10 px-4">
        <h1 class="font-bold text-xl text-center mb-4">Update kid info</h1>
        <a-spin tip="Loading..." :spinning="loading">
            <a-form :form="form">
                <a-form-item label="Name" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Name is required!' }]} ]"/>
                </a-form-item>
                <a-form-item label="Gender" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-select v-decorator="[ 'gender', {rules: [{ required: true, message: 'Please select your gender!' }]} ]" placeholder="Select a option and change input text above">
                        <a-select-option value="male">
                            male
                        </a-select-option>
                        <a-select-option value="female">
                            female
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="DOB" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-date-picker v-decorator="['dob', {rules: [{ type: 'object', required: true, message: 'Please select birth date!' }] }]" />
                </a-form-item>
                <a-form-item label="Allergies" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'allergies' ]"/>
                </a-form-item>
                <h1 class="font-bold text-xl text-center mb-4">Parents info</h1>
                <div class="w-1/2 flex justify-center mx-auto">
                    <a-input-search placeholder="Search" @search="onSearch"/>
                </div>
                <div class="flex justify-center mb-10">
                    <a-list class="w-1/2 h-64 overflow-auto" itemLayout="horizontal" :dataSource="filtered_parents">
                        <a-list-item class="hover:bg-gray-300 cursor-pointer" :class="isParentSelected(item.id)?'bg-gray-300':''" slot="renderItem" slot-scope="item, index">
                            <a slot="actions" @click="addParent(item.id)"><a-icon :type="isParentSelected(item.id)?'check':'plus'" class="text-xl px-4"/></a>
                            <a-list-item-meta :description="item.email">
                                <span slot="title">{{item.name}}</span>
                                <a-avatar :size="64" slot="avatar" :src="item.picture" />
                            </a-list-item-meta>
                    </a-list-item>
                </a-list>

                <!-- <multiselect v-model="selected_parents" placeholder="Select Parent" label="name" track-by="name" :multiple="true" :taggable="true" :close-on-select="false" :options="filtered_parents">
                    <template slot="singleLabel" slot-scope="props">
                        <img class="option__image" :src="props.option.img">
                        <span class="option__desc">
                            <span class="option__title">{{ props.option.name }}</span>
                        </span>
                    </template>
                    <template slot="option" slot-scope="props">
                        <img class="h-24 option__image" :src="props.option.picture">
                          <div class="option__desc">
                              <span class="option__title">{{ props.option.name }}</span>
                              <span class="option__small">{{ props.option.email }}</span>
                          </div>
                    </template>
                  </multiselect> -->
                </div>
                <a-form-item class="text-center" :wrapper-col="{ span: 24 }">
                    <a-button type="primary" @click="handleSubmit">
                        Submit
                    </a-button>
                </a-form-item>
            </a-form>
        </a-spin>
    </section>
</template>

<script>
import Vue from 'vue'
import { Input, Form, Select, Spin, List, Avatar } from 'ant-design-vue'

Vue.use(Input);
Vue.use(Form);
Vue.use(Select);
Vue.use(Spin);
Vue.use(List);
Vue.use(Avatar);
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.component('multiselect', Multiselect)
export default {
    components: {
        Multiselect
    },
    data() {
        return {
            id: this.$route.params.id,
            kid: {},
            parents_list: [],
            filtered_parents: [],
            selected_parents: [],
            form: this.$form.createForm(this),
            loading: true
        }
    },
    mounted() {
        this.getKidInfo()
        this.getParentsInfo()
    },
    methods: {
        onSearch(value) {
            this.filtered_parents = this.parents_list.filter((val) => {
                return val['name'].toLowerCase().indexOf(value.toLowerCase()) > -1
            });
        },
        isParentSelected(id) {
            if(this.selected_parents.includes(id)) {
                return true
            } else {
                return false
            }
        },
        addParent(id) {
            if(this.selected_parents.includes(id)) {
                this.selected_parents = this.selected_parents.filter((val) => {
                    return val != id
                });
            } else {
                this.selected_parents.push(id)
            }
        },
        getKidInfo() {
            this.$axios.get(`/kids/${this.id}`)
            .then((res) => {
                this.kid = res.data
                this.form.setFieldsValue({
                    name: res.data.name,
                    dob: this.$moment(res.data.dob),
                    gender: res.data.gender,
                    allergies: res.data.allergies,
                  });
                this.loading = false
            })
        },
        getParentsInfo() {
            this.$axios.get(`/parents`)
            .then((res) => {
                this.parents_list = res.data
                this.onSearch('')
            })
        },
        handleSubmit (e) {
          e.preventDefault();
          this.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              // console.warn(values);
              for(let x in values) {
                  if(x == 'dob')
                  values[x] = this.$moment(values[x]).format()
              }
              this.$axios.put(`/kids/${this.id}`, values)
              .then((res) => {
                  console.warn(res.data);
              })
            }
          });
        },
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
</style>
