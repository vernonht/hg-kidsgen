<template>
    <a-modal title="Login" :footer="null" v-model="visible" :afterClose="handleClose">
        <a-form :form="form" @submit="handleSubmit" >
            <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''" >
                <a-input v-decorator="[ 'userName', {rules: [{ required: true, message: 'Please input your username!' }]} ]" placeholder="Username" >
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
                    // this.$store.commit('token/add', e.target.value)
                }
            });
        },
        handleClose() {
            this.$emit('modal', false)
        },
    },
};
</script>
