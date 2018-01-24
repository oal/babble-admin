<template>
    <div>
        <div class="pb-3 input-group input-group--text-field">
            <label>{{ label }}</label>
        </div>
        <v-layout row wrap>
            <v-flex>
                <v-menu class="pr-3">
                    <v-text-field
                            slot="activator"
                            :label="$t('date')"
                            v-model="date"
                            prepend-icon="event"
                            readonly>
                    </v-text-field>
                    <v-date-picker class="mt-3" v-model="date"></v-date-picker>
                </v-menu>
                <v-menu>
                    <v-text-field
                            slot="activator"
                            :label="$t('time')"
                            v-model="time"
                            prepend-icon="schedule"
                            readonly>
                    </v-text-field>
                    <v-time-picker landscape format="24hr" v-model="time"></v-time-picker>
                </v-menu>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    export default {
        name: 'datetime-field',

        props: [
            'value',
            'label'
        ],

        data() {
            return {
                date: null,
                time: null
            }
        },

        mounted() {
            this.update();
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
                this.$emit('input', `${this.date}T${this.time}:00Z`)
            }
        }
    }
</script>