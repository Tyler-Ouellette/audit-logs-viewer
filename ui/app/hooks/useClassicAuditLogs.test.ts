import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { useClassicAuditLogs } from './useClassicAuditLogs';

jest.mock('@dynatrace-sdk/client-query');

const mockQueryExecutionClient = queryExecutionClient as jest.Mocked<typeof queryExecutionClient>;

describe('useClassicAuditLogs', () => {
    it('polls until SUCCEEDED and returns records', async () => {
        const records = [{ timestamp: '1', 'event.type': 'GET' }];
        mockQueryExecutionClient.queryExecute.mockResolvedValue({ requestToken: 'tok' } as any);
        mockQueryExecutionClient.queryPoll.mockResolvedValue({ state: 'SUCCEEDED', result: { records } } as any);

        const fetchLogs = useClassicAuditLogs();
        const result = await fetchLogs(null);
        expect(result).toEqual(records);
    });
});
