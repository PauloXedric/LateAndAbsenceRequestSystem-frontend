import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { MyPreset } from '../assets/presets/aura-preset';
import { authInterceptor } from './_interceptors/auth.interceptor';
import { API_CONFIG } from './_config/api.config';
import { environment } from '../enviroments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: environment.baseUrl,
      },
    },
  ],
};
