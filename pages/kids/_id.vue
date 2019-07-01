<template>
    <section class="bg-white overflow-x-hidden p-4 my-10 mx-4">
        <a-spin tip="Loading..." :spinning="loading">
            <a-form :form="form">
                <a-form-item label="Picture" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <!-- <input type="file" name="image" accept="image/*" @change="setImage" /> -->
                    <input type="file" accept="image/*;capture=camera" @change="setImage">
                    <img :src="kid_picture" style="max-height: 300px" alt="">
                </a-form-item>
                <a-form-item label="Name" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Name is required!' }]} ]"/>
                </a-form-item>
                <a-form-item label="Gender" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-select showSearch v-decorator="[ 'gender', {rules: [{ required: true, message: 'Please select gender!' }]} ]" placeholder="Select a option and change input text above">
                        <a-select-option value="male">
                            male
                        </a-select-option>
                        <a-select-option value="female">
                            female
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="DOB" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                  <a-date-picker v-decorator="['birthdate', {rules: [{ type: 'object', required: true, message: 'Please select birth date!' }] }]" />
                </a-form-item>
                <a-form-item label="Allergies" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-textarea v-decorator="[ 'allergies' ]" autosize />
                </a-form-item>
                <h1 class="font-bold text-xl text-center mb-4">Parents info</h1>
                <a-form-item label="Parents" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                    <a-select mode="multiple" showSearch optionFilterProp="children" optionLabelProp="value" :filterOption="filterOption" v-decorator="[ 'parents', {rules: [{ required: false, message: 'Please select parents!' }]} ]" placeholder="Select parents">
                        <a-select-option :value="i.name" v-for="i in parents_list" :key="i.id">
                            <!-- <a-avatar size="large" :src="i.picture"/> -->
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
                    <a-input v-decorator="[ 'contact', {rules: [{ required: true, message: 'Contact is not valid!' }]} ]"/>
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
                <a-form :form="edit_parents" v-show="edit_parent_id != ''">
                    <a-form-item label="Name" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Name is required!' }]} ]"/>
                    </a-form-item>
                    <a-form-item label="Contact" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <a-input v-decorator="[ 'contact', {rules: [{ required: true, message: 'Contact is not valid!' }]} ]"/>
                    </a-form-item>
                    <a-form-item label="Email" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <a-input v-decorator="[ 'email', {rules: [{ required: true, type: 'email', message: 'Email is not valid!' }]} ]"/>
                    </a-form-item>
                    <!-- <a-form-item label="Picture" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <input type="file" name="image" accept="image/*" @change="setParentImage" />
                        <img :src="parent_picture" style="max-height: 300px" alt="">
                    </a-form-item> -->
                    <div class="flex justify-center">
                        <a-button class="mr-4" @click="editParent('cancel')" :loading="add_parent_loading">
                            Cancel
                        </a-button>
                        <a-button type="primary" @click="editParent('submit')" :loading="add_parent_loading">
                            Save
                        </a-button>
                    </div>
                </a-form>
                <a-list class="demo-loadmore-list" :loading="loading" itemLayout="horizontal" :dataSource="parents_list"  v-show="edit_parent_id == ''">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <a slot="actions"><span @click="editParent('show', item)">Edit</span></a>
                        <a slot="actions">
                            <a-popconfirm title="Are you sure?" @confirm="deleteParent(item.id)" okText="Yes" cancelText="No">
                                <a>Delete</a>
                            </a-popconfirm>
                        </a>
                        <a-list-item-meta>
                            <a slot="title">{{item.name}}</a>
                            <!-- <a-avatar slot="avatar" :src="item.picture" /> -->
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </div>
        </a-modal>
    </section>
</template>

<script>
import Vue from 'vue'
import { Input, Form, Select, Spin, List, Avatar, Popconfirm, Upload } from 'ant-design-vue'
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

