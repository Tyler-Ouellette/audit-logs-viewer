import React from "react";
import { Chip, Flex, Grid, Surface, TitleBar } from "@dynatrace/strato-components-preview";
import { Text } from "@dynatrace/strato-components/typography";
import { Divider } from "@dynatrace/strato-components/layouts";
import {
    BugReportIcon,
    CodeIcon,
    ContainerIcon,
    DesktopIcon,
    LockIcon,
    ManualIcon,
    OneAgentSignetIcon,
} from '@dynatrace/strato-icons';
import DeepDiff from 'deep-diff';
import ReactJson from '@microlink/react-json-view';
import { diffLines } from 'diff';
import { useUserInfo } from '../hooks/useUserMap';

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
    ACTIVE_GATE: ContainerIcon,
    AGENT: OneAgentSignetIcon,
    CONFIG: CodeIcon,
    DEBUG_UI: BugReportIcon,
    MANUAL_TAGGING_SERVICE: ManualIcon,
    TOKEN: LockIcon,
    WEB_UI: DesktopIcon,
};

const EVENT_TYPE_COLORS: Record<string, 'success' | 'critical' | 'warning' | 'neutral' | 'primary'> = {
    CREATE: 'success',
    DELETE: 'critical',
    UPDATE: 'warning',
    NO_CHANGE: 'neutral',
};

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
    if (value == null || value === '') return null;
    return (
        <div>
            <Chip style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Chip.Key>{label}</Chip.Key>
                {value}
            </Chip>
        </div>
    );
}

function DiffViewer({ oldObj, newObj, side }: { oldObj: any; newObj: any; side: 'old' | 'new' }) {
    const oldStr = JSON.stringify(oldObj, null, 2) ?? '';
    const newStr = JSON.stringify(newObj, null, 2) ?? '';
    const parts = diffLines(oldStr, newStr);

    const lines: { text: string; highlight: 'removed' | 'added' | null }[] = [];
    for (const part of parts) {
        const partLines = part.value.split('\n');
        if (partLines[partLines.length - 1] === '') partLines.pop();
        for (const text of partLines) {
            if (part.added) {
                if (side === 'new') lines.push({ text, highlight: 'added' });
            } else if (part.removed) {
                if (side === 'old') lines.push({ text, highlight: 'removed' });
            } else {
                lines.push({ text, highlight: null });
            }
        }
    }

    return (
        <pre style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', overflowX: 'auto', margin: 0, padding: '8px 0' }}>
            {lines.map((line, i) => (
                <div
                    key={i}
                    style={{
                        backgroundColor: line.highlight === 'removed' ? 'rgba(255,70,70,0.15)' : line.highlight === 'added' ? 'rgba(40,200,80,0.15)' : 'transparent',
                        borderLeft: line.highlight === 'removed' ? '3px solid rgba(255,70,70,0.7)' : line.highlight === 'added' ? '3px solid rgba(40,200,80,0.7)' : '3px solid transparent',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        whiteSpace: 'pre',
                    }}
                >
                    {line.text || ' '}
                </div>
            ))}
        </pre>
    );
}

