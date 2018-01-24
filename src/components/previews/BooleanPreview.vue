<template>
    <div>
        <v-icon color="green" v-if="value">check</v-icon>
        <v-icon color="red" v-else>clear</v-icon>
    </div>
</template>

<script>
    export default {

        props: [
            'value'
        ]

    }
</script>