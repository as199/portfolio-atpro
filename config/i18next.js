const i18next = require('i18next');
const backend = require('i18next-node-fs-backend');

i18next
    .use(backend)
    .init({
        lng: 'fr', // Langue par défaut
        fallbackLng: 'fr',
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/translation.json',
        },
    });

module.exports = i18next;
