import { auditLogsClient } from '@dynatrace-sdk/client-classic-environment-v2';
import { queryExecutionClient } from '@dynatrace-sdk/client-query';
import type { TimeframeV2 } from '@dynatrace/strato-components-preview/core';


export default async function (payload: TimeframeV2) {

  var timeFrame;

  if (payload == undefined) {
    timeFrame = {
      from: {
        type: 'expression',
        value: "now()-24h",
        absoluteDate: ''
      },
      to: {
        type: 'expression',
        value: "now()",
        absoluteDate: ''
      }
    }
  }
  else {
    timeFrame = payload
  }

  console.log(timeFrame)

  const fetchAuditLogsQuery = `
  fetch dt.system.events, from: ${timeFrame.from.value}, to:${timeFrame.to.value}
      | filter event.kind == "AUDIT_EVENT"
      | filter event.provider == "API_GATEWAY"
      | limit 10000
      | sort timestamp desc
  `

  const response = await queryExecutionClient.queryExecute({
    body: {
      query:
        fetchAuditLogsQuery
    },
  });

  let status;
  let result;
  while (status !== "SUCCEEDED") {

    const data = await queryExecutionClient.queryPoll({
      requestToken: response.requestToken,
    });

    if (data.result !== undefined){
      result = data;
    }

    console.log(data)
    status = data.state;
  }

  return result;
}
