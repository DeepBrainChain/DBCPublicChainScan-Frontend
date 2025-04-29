const path = require('path');
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ko', 'ja', 'ru', 'vn', 'es'],
    localePath: path.resolve('./public/locales'),
  },
};
