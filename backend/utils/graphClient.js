import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import logger from './logger.js';
import { CLIENT_ID, CLIENT_SECRET, TENANT_ID } from './config.js';

const GRAPH_SCOPES = ['https://graph.microsoft.com/.default'];

let graphClient;

const client = {
  api: endpoint => graphClient.api(endpoint),

  async initialize() {
    try {
      logger.info('Initializing Graph client');
      const credential = new ClientSecretCredential(
        TENANT_ID,
        CLIENT_ID,
        CLIENT_SECRET
      );

      const authProvider = new TokenCredentialAuthenticationProvider(
        credential,
        {
          scopes: GRAPH_SCOPES,
        }
      );

      graphClient = Client.initWithMiddleware({
        authProvider,
      });

      logger.info('Graph client initialized');
    } catch (error) {
      logger.error('Error initializing Graph client:', error.message);
    }
  },
};

export default client;
