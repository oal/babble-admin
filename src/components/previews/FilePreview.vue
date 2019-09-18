<template>
    <v-chip v-on="on" outlined label color="blue-grey darken-1">
        <v-icon left>insert_drive_file</v-icon>
        {{ value }}
    </v-chip>
</template>

<script>
    export default {
        props: [
            'value'
        ]
    }
</script>
