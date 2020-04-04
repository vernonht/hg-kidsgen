<template>
    <div class="text-left grid grid-cols-5 gap-2 mb-4">
        <span class="col-span-2 md:col-span-1">Name:</span>
        <span class="col-span-3 md:col-span-4">{{ kid.name }}</span>

        <span class="col-span-2 md:col-span-1">Gender:</span>
        <span class="col-span-3 md:col-span-4">{{ _.capitalize(kid.gender) }}</span>

        <span class="col-span-2 md:col-span-1">DOB:</span>
        <span class="col-span-3 md:col-span-4">{{ kid.birthdate | moment('DD-MM-YYYY') }}</span>

        <span class="col-span-2 md:col-span-1">Age:</span>
        <span class="col-span-3 md:col-span-4">{{ diff(kid.birthdate) }}</span>

        <span class="col-span-2 md:col-span-1">Allergies:</span>
        <span class="col-span-3 md:col-span-4">{{ kid.allergies }}</span>

        <span class="col-span-2 md:col-span-1">Points</span>
        <span class="col-span-3 md:col-span-3">{{sumPoints(kid.points)}}</span>
        <button type="button" class="button col-end-6 col-span-5 md:col-span-1" @click="managePointsModal(kid)">
            <a-icon type="smile" theme="twoTone" />
            <span class="pl-2">Points</span>
        </button>

        <span class="col-span-5 font-bold">Parent details</span>
        <span class="col-span-5 grid grid-col-1 md:grid-cols-3 gap-2 py-2 md:py-0" v-for="p in kid.kid_parents" :key="p.parent_id">
            <span>{{ _.get(_.find(parents, {id: _.toInteger(p.parent_id)}), 'name') }}</span>
            <a :href="`tel:${ _.get(_.find(parents, {id: _.toInteger(p.parent_id)}), 'contact') }`">{{ _.get(_.find(parents, {id: _.toInteger(p.parent_id)}), 'contact') }}</a>
            <a :href="`mailto:${ _.get(_.find(parents, {id: _.toInteger(p.parent_id)}), 'email') }`">{{ _.get(_.find(parents, {id: _.toInteger(p.parent_id)}), 'email') }}</a>
        </span>

        <a-modal title="Manage Points" :visible="edit_points_modal" :confirmLoading="loading" @ok="managePoints" @cancel="edit_points_modal = false">
            <div class="grid grid-cols-3 gap-4 mb-4">
                <span class="col-span-1">Name</span>
                <span class="col-span-2">{{_.get(edit_points_data.kid, ['name'])}}</span>

                <span class="col-span-1">Points</span>
                <div class="col-span-2">
                    <a-input-number id="points" :max="100" v-model="edit_points_data.points" />
                </div>

                <span class="col-span-1">Description</span>
                <div class="col-span-2">
                    <a-textarea
                    v-model="edit_points_data.description"
                    placeholder="Briefly tell us why"
                    :autoSize="{ minRows: 2, maxRows: 5 }"
                    />
                </div>

            </div>
            <a-collapse v-model="active_points_history">
                <a-collapse-panel header="Points History" key="1">
                    <a-timeline mode="alternate">
                        <a-timeline-item :color="_.get(h, ['points']) > 0 ? 'green':'red'" v-for="h in _.get(edit_points_data, ['kid', 'points'])" :key="h.id">
                            <div class="flex flex-col" v-if="edit_points_history_id != h.id">
                                <div class="">
                                    <div class="">
                                        <a-tag :color="_.get(h, ['points']) > 0 ? 'green':'red'">{{ _.get(h, ['points']) }}</a-tag>
                                    </div>
                                    <span>{{ _.get(h, ['description']) }}</span>
                                </div>
                                <div class="">
                                    <span>{{ _.get(h, ['created_at']) | moment('DD-MM-YYYY') }}</span>
                                </div>
                                <div class="">
                                    <a-button type="primary" size="small" icon="edit" @click="editPointsHistory(h)"></a-button>
                                    <a-popconfirm :title="`Delete points?`" @confirm="submitPointsHistory('delete', h.id)" okText="Yes" cancelText="No">
                                        <a-button type="danger" size="small" icon="delete"  :loading="loading"></a-button>
                                    </a-popconfirm>
                                </div>
                            </div>
                            <div class="grid gap-2" v-if="edit_points_history_id == h.id">
                                <a-input-number id="points" :max="100" v-model="edit_points_history.points" />
                                <a-textarea
                                v-model="edit_points_history.description"
                                placeholder="Briefly tell us why"
                                :autoSize="{ minRows: 2, maxRows: 3 }"
                                />
                                <a-button type="primary" size="small" @click="submitPointsHistory('edit')" :loading="loading">Update</a-button>
                                <a-button  size="small" @click="edit_points_history_id = ''">Cancel</a-button>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                </a-collapse-panel>
            </a-collapse>
        </a-modal>
    </div>
