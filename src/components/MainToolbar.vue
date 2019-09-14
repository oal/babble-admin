<template>
    <div>
        <v-toolbar flat dark color="blue-grey darken-3 pl-1">
            <v-app-bar-nav-icon @click="$root.drawer = !$root.drawer"/>
            <v-spacer/>
        </v-toolbar>
        <v-toolbar flat dark color="blue-grey darken-2 pl-1 pr-4">
            <v-toolbar-title class="pl-2">
                <slot name="title"></slot>
            </v-toolbar-title>
            <v-spacer/>
            <slot></slot>
        </v-toolbar>
    </div>
</template>