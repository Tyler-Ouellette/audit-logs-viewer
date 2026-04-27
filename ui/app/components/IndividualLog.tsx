import React from "react";
import { Chip, Flex, Grid, Surface, TitleBar } from "@dynatrace/strato-components-preview";
import { BugReportIcon, CodeIcon, ContainerIcon, DesktopIcon, LockIcon, ManualIcon, OneAgentSignetIcon } from '@dynatrace/strato-icons';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { DeepDiff } from 'deep-diff'; // (npm package)
import ReactJson from '@microlink/react-json-view'

const restrictedJsonPaths = [
    'metadata', // Cluster versions being different is usually not a problem.
    'nextPageKey', // V2 APIs sometimes return this value. (FFS!)
    'nextPageKeys', // V2 APIs also sometimes return it with an 's'. (Again, FFS!)
    'pageSize', // V2 APIs return pageSize with the data.
    'applicationIdentifier', // Mobile apps use this instead of an entityId. Yay.
    'timestamp'
];

function getJsonDiff(dataA, dataB) {
    let diffCount = 0;
    const differences = DeepDiff.diff(dataA, dataB);
    console.log(differences)
    for (let i = 0; differences && i < differences?.length; i++) {
        let diffPath = differences[i]?.path?.join('/');

        if (!diffPath?.(new RegExp(`(^${restrictedJsonPaths.join('|')}$)`, 'i'))) diffCount++;
    }
    return diffCount;
}

