const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ko', 'ja', 'ru'],
    localePath: path.resolve('./public/locales'),
  },
};
