import React from "react";
import { Card } from "./Card";
import { Flex, Grid, Surface } from "@dynatrace/strato-components-preview";
import { BugReportIcon, CodeIcon, ContainerIcon, DesktopIcon, LockIcon, ManualIcon, OneAgentSignetIcon } from '@dynatrace/strato-icons';
import Colors from '@dynatrace/strato-design-tokens/colors';


export const IndividualLog = ({ log }) => {

    var icon;


    if (log.category == 'ACTIVE_GATE') {
        icon = <ContainerIcon size="large" style={{width: '40px', height: '40px'}}/>
    }
    if (log.category == 'AGENT') {
        icon = <OneAgentSignetIcon size="large" style={{width: '40px', height: '40px'}}/>
    }
    if (log.category == 'CONFIG') {
        icon = <CodeIcon size="large" style={{width: '40px', height: '40px'}}/>
    }
    if (log.category == 'DEBUG_UI') {
        icon = <BugReportIcon size="large" style={{width: '40px', height: '40px'}}/>
    }
    if (log.category == 'MANUAL_TAGGING_SERVICE') {
        icon = <ManualIcon size="large" style={{width: '40px', height: '40px'}}/>
    }
    if (log.category == 'TOKEN') {
        icon = <LockIcon size="large" style={{width: '40px', height: '40px'}} />
    }
    if (log.category == 'WEB_UI') {
        icon = <DesktopIcon size="large" style={{width: '40px', height: '40px'}}/>
    }

    let bgColor;
    switch (log.eventType) {
        case 'CREATE':
            bgColor = Colors.Background.Container.Success.Accent;
            break;
        case 'DELETE':
            bgColor = Colors.Background.Container.Critical.Accent;
            break;
        case 'LOGIN':
            bgColor = Colors.Background.Container.Success.Emphasized;
            break;
        case 'LOGOUT':
            bgColor = Colors.Background.Container.Neutral.Accent;
            break;
       
        case 'REMOTE_CONFIGURATION_MANAGEMENT':
            bgColor = Colors.Background.Container.Success.Default;
            break;
        case 'REVOKE':
            bgColor = Colors.Background.Container.Neutral.Accent;
            break;
        case 'TAG_ADD':
            bgColor = Colors.Background.Container.Success.Accent;
            break;
        case 'TAG_REMOVE':
            bgColor = Colors.Background.Container.Critical.Accent;
            break;
        case 'TAG_UPDATE':
            bgColor = Colors.Background.Container.Warning.Accent;
            break;
        case 'UPDATE':
            bgColor = Colors.Background.Container.Warning.Accent;
            break;
        default:
            bgColor = Colors.Background.Container.Primary.Accent;
            break;
    }


    const readableTime = new Date(log.timestamp).toLocaleString();

    console.log(log)
    return (
        <Surface>
            <Flex flexDirection="column" flexWrap="wrap" maxWidth={300}>
                <div style={{ background: bgColor, padding: '5px', maxWidth: 250 }}>Event Type: {log.eventType}</div>
                <div>{readableTime}</div>
                <Grid gridTemplateColumns="1fr 4fr" maxWidth={250} >
                    {icon}
                    <Flex flexDirection="column">
                        <div>Log Id: {log.logId}</div>
                        <div>Category: {log.category}</div>
                    </Flex>
                </Grid>
                {/* <div>Category: {log.category}</div> */}
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Entity Id: {log.entityId}</div>
                <div>Environment Id: {log.environmentId}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Message: {log.message}</div>
                <div>Status: {log.success}</div>
                <div>User: {log.user}</div>
                <div>User Origin: {log.userOrigin}</div>
                <div>User Type: {log.userType}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Object Id: {log["dt.settings.object_id"]}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Object Summary: {log["dt.settings.object_summary"]}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Schema Id: {log["dt.settings.schema_id"]}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Scope Id: {log["dt.settings.scope_id"]}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Scope Name: {log["dt.settings.scope_name"]}</div>
                <div style={{ maxWidth: '250px', overflowX: 'scroll' }}>Settings Key: {log["dt.settings.key"]}</div>
                <div>Change Patch Information: {log.patch?.map((patchKey, index) => {
                    return (
                        <div key={index}>
                            <div>Operation: {patchKey.op}</div>
                            <div>Path: {patchKey.path}</div>
                            <div>New Value: {typeof (patchKey.value) === 'object' ? '' : patchKey.value}</div>
                            <div>Old Value: {typeof (patchKey.oldValue) === 'object' ? '' : patchKey.oldValue}</div>
                            <div>From: {patchKey.from}</div>
                        </div>
                    )
                })}</div>
                {/* <Card name="test" href="fake" inAppLink={false} imgSrc="test" /> */}
            </Flex>
        </Surface>
    );
};
