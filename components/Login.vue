<template>
    <a-modal title="Login" :footer="null" v-model="visible" :afterClose="handleClose">
        <a-form :form="form" @submit="handleSubmit" >
            <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''" >
                <a-input v-decorator="[ 'email', {rules: [{ required: true, message: 'Please input your email!' }]} ]" placeholder="Email" >
                    <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''" >
                <a-input v-decorator="[ 'password', {rules: [{ required: true, message: 'Please input your Password!' }]} ]" type="password" placeholder="Password" >
                    <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())" >
                    Log in
                </a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import Vue from 'vue'
import { Input, Form, Icon, Modal } from 'ant-design-vue'

Vue.use(Input);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Modal);
function hasErrors (fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
    props: ['showLogin'],
    data () {
        return {
            hasErrors,
            form: this.$form.createForm(this),
            visible: false
        };
    },
    watch: {
        showLogin: function (val) {
          this.visible = val
        },
    },
    mounted () {
        this.$nextTick(() => {
            // To disabled submit button at the beginning.
            this.form.validateFields();
        });
    },
    methods: {
        // Only show error after a field is touched.
        userNameError () {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('userName') && getFieldError('userName');
        },
        // Only show error after a field is touched.
        passwordError () {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('password') && getFieldError('password');
        },
        handleSubmit  (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    this.$axios.post(`/login`, {
                        email: values.email,
                        password: values.password
                    })
                    .then((res) => {
                        // console.warn(res.data.success.token);
                        this.$store.commit('token/add', res.data.success.token)
                        this.$store.commit('user/add', res.data.user)
                        this.$message.success(`${res.data.user.name} has logged in successfully`, 2);
                        location.href = '/kids'
                    })
                    .catch((e)=> {
                        this.$message.error(`${e}`, 2);                        
                    })
                }
            });
        },
        handleClose() {
            this.$emit('modal', false)
        },
    },
};
</script>