Vue.use(Input);
Vue.use(Form);
Vue.use(Select);
Vue.use(Spin);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Popconfirm);
Vue.use(Upload);
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.component('multiselect', Multiselect)
export default {
    components: {
        Multiselect,
        VueCropper
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
            edit_parents: this.$form.createForm(this),
            edit_parent_id: '',
            loading: true,
            add_parent_loading: false,
            add_parents_modal: false,
            manage_parents_modal: false,
            parent_value: '',

            uploading: false,
            fileList: [],
            kid_picture: '',
            kid_picture_file: '',
            parent_picture: '',
            parent_picture_file: ''
        }
    },
    mounted() {
        if(this.id == 'create') {
            this.getParentsInfo()
            this.loading = false
        } else {
            this.getKidInfo()
        }
    },
    methods: {
        handleChange (info) {
            if (info.file.status === 'uploading') {
                this.uploading = true
            }
            console.warn('done');
              const formData = new FormData();
              this.fileList.forEach((file) => {
                formData.append('file', file);
                formData.append('filename', 'testing');
                formData.append('id', this.kid.id);
                formData.append('type', 'kid');
              });
              this.$axios.post(`/photos/`, formData)
              .then((res) => {
                  this.$message.success(`Picture uploaded`, 2);
              })
            // if (info.file.status === 'done') {
            //     // Get this url from response in real world.
            //     getBase64(info.file.originFileObj, (imageUrl) => {
            //         this.imageUrl = imageUrl
            //         this.uploading = false
            //     })
            // }
        },
        setParentImage(e) {
            const file = e.target.files[0];
            this.parent_picture_file = e.target.files[0];
            if (!file.type.includes('image/')) {
                alert('Please select an image file');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.parent_picture = event.target.result;
                    // rebuild cropperjs with the updated source
                    // this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        setImage(e) {
            const file = e.target.files[0];
            this.kid_picture_file = e.target.files[0];
            if (!file.type.includes('image/')) {
                alert('Please select an image file');
                return;
            }
            if (typeof FileReader === 'function') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.kid_picture = event.target.result;
                    // rebuild cropperjs with the updated source
                    // this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Sorry, FileReader API not supported');
            }
        },
        filterOption(input, option) {
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
        editParent(action, data) {
            if(action == 'show') {
                this.edit_parent_id = data.id
                this.$nextTick(() => {
                    this.edit_parents.setFieldsValue({
                        name: data.name,
                        contact: data.contact,
                        email: data.email
                    });
                })
            } else if (action == 'submit') {
                this.edit_parents.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        this.$axios.put(`/parents/${this.edit_parent_id}`, values)
                        .then((res) => {
                            this.$message.success(`Updated parent's info`, 2);
                            let form = new FormData();
                            form.append('picture', this.parent_picture_file)
                            form.append('id', res.data.id)
                            form.append('type', 'parent')
                            return this.$axios.post(`/photos`, form)
                        })
                        .then((res) => {
                            this.getParentsInfo();
                            this.edit_parents.resetFields();
                            this.edit_parent_id = ''
                        })
                    }
                })
            } else if (action == 'cancel') {
                this.edit_parents.resetFields();
                this.edit_parent_id = ''
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
                    this.$axios.post(`/parents`, values)
                    .then((res) => {
                        this.$message.success(`Added ${values['name']} to the parent list`, 2);
                        this.add_parents_modal = false
                        this.add_parent_loading = false
                        this.add_parents.resetFields();
                        this.getParentsInfo()
                    })
                    .catch((e)=> {
                        if(e.response.data.errors.email) {
                            this.$message.error(`${e.response.data.errors.email}`, 2);
                        } else {
                            this.$message.error(`Server could not precess the request`, 2);
                        }
                        this.add_parent_loading = false
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
                    birthdate: this.$moment(res.data.birthdate),
                    gender: res.data.gender,
                    allergies: res.data.allergies,
                });
                this.kid_picture = res.data.picture
                this.getParentsInfo()
                this.loading = false
            })
        },
        getParentsInfo() {
            this.$axios.get(`/parents`)
            .then((res) => {
                this.parents_list = res.data
                let parent_name = []
                for(let x in this.kid.parents) {
                    let temp = this.parents_list.find((element) => {
                        return element.id == this.kid.parents[x]['parent_id'];
                    })
                    parent_name.push(temp.name)
                }
                this.form.setFieldsValue({
                    parents: parent_name,
                });
                this.onSearch('')
            })
        },
        handleSubmit (e) {
          e.preventDefault();
          this.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              // console.warn(values);
              let parents = []
              for(let x in values) {
                  // Convert birthdate
                  if(x == 'birthdate')
                  values[x] = this.$moment(values[x]).format('YYYY-MM-DD')
                  // Find parent id from name
                  if(x == 'parents') {
                      for(let y in values[x]) {
                          let temp = this.parents_list.find(function(element) {
                              return element.name == values[x][y];
                          })
                          parents.push(temp.id)
                      }
                  }
              }
              // Inject pic
              // values.kid_picture = this.kid_picture_file;
              // Inject parents id
              values.parents = parents
              if(this.id == 'create') {
                  this.$axios.post(`/kids`, values)
                  .then((res) => {
                      this.$message.success(`Added ${values['name']} into system`, 2);
                      let form = new FormData();
                      form.append('picture', this.kid_picture_file)
                      form.append('id', res.data.id)
                      form.append('type', 'kid')
                      return this.$axios.post(`/photos`, form)
                  })
                  .then((res) => {
                      this.$router.push('/kids')
                      console.warn(res.data);
                  })
              } else {
                  this.$axios.put(`/kids/${this.id}`, values)
                  .then((res) => {
                      this.$message.success(`Updated ${values['name']}'s info`, 2);
                      let form = new FormData();
                      form.append('picture', this.kid_picture_file)
                      form.append('id', res.data.id)
                      form.append('type', 'kid')
                      return this.$axios.post(`/photos`, form)
                  })
                  .then((res) => {
                      this.$router.push('/kids')
                      console.warn(res.data);
                  })
              }
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
