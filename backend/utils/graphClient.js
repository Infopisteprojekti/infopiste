import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import logger from './logger.js';
import { excelDateToDayjs } from './date.js';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  TENANT_ID,
  GROUP_ID,
  FILE_ID,
  SHEET_NAME,
  FOLDER_ID,
} from './config.js';

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
        `$select=start,end,locations`,
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
        startTime: dayjs.utc(event.start.dateTime).toDate(),
        endTime: dayjs.utc(event.end.dateTime).toDate(),
      }));
    });
  },

  async getFormSubmissions() {
    const api_url = `groups/${GROUP_ID}/drive/items/${FILE_ID}/workbook/worksheets/${SHEET_NAME}/range/usedRange`;
    const dateColumns = ['Aloituspvm', 'Lopetuspvm'];

    try {
      const response = await graphClient.api(api_url).get();
      const [headers, ...rows] = response.values;

      return rows.map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          const value = row[i] ?? null;

          if (dateColumns.includes(header) && typeof value === 'number') {
            obj[header] = excelDateToDayjs(value).toISOString();
          } else {
            obj[header] = value;
          }
        });

        return obj;
      });
    } catch (error) {
      logger.error('Error fetching Excel data:', error);
      throw error;
    }
  },

  async getDriveItems() {
    const api_url = `groups/${GROUP_ID}/drive/items/${FOLDER_ID}/children`;
    try {
      const response = await graphClient.api(api_url).get();

      const items = response.value || [];

      const result = items.map(item => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        downloadUrl: item['@microsoft.graph.downloadUrl'],
        size: item.size,
        createdDateTime: item.createdDateTime,
      }));

      return result;
    } catch (error) {
      logger.error('Error fetching drive items:', error);
      throw error;
    }
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
