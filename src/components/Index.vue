<template>
    <div>
        <h1 class="ui header">{{ $t('manageContent') }}</h1>
        <div class="tiles">
                <router-link :to="{name: 'List', params: {modelType: model.type}}" class="tile" v-for="model in $parent.models" :key="model.type">
                    <div class="left">
                        <i class="icon" :class="model.options.admin.icon"
                            v-if="model.options && model.options.admin && model.options.admin.icon"></i>
                    </div>
                    <div class="content">
                        <span v-if="model.single">{{ model.name }}</span>
                        <span v-else>{{ model.name_plural }}</span>
                    </div>
                </router-link>
            </div>
    </div>
</template>