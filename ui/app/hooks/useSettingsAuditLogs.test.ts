import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { useSettingsAuditLogs } from './useSettingsAuditLogs';

jest.mock('@dynatrace-sdk/client-query');

const mockQueryExecutionClient = queryExecutionClient as jest.Mocked<typeof queryExecutionClient>;

describe('useSettingsAuditLogs', () => {
    it('polls until SUCCEEDED and returns records', async () => {
        const records = [{ timestamp: '1', 'event.type': 'CREATE' }];
        mockQueryExecutionClient.queryExecute.mockResolvedValue({ requestToken: 'tok' } as any);
        mockQueryExecutionClient.queryPoll.mockResolvedValue({ state: 'SUCCEEDED', result: { records } } as any);

        const fetchLogs = useSettingsAuditLogs();
        const result = await fetchLogs(null);
        expect(result).toEqual(records);
    });
});
