import 'isomorphic-fetch';
import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';

let _settings = undefined;
let _clientSecretCredential = undefined;
let _appClient = undefined;

export function initializeGraphForAppOnlyAuth(settings) {
  // Ensure settings isn't null
  if (!settings) {
    throw new Error('Settings cannot be undefined');
  }

  _settings = settings;

  // Ensure settings isn't null
  if (!_settings) {
    throw new Error('Settings cannot be undefined');
  }

  if (!_clientSecretCredential) {
    _clientSecretCredential = new ClientSecretCredential(
      _settings.tenantId,
      _settings.clientId,
      _settings.clientSecret
    );
  }

  if (!_appClient) {
    const authProvider = new TokenCredentialAuthenticationProvider(
      _clientSecretCredential,
      {
        scopes: ['https://graph.microsoft.com/.default'],
      }
    );

    _appClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
  }
}

export function getAppClient() {
  if (!_appClient) {
    throw new Error(
      'Graph client not initialized. Call initializeGraphForAppOnlyAuth first.'
    );
  }
  return _appClient;
}
