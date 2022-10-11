<template>
  <div>
    <div class="pb-3 input-group input-group--text-field">
      <label>{{ label }}</label>
    </div>
    <v-layout
      row
      wrap
    >
      <v-flex>
        <v-menu
          ref="menu"
          v-model="menuDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              slot="activator"
              v-model="date"
              :label="$t('date')"
              prepend-icon="event"
              readonly
              v-on="on"
            />
          </template>
          <v-date-picker v-model="date" />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="menu"
          v-model="menuTime"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              slot="activator"
              v-model="time"
              :label="$t('time')"
              prepend-icon="schedule"
              readonly
              v-on="on"
            />
          </template>
          <v-time-picker
            v-model="time"
            format="24hr"
          />
        </v-menu>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'DatetimeField',

        props: {
            value: [String, Date],
            label: String
        },

        data() {
            let dateTime;
            if (this.value) dateTime = moment(this.value);
            else dateTime = moment();

            return {
                menuDate: false,
                menuTime: false,

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

        mounted() {
            this.emitInput();
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
