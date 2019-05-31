<template>
    <section class="bg-white overflow-x-hidden p-4 my-10 mx-4">
        <h1 class="font-bold text-xl text-center mb-4">Update kid info</h1>
        <a-spin tip="Loading..." :spinning="loading">
            <a-form :form="form">
                <a-form-item label="Name" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Name is required!' }]} ]"/>
                </a-form-item>
                <a-form-item label="Gender" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-select v-decorator="[ 'gender', {rules: [{ required: true, message: 'Please select gender!' }]} ]" placeholder="Select a option and change input text above">
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
                <a-form-item label="Parents" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-select mode="multiple" showSearch optionFilterProp="children" optionLabelProp="value" :filterOption="filterOption" v-decorator="[ 'parents', {rules: [{ required: true, message: 'Please select parents!' }]} ]" placeholder="Select parents">
                        <a-select-option :value="i.name" v-for="i in parents_list">
                            <a-avatar size="large" :src="i.picture"/>
                            {{ i.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item class="text-center" :wrapper-col="{ span: 24 }">
                    <a-button @click="add_parents_modal = !add_parents_modal">
                        Add New Parent
                    </a-button>
                    <a-button @click="manage_parents_modal = !manage_parents_modal">
                        Manage Parents
                    </a-button>
                </a-form-item>
                <a-form-item class="text-center" :wrapper-col="{ span: 24 }">
                    <a-button type="primary" @click="handleSubmit">
                        Submit
                    </a-button>
                </a-form-item>
            </a-form>
        </a-spin>
        <a-modal title="Add parent" v-model="add_parents_modal" @ok="addParent">
            <template slot="footer">
                <a-button key="submit" type="primary" @click="addParent" :loading="add_parent_loading">
                    Add
                </a-button>
            </template>

            <a-form :form="add_parents">
                <a-form-item label="Name" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Name is required!' }]} ]"/>
                </a-form-item>
                <a-form-item label="Contact" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'contact', {rules: [{ required: true, type: 'number', message: 'Contact is not valid!' }]} ]"/>
                </a-form-item>
                <a-form-item label="Email" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'email', {rules: [{ required: true, type: 'email', message: 'Email is not valid!' }]} ]"/>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal title="Manage parent" v-model="manage_parents_modal" @ok="manage_parents_modal = !manage_parents_modal">
            <template slot="footer">
                <a-button key="submit" type="primary" @click="manage_parents_modal = !manage_parents_modal">
                    Done
                </a-button>
            </template>
            <div class="h-64 overflow-auto">
                <a-list class="demo-loadmore-list" :loading="loading" itemLayout="horizontal" :dataSource="parents_list">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <a slot="actions">edit</a>
                        <a slot="actions">
                            <a-popconfirm title="Are you sure?" @confirm="deleteParent(item.id)" okText="Yes" cancelText="No">
                                <a>Delete</a>
                            </a-popconfirm>
                        </a>
                        <a-list-item-meta>
                            <a slot="title">{{item.name}}</a>
                            <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </div>
        </a-modal>
    </section>
</template>

<script>
import Vue from 'vue'
import { Input, Form, Select, Spin, List, Avatar, Popconfirm } from 'ant-design-vue'

Vue.use(Input);
Vue.use(Form);
Vue.use(Select);
Vue.use(Spin);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Popconfirm);
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
            add_parents: this.$form.createForm(this),
            loading: true,
            add_parent_loading: false,
            add_parents_modal: false,
            manage_parents_modal: false
        }
    },
    mounted() {
        this.getKidInfo()
        this.getParentsInfo()
    },
    methods: {
        filterOption(input, option) {
            // console.warn(option);
            // console.warn(option.componentOptions.children[1].text);
            return option.componentOptions.children[1].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
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
        deleteParent(id) {
            console.warn(id);
            this.$axios.delete(`/parents/${id}`,)
            .then((res) => {
                this.$message.success(`Deleted`, 2);
                this.getParentsInfo()
            })
        },
        addParent(e) {
            e.preventDefault();
            this.add_parents.validateFields((err, values) => {
                if (!err) {
                    this.add_parent_loading = true
                    console.log('Received values of form: ', values);
                    this.$axios.post(`/parents/`, values)
                    .then((res) => {
                        this.$message.success(`Added ${values['name']} to the parent list`, 2);
                        this.add_parents_modal = false
                        this.add_parent_loading = false
                        this.getParentsInfo()
                    })
                }
            });
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
                  this.$message.success(`Updated ${values['name']}'s info`, 2);
                  this.$router.push('/kids')
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
