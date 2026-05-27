import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import { useGatewayAuditLogs } from './useGatewayAuditLogs';

jest.mock('@dynatrace-sdk/client-query');

const mockQueryExecutionClient = queryExecutionClient as jest.Mocked<typeof queryExecutionClient>;

describe('useGatewayAuditLogs', () => {
    it('polls until SUCCEEDED and returns records', async () => {
        const records = [{ timestamp: '1', 'event.type': 'POST' }];
        mockQueryExecutionClient.queryExecute.mockResolvedValue({ requestToken: 'tok' } as any);
        mockQueryExecutionClient.queryPoll.mockResolvedValue({ state: 'SUCCEEDED', result: { records } } as any);

        const fetchLogs = useGatewayAuditLogs();
        const result = await fetchLogs(null);
        expect(result).toEqual(records);
    });
});
