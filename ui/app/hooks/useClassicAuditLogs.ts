import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';

async function pollQuery(requestToken: string): Promise<any[]> {
    let status: string | undefined;
    let result: any;
    while (status !== 'SUCCEEDED') {
        const data = await queryExecutionClient.queryPoll({ requestToken });
        if (data.result !== undefined) result = data;
        status = data.state;
    }
    return result?.result?.records ?? [];
}

export function useClassicAuditLogs() {
    return async (timeFrame: Timeframe | null): Promise<any[]> => {
        const from = timeFrame?.from.value ?? 'now()-24h';
        const to = timeFrame?.to.value ?? 'now()';
        const query = `
  fetch dt.system.events, from: ${from}, to:${to}
      | filter event.kind == "AUDIT_EVENT"
      | filter event.provider == "CLASSIC_API"
      | sort timestamp desc
        `;
        const response = await queryExecutionClient.queryExecute({ body: { query } });
        return pollQuery(response.requestToken!);
    };
}
