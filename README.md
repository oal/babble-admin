# Babble CMS Admin

## Using Babble Admin
```
cd my-babble-project
mkdir assets
cd assets
git clone https://github.com/oal/babble-admin.git admin

cd admin
npm install
npm run build
```

The admin files will appear in `my-babble-project/public/admin`, so go to `http://localhost:8000/admin` to manage your site's content.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
