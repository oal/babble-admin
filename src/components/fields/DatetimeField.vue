<template>
    <div>
        <div class="pb-3 input-group input-group--text-field">
            <label>{{ label }}</label>
        </div>
        <v-layout row wrap>
            <v-flex>
                <v-menu full-width>
                    <v-text-field
                            slot="activator"
                            :label="$t('date')"
                            v-model="date"
                            prepend-icon="event"
                            readonly>
                    </v-text-field>
                    <v-date-picker class="mt-3" v-model="date"></v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex>
                <v-menu full-width>
                    <v-text-field
                            slot="activator"
                            :label="$t('time')"
                            v-model="time"
                            prepend-icon="schedule"
                            readonly>
                    </v-text-field>
                    <v-time-picker format="24hr" v-model="time"></v-time-picker>
                </v-menu>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'datetime-field',

        props: [
            'value',
            'label'
        ],

        data() {
            let dateTime;
            if (this.value) dateTime = moment(this.value);
            else dateTime = moment();

            return {
                date: dateTime.format('YYYY-MM-DD'),
                time: dateTime.format('HH:mm')
            }
        },

        watch: {
            date() {
                this.emitInput();
            },
            time() {
                this.emitInput();
            }
        },

        methods: {
            emitInput() {
                if (!this.date || !this.time) return null;
                let dateTime = moment(`${this.date}T${this.time}:00`, 'YYYY-MM-DD hh:mm:ss');
                this.$emit('input', dateTime.format())
            }
        }
    }
</script>