</template>

<script>
export default {
    props: ['kid', 'parents', 'loading'],
    data() {
        return {
            active_points_history: [],
            edit_points_data: {
                id: '',
                points: '',
                description: ''
            },
            edit_points_modal: false,
            edit_points_history_id: '',
            edit_points_history: {
                points: 0,
                description: ''
            }
        }
    },
    methods: {
        async submitPointsHistory(type, delete_id) {
                try {
                    if(type == 'edit') {
                        this.$emit('loading', true)
                        let res = await this.$axios.put(`/points/${this.edit_points_history_id}`, {
                            points: this.edit_points_history.points,
                            description: this.edit_points_history.description
                        })
                        // Update existing data
                        this.edit_points_data.kid.points[_.findIndex(this.edit_points_data.kid.points, {id: res.data.id})] = res.data
                        this.edit_points_history_id = ''
                        this.$emit('updated')
                        this.$Swal.fire({
                            type: 'success',
                            text: `Points successfully changed`,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                    else if (type == 'delete') {
                        this.$emit('loading', true)
                        let res = await this.$axios.delete(`/points/${delete_id}`,)
                        // Delete existing data
                        this.edit_points_data.kid.points.splice(_.findIndex(this.edit_points_data.kid.points, {id: res.data.id}), 1);
                        this.edit_points_history_id = ''
                        this.$emit('updated')
                        this.$Swal.fire({
                            type: 'success',
                            text: `Points successfully deleted`,
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                } catch (e) {
                    this.$emit('loading', false)
                } finally {
                    this.$emit('loading', false)
                }
        },
        editPointsHistory(data) {
            this.edit_points_history_id = data.id
            this.edit_points_history.points = data.points
            this.edit_points_history.description = data.description
        },
        managePointsModal(data) {
            this.edit_points_modal = true
            this.edit_points_data.kid = data
            this.edit_points_data.points = 0
            this.edit_points_data.description = ''
        },
        managePoints() {
            if(!this.edit_points_data.points) {
                this.$Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Point cannot be 0!'
                })
                return
            }
            this.$emit('loading', true)
            this.$axios.post(`points`, {
                kid_id: this.edit_points_data.kid.id,
                points: this.edit_points_data.points,
                description: this.edit_points_data.description,
            })
            .then((res) => {
                this.$emit('loading', false)
                this.$emit('updated')
                this.$Swal.fire({
                    type: 'success',
                    text: `Points successfully ${this.edit_points_data.points > 0 ? 'added':'deducted'}`,
                    showConfirmButton: false,
                    timer: 2000
                }).then(()=> {
                    this.edit_points_modal = false
                })
            }).catch((e)=> {
                this.$emit('loading', false)
            })
        },
        diff(date){
            let a = this.$moment();
            let b = this.$moment(date);
            return a.diff(b, 'years')
        },
        sumPoints(data){
            let res = _.reduce(data, function(result, value, key) {
                result.push(value.points);
                return result;
            }, []);
            return _.sum(res)
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
