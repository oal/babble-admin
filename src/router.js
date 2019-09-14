import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "panel" */ './views/Panel.vue'),
            children: [
                {
                    path: '/',
                    name: 'Index',
                    component: () => import(/* webpackChunkName: "panel" */ './views/Index.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType',
                    name: 'List',
                    component: () => import(/* webpackChunkName: "panel" */ './views/List.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/create',
                    name: 'Create',
                    component: () => import(/* webpackChunkName: "panel" */ './views/Edit.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit/:id',
                    name: 'Edit',
                    component: () => import(/* webpackChunkName: "panel" */ './views/Edit.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit',
                    name: 'EditSingle',
                    component: () => import(/* webpackChunkName: "panel" */ './views/Edit.vue'),
                    props: true
                },
                {
                    path: '/files',
                    name: 'Files',
                    component: () => import(/* webpackChunkName: "panel" */ './views/Files.vue'),
                    props: true
                }
            ]
        }
    ]
});