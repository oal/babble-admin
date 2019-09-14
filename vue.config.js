module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://[::1]:8000',
                changeOrigin: false,
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/uploads': {
                target: 'http://[::1]:8000',
                changeOrigin: true,
                pathRewrite: {
                    '^/uploads': '/uploads'
                }
            }
        }
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    }
};