export const IndividualLog = ({ log }: { log: any }) => {
    const IconComponent = CATEGORY_ICONS[log.category] ?? DesktopIcon;
    const chipColor = EVENT_TYPE_COLORS[log['event.type']] ?? 'primary';
    const readableTime = new Date(log.timestamp).toLocaleString();
    const isSettings = log["event.provider"] === "SETTINGS";

    const userId = log['user.id'];
    const userInfo = useUserInfo(userId);

    const Diff = DeepDiff(log['details.json_before'], log['details.json_after']);
    const hasDiff = Diff != null && Diff.length > 0;
    const firstDiff = hasDiff ? Diff[0] : null;

    return (
        <Surface>
            {/* Header */}
            <Flex
                alignItems="center"
                gap={12}
                style={{ padding: '14px 20px', borderBottom: '1px solid var(--dt-colors-border-neutral-default)' }}
            >
                <Chip color={chipColor} variant="accent">
                    <Chip.Prefix><IconComponent size="small" /></Chip.Prefix>
                    {log['event.type']}
                </Chip>
                {log['resource'] && (
                    <Text style={{ fontWeight: 500 }}>{log['resource']}</Text>
                )}
                <Flex flex={1} />
                <Text color="text-secondary">{readableTime}</Text>
            </Flex>

            {/* Info sections */}
            <Grid gridTemplateColumns={isSettings ? "1fr 1fr 1fr" : "1fr 1fr"} style={{ padding: '0 8px' }}>
                <Grid>
                    <TitleBar>
                        <TitleBar.Title>Audit Information</TitleBar.Title>
                    </TitleBar>
                    <InfoField label="Log Id" value={log['event.id']} />
                    <InfoField label="Source" value={log['details.source']} />
                    <InfoField label="Resource" value={log['resource']} />
                    <InfoField label="Status" value={log['event.outcome']} />
                    <InfoField label="Version" value={log['event.version']} />
                    <InfoField label="Provider" value={log['event.provider']} />
                    {!isSettings && <InfoField label="App Id" value={log['app.id']} />}
                    <InfoField label="Origin Address" value={log['origin.address']} />
                    <InfoField label="Origin Session" value={log['origin.session']} />
                    <InfoField label="Origin X-Forwarded-For" value={log['origin.x_forwarded_for']} />
                </Grid>

                {isSettings && (
                    <Grid>
                        <TitleBar>
                            <TitleBar.Title>Settings Information</TitleBar.Title>
                        </TitleBar>
                        <InfoField label="Schema Id" value={log["details.dt.settings.schema_id"]} />
                        <InfoField label="Schema Version" value={log["details.dt.settings.schema_version"]} />
                        <InfoField label="Object Id" value={log["details.dt.settings.object_id"]} />
                        <InfoField label="Object Summary" value={log["details.dt.settings.object_summary"]} />
                        <InfoField label="Scope Type" value={log["details.dt.settings.scope_type"]} />
                        <InfoField label="Scope Name" value={log["details.dt.settings.scope_name"]} />
                        <InfoField label="Scope Id" value={log["details.dt.settings.scope_id"]} />
                    </Grid>
                )}

                <Grid>
                    <TitleBar>
                        <TitleBar.Title>Auth Information</TitleBar.Title>
                    </TitleBar>
                    {!isSettings && <InfoField label="Client Id" value={log["authentication.client.id"]} />}
                    {!isSettings && <InfoField label="Grant Type" value={log["authentication.grant.type"]} />}
                    <InfoField label="Authentication Type" value={log["authentication.type"]} />
                    <InfoField label="Authentication Token" value={log["authentication.token"]} />
                    <InfoField label="DT Security Context" value={log["dt.security_context"]} />
                    <InfoField label="User ID" value={log['user.id']} />
                    <InfoField label="User Name" value={[userInfo?.name, userInfo?.surname].filter(Boolean).join(' ') || log['user.name']} />
                    {userInfo?.email && <InfoField label="Email" value={userInfo.email} />}
                    <InfoField label="User Organization" value={log['user.organization']} />
                </Grid>
            </Grid>

            {/* Diff sections */}
            {hasDiff && (
                <Grid style={{ padding: '0 8px' }}>
                    {log['event.type'] !== "CREATE" && log['event.type'] !== "NO_CHANGE" && log['details.json_patch'] != null && (
                        <>
                            <Divider />
                            <TitleBar>
                                <TitleBar.Title>Changes</TitleBar.Title>
                            </TitleBar>
                            <ReactJson
                                enableClipboard={false}
                                displayDataTypes={false}
                                theme="harmonic"
                                defaultValue={{}}
                                src={JSON.parse(log['details.json_patch'])}
                            />
                        </>
                    )}

                    {firstDiff && (
                        <>
                            <Divider />
                            <Grid gridTemplateColumns="1fr 1fr">
                                <TitleBar>
                                    <TitleBar.Title>Previous Value</TitleBar.Title>
                                </TitleBar>
                                <TitleBar>
                                    <TitleBar.Title>New Value</TitleBar.Title>
                                </TitleBar>
                                <DiffViewer
                                    oldObj={firstDiff.kind === "N" ? {} : "lhs" in firstDiff ? JSON.parse(firstDiff.lhs) : {}}
                                    newObj={firstDiff.kind === "D" ? {} : "rhs" in firstDiff ? JSON.parse(firstDiff.rhs) : {}}
                                    side="old"
                                />
                                <DiffViewer
                                    oldObj={firstDiff.kind === "N" ? {} : "lhs" in firstDiff ? JSON.parse(firstDiff.lhs) : {}}
                                    newObj={firstDiff.kind === "D" ? {} : "rhs" in firstDiff ? JSON.parse(firstDiff.rhs) : {}}
                                    side="new"
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            )}
        </Surface>
    );
};
