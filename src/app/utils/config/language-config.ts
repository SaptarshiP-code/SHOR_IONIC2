import { StorageStrategy, L10nConfig, ISOCode, ProviderType } from 'angular-l10n';

export const l10nConfig: L10nConfig = {
  locale: {
      languages: [
          { code: 'en', dir: 'ltr' },
          { code: 'hn', dir: 'rtl' }
      ],
      language: 'en',
      defaultLocale: { languageCode: 'en', countryCode: 'IND' },
      currency: 'INR',
      storage: StorageStrategy.Cookie,
      cookieExpiration: 30,
  },
  translation: {
      providers: [
          { type: ProviderType.Static, prefix: './assets/i18n/locale-' }
      ],
      caching: true,
      version: '8.0.0',
      rollbackOnError: true,
      composedKeySeparator: '.',
      missingValue: 'No key'
  },
  localizedRouting: {
      format: [ISOCode.Language, ISOCode.Country],
      defaultRouting: false,
      schema: [
          {
              text: 'English',
              languageCode: 'en', countryCode: 'IND', currency: 'INR', timezone: 'Asia/India'
          },
          {
              text: 'Hindi',
              languageCode: 'hn', countryCode: 'IND', currency: 'INR', timezone: 'Asia/India'
          }
      ]
  }
};