export const IndividualLog = ({ log }) => {

    var icon;


    switch (log.category) {
        case 'ACTIVE_GATE':
            icon = <ContainerIcon size="large" style={{ width: '40px', height: '40px' }} />;
            break;
        case 'AGENT':
            icon = <OneAgentSignetIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        case 'CONFIG':
            icon = <CodeIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        case 'DEBUG_UI':
            icon = <BugReportIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        case 'MANUAL_TAGGING_SERVICE':
            icon = <ManualIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        case 'TOKEN':
            icon = <LockIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        case 'WEB_UI':
            icon = <DesktopIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
        default:
            icon = <DesktopIcon size="large" style={{ width: '40px', height: '40px' }} />
            break;
    }

    // if (log.category == 'ACTIVE_GATE') {
    //     icon = <ContainerIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'AGENT') {
    //     icon = <OneAgentSignetIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'CONFIG') {
    //     icon = <CodeIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'DEBUG_UI') {
    //     icon = <BugReportIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'MANUAL_TAGGING_SERVICE') {
    //     icon = <ManualIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'TOKEN') {
    //     icon = <LockIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }
    // if (log.category == 'WEB_UI') {
    //     icon = <DesktopIcon size="large" style={{ width: '40px', height: '40px' }} />
    // }

    let bgColor;
    let textColor;
    switch (log["event.type"]) {
        case 'CREATE':
            bgColor = Colors.Background.Container.Success.Accent;
            break;
        case 'DELETE':
            bgColor = Colors.Background.Container.Critical.Accent;
            break;
        case 'NO_CHANGE':
            bgColor = Colors.Background.Container.Success.Emphasized;
            break;
        // case 'LOGIN':
        //     bgColor = Colors.Background.Container.Success.Emphasized;
        //     break;
        // case 'LOGOUT':
        //     bgColor = Colors.Background.Container.Neutral.Accent;
        //     break;

        // case 'REMOTE_CONFIGURATION_MANAGEMENT':
        //     bgColor = Colors.Background.Container.Success.Default;
        //     break;
        // case 'REVOKE':
        //     bgColor = Colors.Background.Container.Neutral.Accent;
        //     break;
        // case 'TAG_ADD':
        //     bgColor = Colors.Background.Container.Success.Accent;
        //     break;
        // case 'TAG_REMOVE':
        //     bgColor = Colors.Background.Container.Critical.Accent;
        //     break;
        // case 'TAG_UPDATE':
        //     bgColor = Colors.Background.Container.Warning.Accent;
        //     break;
        case 'UPDATE':
            bgColor = Colors.Background.Container.Warning.Accent;
            textColor = Colors.Text.Primary.OnAccent.Default;
            break;
        default:
            bgColor = Colors.Background.Container.Primary.Accent;
            break;
    }


    const readableTime = new Date(log.timestamp).toLocaleString();



    const Diff = DeepDiff(log['details.json_before'], log['details.json_after']);
    console.log(Diff)
    if (Diff?.length > 0 && Diff[0].kind === "E") {
        const jsonDiff = getJsonDiff(Diff[0].lhs, Diff[0].rhs)
        console.log(jsonDiff)
    }

    const kindMap = {
        "D": "DELETE",
        "E": "EDIT",
        "N": "NEW",
        "A": "ARRAY"
    }

    console.log(log)
    console.log(Diff)
    return (
        <Surface>
            {/* Settings API Logs */}
            {log["event.provider"] === "SETTINGS" && <Grid gridTemplateColumns="1fr 1fr 1fr">
                <Flex gridColumn={'1/4'} justifyContent="center">
                    <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0, backgroundColor: bgColor, color: textColor, width: '100%' }}>
                        Event Type: {log['event.type']}
                        <div>{readableTime}</div>
                    </h1>
                </Flex>
                <Grid >
                    <TitleBar>
                        <TitleBar.Title>
                            Audit Information
                        </TitleBar.Title>
                    </TitleBar>
                    {/* <div style={{ color: textColor, background: bgColor, padding: '5px', maxWidth: 250 }}>Event Type: {log['event.type']}</div>
                    <div>{readableTime}</div> */}
                    <div><Chip style={{ maxWidth: '1fr' }}><Chip.Key>Log Id</Chip.Key>{log['event.id']}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr' }}><Chip.Key>Entity Id</Chip.Key>{log['event.id']}</Chip></div>
                    <div><Chip><Chip.Key>Source</Chip.Key>{log['details.source']}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Resource</Chip.Key>{log['resource']}</Chip></div>
                    <div><Chip><Chip.Key>Status</Chip.Key>{log['event.outcome']}</Chip></div>
                    <div><Chip><Chip.Key>Version</Chip.Key>{log['event.version']}</Chip></div>
                    <div><Chip><Chip.Key>Provider</Chip.Key>{log['event.provider']}</Chip></div>
                    <div><Chip><Chip.Key>Origin Address</Chip.Key>{log['origin.address']}</Chip></div>
                    <div><Chip><Chip.Key>Origin Session</Chip.Key>{log['origin.session']}</Chip></div>
                    <div><Chip><Chip.Key>Origin X-Forwarded-For</Chip.Key>{log['origin.x_forwarded_for']}</Chip></div>
                </Grid>
                <Grid>
                    <TitleBar>
                        <TitleBar.Title>
                            Settings Information
                        </TitleBar.Title>
                    </TitleBar>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Schema Id</Chip.Key>{log["details.dt.settings.schema_id"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Schema Version</Chip.Key>{log["details.dt.settings.schema_version"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Object Id</Chip.Key>{log["details.dt.settings.object_id"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Object Summary</Chip.Key>{log["details.dt.settings.object_summary"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Scope Type</Chip.Key>{log["details.dt.settings.scope_type"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Scope Name</Chip.Key>{log["details.dt.settings.scope_name"]}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Settings Scope Id</Chip.Key>{log["details.dt.settings.scope_id"]}</Chip></div>
                </Grid>
                <Grid>
                    <TitleBar>
                        <TitleBar.Title>
                            Auth Information
                        </TitleBar.Title>
                    </TitleBar>
                    <div><Chip><Chip.Key>Authentication Type</Chip.Key>{log["authentication.type"]}</Chip></div>
                    <div><Chip><Chip.Key>Authentication Token</Chip.Key>{log["authentication.token"]}</Chip></div>
                    <div><Chip><Chip.Key>DT Security Context</Chip.Key>{log["dt.security_context"]}</Chip></div>
                    <div><Chip><Chip.Key>User ID</Chip.Key>{log['user.id']}</Chip></div>
                    <div><Chip><Chip.Key>User Name</Chip.Key>{log['user.name']}</Chip></div>
                    <div><Chip><Chip.Key>User Organization</Chip.Key>{log['user.organization']}</Chip></div>
                </Grid>

                <Grid gridColumn={'1/4'}>
                    {Diff?.length > 0 && (log['event.type'] !== "CREATE" && log['event.type'] !== "NO_CHANGE") &&
                        <div>
                            <TitleBar>
                                <TitleBar.Title>
                                    Changes:
                                </TitleBar.Title>
                            </TitleBar>
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={log['details.json_patch'] == null ? {} : JSON.parse(log['details.json_patch'])} />
                        </div>
                    }

                    {Diff?.length > 0 &&
                        <Grid width={'100%'} gridTemplateColumns={'1fr 1fr'}>
                            <TitleBar>
                                <TitleBar.Title>
                                    Previous Value:
                                </TitleBar.Title>
                            </TitleBar>
                            <TitleBar>
                                <TitleBar.Title>
                                    New Value:
                                </TitleBar.Title>
                            </TitleBar>
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={Diff[0].kind == "N" ? {} : JSON.parse(Diff[0].lhs)} />
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={Diff[0].kind == "D" ? {} : JSON.parse(Diff[0].rhs)} />
                        </Grid>
                    }
                </Grid>
            </Grid>}
            {log["event.provider"] !== "SETTINGS" && <Grid gridTemplateColumns="1fr 1fr">
                <Flex gridColumn={'1/4'} justifyContent="center">
                    <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0, backgroundColor: bgColor, color: textColor, width: '100%' }}>
                        Event Type: {log['event.type']}
                        <div>{readableTime}</div>
                    </h1>
                </Flex>
                <Grid >
                    <TitleBar>
                        <TitleBar.Title>
                            Audit Information
                        </TitleBar.Title>
                    </TitleBar>
                    {/* <div style={{ color: textColor, background: bgColor, padding: '5px', maxWidth: 250 }}>Event Type: {log['event.type']}</div>
                    <div>{readableTime}</div> */}
                    <div><Chip style={{ maxWidth: '1fr' }}><Chip.Key>Log Id</Chip.Key>{log['event.id']}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr' }}><Chip.Key>Entity Id</Chip.Key>{log['event.id']}</Chip></div>
                    <div><Chip><Chip.Key>Source</Chip.Key>{log['details.source']}</Chip></div>
                    <div><Chip style={{ maxWidth: '1fr', overflowX: 'scroll' }}><Chip.Key>Resource</Chip.Key>{log['resource']}</Chip></div>
                    <div><Chip><Chip.Key>Status</Chip.Key>{log['event.outcome']}</Chip></div>
                    <div><Chip><Chip.Key>Version</Chip.Key>{log['event.version']}</Chip></div>
                    <div><Chip><Chip.Key>Provider</Chip.Key>{log['event.provider']}</Chip></div>
                    <div><Chip><Chip.Key>App Id</Chip.Key>{log['app.id']}</Chip></div>
                    <div><Chip><Chip.Key>Origin Address</Chip.Key>{log['origin.address']}</Chip></div>
                    <div><Chip><Chip.Key>Origin Session</Chip.Key>{log['origin.session']}</Chip></div>
                    <div><Chip><Chip.Key>Origin X-Forwarded-For</Chip.Key>{log['origin.x_forwarded_for']}</Chip></div>
                </Grid>
                <Grid>
                    <TitleBar>
                        <TitleBar.Title>
                            Auth Information
                        </TitleBar.Title>
                    </TitleBar>
                    <div><Chip><Chip.Key>Client Id</Chip.Key>{log["authentication.client.id"]}</Chip></div>
                    <div><Chip><Chip.Key>Grant Type</Chip.Key>{log["authentication.grant.type"]}</Chip></div>
                    <div><Chip><Chip.Key>Authentication Type</Chip.Key>{log["authentication.type"]}</Chip></div>
                    <div><Chip><Chip.Key>Authentication Token</Chip.Key>{log["authentication.token"]}</Chip></div>
                    <div><Chip><Chip.Key>DT Security Context</Chip.Key>{log["dt.security_context"]}</Chip></div>
                    <div><Chip><Chip.Key>User ID</Chip.Key>{log['user.id']}</Chip></div>
                    <div><Chip><Chip.Key>User Name</Chip.Key>{log['user.name']}</Chip></div>
                    <div><Chip><Chip.Key>User Organization</Chip.Key>{log['user.organization']}</Chip></div>
                </Grid>

                <Grid gridColumn={'1/4'}>
                    {Diff?.length > 0 && (log['event.type'] !== "CREATE" && log['event.type'] !== "NO_CHANGE") &&
                        <div>
                            <TitleBar>
                                <TitleBar.Title>
                                    Changes:
                                </TitleBar.Title>
                            </TitleBar>
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={log['details.json_patch'] == null ? {} : JSON.parse(log['details.json_patch'])} />
                        </div>
                    }

                    {Diff?.length > 0 &&
                        <Grid width={'100%'} gridTemplateColumns={'1fr 1fr'}>
                            <TitleBar>
                                <TitleBar.Title>
                                    Previous Value:
                                </TitleBar.Title>
                            </TitleBar>
                            <TitleBar>
                                <TitleBar.Title>
                                    New Value:
                                </TitleBar.Title>
                            </TitleBar>
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={Diff[0].kind == "N" ? {} : JSON.parse(Diff[0].lhs)} />
                            <ReactJson enableClipboard={false} displayDataTypes={false} theme={'harmonic'} defaultValue={{}} src={Diff[0].kind == "D" ? {} : JSON.parse(Diff[0].rhs)} />
                        </Grid>
                    }
                </Grid>
            </Grid>}
        </Surface >
    );
};
