import { auditLogsClient } from '@dynatrace-sdk/client-classic-environment-v2';

export default async function (payload: unknown = undefined) {

  const response = await auditLogsClient.getLogs({
    // When the nextPageKey is set to obtain subsequent pages, you must omit all other query parameters.
    // nextPageKey: "", // The first page is always returned if you don't specify the nextPageKey query parameter.
    pageSize: 1000, // if not set, 1000 is used as default
    
    // filter: "", 
    // User: user("userIdentification"). The EQUALS operator applies.
    // Event type: eventType("value"). The EQUALS operator applies.
    // Category of a logged operation: category("value"). The EQUALS operator applies.
    // Entity ID: entityId("id"). The CONTAINS operator applies.
    // Settings schema ID: dt.settings.schema_id("id"). The EQUALS operator applies.
    // Settings scope ID: dt.settings.scope_id("id"). The EQUALS operator applies.
    // Settings key: dt.settings.key("key"). The EQUALS operator applies.
    // Settings object ID: dt.settings.object_id("id"). The EQUALS operator applies.
    //You can specify multiple comma-separated criteria, such as eventType("CREATE","UPDATE"),category("CONFIG"). Only results matching all criteria are included in response.
    // Specify the value of a criterion as a quoted string. The following special characters must be escaped with a tilde (~) inside quotes:
    
    // from: "", // The start of the requested timeframe. If not set, the relative timeframe of two weeks is used (now-2w).
    // to: "", // The end of the requested timeframe. If not set, the current timestamp is used.
    sort: "-timestamp" // newest first, if you want oldest first remove the -
  });

  return response;
}