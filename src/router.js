import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('./views/Login.vue')
        },
        {
            path: '/',
            component: () => import('./views/Panel.vue'),
            children: [
                {
                    path: '/',
                    name: 'Index',
                    component: () => import('./views/Index.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType',
                    name: 'List',
                    component: () => import('./views/List.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/create',
                    name: 'Create',
                    component: () => import('./views/Edit.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit/:id',
                    name: 'Edit',
                    component: () => import('./views/Edit.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit',
                    name: 'EditSingle',
                    component: () => import('./views/Edit.vue'),
                    props: true
                },
                {
                    path: '/files',
                    name: 'Files',
                    component: () => import('./views/Files.vue'),
                    props: true
                }
            ]
        }
    ]
});