import {createRouter, createWebHashHistory} from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('./views/LoginPage.vue')
        },
        {
            path: '/',
            component: () => import('./views/PanelWrapper.vue'),
            children: [
                {
                    path: '/',
                    name: 'Index',
                    component: () => import('./views/IndexPage.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType',
                    name: 'List',
                    component: () => import('./views/ListPage.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/create',
                    name: 'Create',
                    component: () => import('./views/EditPage.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit/:id',
                    name: 'Edit',
                    component: () => import('./views/EditPage.vue'),
                    props: true
                },
                {
                    path: '/models/:modelType/edit',
                    name: 'EditSingle',
                    component: () => import('./views/EditPage.vue'),
                    props: true
                },
                {
                    path: '/files',
                    name: 'Files',
                    component: () => import('./views/FilePage.vue'),
                    props: true
                }
            ]
        }
    ]
});