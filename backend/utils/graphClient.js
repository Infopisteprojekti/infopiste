import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import logger from './logger.js';
import { CLIENT_ID, CLIENT_SECRET, TENANT_ID } from './config.js';

dayjs.extend(utc);

const GRAPH_SCOPES = ['https://graph.microsoft.com/.default'];

let graphClient;

const client = {
  api: endpoint => graphClient.api(endpoint),

  getExactumRooms() {
    return graphClient
      .api('/places/microsoft.graph.room')
      .filter("startswith(emailAddress, 'exactum')")
      .select(
        'emailAddress',
        'displayName',
        'floorNumber',
        'capacity',
        'isWheelChairAccessible',
        'tags'
      )
      .get();
  },

  async getRoomEventsBatch(roomEmails, startDate, endDate) {
    const batchRequests = roomEmails.map((email, index) => ({
      id: `${index + 1}`,
      method: 'GET',
      url:
        `/users/${email}/calendarView?` +
        `startDateTime=${startDate}&endDateTime=${endDate}&` +
        `$select=id,start,end,locations`,
    }));

    const { responses = [] } = await graphClient
      .api('/$batch')
      .post({ requests: batchRequests });

    return responses.flatMap(response => {
      if (!response.body) return [];

      const events = response.body.value || [];

      const roomEmail = roomEmails[Number(response.id) - 1];

      return events.map(event => ({
        roomEmail,
        id: event.id,
        startTime: dayjs.utc(event.start.dateTime).toDate(),
        endTime: dayjs.utc(event.end.dateTime).toDate(),
      }));
    });
  },

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
