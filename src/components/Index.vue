<template>
    <div>
        <h1 class="ui header">{{ $t('manageContent') }}</h1>
        <div class="ui cards">
            <div class="ui card" v-for="model in $parent.models" :key="model.type">
                <router-link :to="{name: 'List', params: {modelType: model.type}}" class="center aligned content"
                             style="padding: 3rem 1rem">
                    <i class="huge black icon" :class="model.options.admin.icon"
                       v-if="model.options && model.options.admin && model.options.admin.icon"></i>
                </router-link>
                <div class="content">
                    <router-link :to="{name: 'Create', params: {modelType: model.type}}" class="right floated" v-if="!model.single">
                        <i class="green add icon"></i>
                    </router-link>
                    <router-link :to="{name: 'List', params: {modelType: model.type}}" class="header">
                        <span v-if="model.single">{{ model.name }}</span>
                        <span v-else>{{ model.name_plural }}</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>