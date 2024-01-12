import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_SETTING, AppSettingService, provideBackendUrl, provideLocalStorage, provideLoggingService } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide:APP_SETTING,
      useClass:AppSettingService
    },
    provideHttpClient(
      withInterceptors([])
    ),
    provideBackendUrl(),
    provideLocalStorage(),
    provideLoggingService(),
  ]
};
