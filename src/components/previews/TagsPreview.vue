<template>
    <div>
        <v-chip small disabled v-for="tag in value" :key="tag">{{ tag }}</v-chip>
    </div>
</template>

<script>
    export default {
        props: [
            'value'
        ]
    }
</script>
