import { ClassProvider, InjectionToken, ValueProvider } from '@angular/core';
import { Logger } from './Logger';
import { LoggingService } from './logging.service';
import { AppSettingService } from './app-setting.service';
import { AppSetting } from './app-setting';
import { BackendUrlService } from './backend-url.service';
import { LocalStorageService } from './storage.service';

export {
  provideLocalStorage,
  provideLoggingService,
  APP_LOGGER,
  BACKEND_URL,
  provideBackendUrl,
  AppSettingService,
  APP_SETTING,
};


const APP_SETTING = new InjectionToken<AppSetting>('app-setting');

const provideLocalStorage = (): ClassProvider => ({
  provide: LocalStorageService,
  useClass: LocalStorageService,
});



const APP_LOGGER = new InjectionToken<Logger>('logger');

const provideLoggingService = (): ClassProvider => ({
  provide: APP_LOGGER,
  useClass: LoggingService,
});


const BACKEND_URL = new InjectionToken<BackendUrlService>('backend_url');

const provideBackendUrl = (): ClassProvider => ({
  provide: BACKEND_URL,
  useClass:BackendUrlService
});
