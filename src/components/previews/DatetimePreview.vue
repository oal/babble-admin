<template>
  <span>{{ datetime }}</span>
</template>


<script>
    import moment from 'moment';

    export default {
        props: {
            value: [Date, String]
        },

        computed: {
            datetime() {
                return moment(this.value, 'YYYY-MM-DD hh:mm').format('LLL');
            }
        }
    }
</script>
