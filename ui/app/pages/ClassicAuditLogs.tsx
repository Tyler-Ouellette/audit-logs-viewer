import React, { useEffect, useMemo, useState } from 'react';
import { functions } from "@dynatrace-sdk/app-utils";
import { Page, TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTable, TableActionsMenu, useFilteredData, } from '@dynatrace/strato-components-preview/tables';
import type { DataTableColumnDef } from '@dynatrace/strato-components-preview/tables';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { Button, FilterBar, FilterItemValues, Flex, FormField, Grid, Select, Surface, TextInput, ToggleButtonGroup, Chip } from '@dynatrace/strato-components-preview';
import { SyntheticMonitoringSignetIcon, FilterIcon, FilterOutIcon, FolderOpenIcon, LockIcon, PlusIcon, RefreshIcon, ResetIcon, WorldmapIcon, ApplicationsIcon, LineChartIcon, HostsIcon, ServicesIcon, HttpIcon, CodeIcon, AccountIcon, AnalyticsIcon, DynatraceIcon, ContainerIcon, QueuesIcon, SettingIcon, NetworkIcon, NodeIcon, TechnologiesIcon, DeleteIcon, CodeOffIcon, EditIcon, ViewIcon, WarningIcon } from '@dynatrace/strato-icons';
import { Sheet } from '@dynatrace/strato-components-preview/overlays';
import { IndividualLog } from '../components/IndividualLog';
// import { CategoryFilters } from '../components/CategoryFilters';
// import { EventTypeFilters } from '../components/EventTypeFilters';
// import { UserTypeFilters } from '../components/UserTypeFilters';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import { subDays } from 'date-fns';
import { useUserMap } from '../hooks/useUserMap';
import { injectUserColumns } from '../utils/auditUtils';

type ClassicAuditLog = {
    timestamp: string;
    resource?: string;
    ["event.type"]?: string;
    ["user.organization"]?: string;
    [key: string]: unknown;
};

type ClassicAuditLogsResponse = {
    result: {
        records: ClassicAuditLog[];
    };
};

type ClearFiltersInput = '' | 'shift' | number | React.MouseEvent<Element>;

const auditColumns: DataTableColumnDef<ClassicAuditLog>[] = [
    {
        header: 'Audit Information',
        id: 'auditInfo',
        columns: [
            {
                header: 'Timestamp',
                id: 'timestamp',
                accessor: 'timestamp',
                columnType: 'date',
                minWidth: 180,

            },
            {
                header: 'Event ID',
                id: '"event.id"',
                accessor: '[\"event.id\"]',
                minWidth: 300,


            },
            {
                header: 'Kind',
                id: '"event.kind"',
                accessor: '[\"event.kind\"]',
                minWidth: 120,

                alignment: 'center',
            },
            {
                header: 'Version',
                id: '"event.version"',
                accessor: '[\"event.version\"]',
                minWidth: 100,

                alignment: 'center',
            },
            {
                header: 'Type',
                id: '"event.type"',
                accessor: '[\"event.type\"]',
                minWidth: 120,

                alignment: 'center',
            },
            {
                header: 'Provider',
                id: '"event.provider"',
                accessor: '[\"event.provider\"]',
                minWidth: 140,


            },
            {
                header: 'Outcome',
                id: '"event.outcome"',
                accessor: '[\"event.outcome\"]',
                minWidth: 90,

                alignment: 'center',
                cell: ({ value }) => value?.toString()?.toUpperCase(),
            },
            {
                header: 'DT Security Context',
                id: '"dt.security_context"',
                accessor: '[\"dt.security_context\"]',
                minWidth: 140,

            },
            {
                header: 'Origin Type',
                id: '"origin.type"',
                accessor: '[\"origin.type\"]',
                minWidth: 120,

            },
            {
                header: 'Origin Address',
                id: '"origin.address"',
                accessor: '[\"origin.address\"]',
                minWidth: 140,


            },
            {
                header: 'Resource',
                id: 'resource',
                accessor: 'resource',
                minWidth: 220,


            },
        ],
    },
    {
        header: 'Authentication / User',
        id: 'authInfo',
        columns: [
            {
                header: 'Auth Type',
                id: '"authentication.type"',
                accessor: '[\"authentication.type\"]',
                minWidth: 120,

                alignment: 'center',
            },
            {
                header: 'Auth Token (masked)',
                id: '"authentication.token"',
                accessor: '[\"authentication.token\"]',
                minWidth: 180,

                cell: ({ value }) => {
                    const v = value as string | undefined;
                    if (!v) return <></>;
                    // show a masked version to avoid exposing full token in table
                    if (v.length <= 12) return <>{v}</>;
                    return <>{`${v.slice(0, 6)}...${v.slice(-4)}`}</>;
                },

            },
            {
                header: 'User Id',
                id: '"user.id"',
                accessor: '[\"user.id\"]',
                minWidth: 200,


            },
            {
                header: 'User Organization',
                id: '"user.organization"',
                accessor: '[\"user.organization\"]',
                minWidth: 140,

            },
        ],
    },

    // {
    //     header: 'Change Patach Information',
    //     id: 'changePathInfo',
    //     columns: [
    //         {
    //             header: 'Operation',
    //             accessor: 'patch[0].op',
    //             autoWidth: true,
    //             maxAutoWidth: 300,
    //         },
    //         {
    //             header: 'Path',
    //             accessor: 'patch[0].path',
    //             maxAutoWidth: 300,
    //         },
    //         {
    //             header: 'From',
    //             accessor: 'patch[0].from',
    //             autoWidth: true,
    //             maxAutoWidth: 300,
    //         },
    //         // {
    //         //     header: 'Patch Old Value',
    //         //     accessor: 'patch[0].oldValue',
    //         // },
    //     ]
    // },
    // {
    //     header: 'User Information',
    //     id: 'userInfo',
    //     columns: [
    //         {
    //             header: 'User',
    //             accessor: 'user',
    //             minWidth: 150,
    //             autoWidth: true,
    //             maxAutoWidth: 300,
    //         },
    //         {
    //             header: 'User Origin',
    //             accessor: 'userOrigin',
    //             autoWidth: true,
    //             maxAutoWidth: 300,
    //         },
    //         {
    //             header: 'User Type',
    //             accessor: 'userType',
    //             autoWidth: true,
    //             maxAutoWidth: 300,
    //         },
    //     ]
    // }
];

export const ClassicAuditLogs = () => {

    const [timeFrame, setTimeFrame] = useState<Timeframe | null>({
        from: {
            absoluteDate: subDays(new Date(), 1).toISOString(),
            value: 'now()-24h',
            type: 'expression',
        },
        to: {
            absoluteDate: new Date().toISOString(),
            value: 'now()',
            type: 'expression',
        },
    });
    const [oldestQuery, setOldestQuery] = useState<string>('');
    const [lastSelectedDate, setLastSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showSheet, setShowSheet] = useState<boolean>(false);
    const [auditLogs, setAuditLogs] = useState<ClassicAuditLog[]>([]);
    const [eventTypes, setEventTypes] = useState<string[]>([]);
    const [resources, setResources] = useState<string[]>([]);
    const [userOrgs, setUserOrgs] = useState<string[]>([]);
    const [oldestLogs, setOldestLogs] = useState<ClassicAuditLog[]>([]);
    const [currentTimeFrameLogs, setCurrentTimeFrameLogs] = useState<ClassicAuditLog[]>([]);
    const [selectedLogs, setSelectedLogs] = useState<ClassicAuditLog[]>([]);
    const [logCount, setLogCount] = useState<string>('');
    const [selectedResources, setSelectedResources] = useState<string[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedFilterType, setSelectedFilterType] = useState<string>('');

    const auditData = useMemo(() => auditLogs, [auditLogs]);

    const iconMap: Record<string, React.ReactNode> = {
        "AG_GROUP": <NetworkIcon />,
        "AGENT": `<OneAgentSignetIcon />`,
        "ALL": <ResetIcon />,
        "APPLICATION": <ApplicationsIcon />,
        "CREATE": <PlusIcon />,
        "CREDENTIALS_VAULT": <LockIcon />,
        "CUSTOMER": <AccountIcon />,
        "DEBUG_UI": `<BugReportIcon />`,
        "DELETE": <DeleteIcon />,
        "DYNATRACE": <DynatraceIcon />,
        "ENVIRONMENT": <WorldmapIcon />,
        "ENVIRONMENT_ACTIVE_GATE": <ContainerIcon />,
        "GET": <ViewIcon />,
        "HOST": <HostsIcon />,
        "HOST_GROUP": <HostsIcon />,
        "HTTP_CHECK": <HttpIcon />,
        "INGEST_CONFIG": <SettingIcon />,
        "KUBERNETES_CLUSTER": <NodeIcon />,
        "MANUAL_TAGGING_SERVICE": `<ManualIcon />`,
        "METRIC": <LineChartIcon />,
        "NO_CHANGE": <CodeOffIcon />,
        "PATCH": <EditIcon />,
        "PIPELINE": <QueuesIcon />,
        "POST": <PlusIcon />,
        "PROCESS_GROUP": <TechnologiesIcon />,
        "PROCESS_GROUP_INSTANCE": <TechnologiesIcon />,
        "PUT": <EditIcon />,
        "SERVICE": <ServicesIcon />,
        "SYNTHETIC_TEST": <SyntheticMonitoringSignetIcon />,
        "TOKEN": <CodeIcon />,
        "UPDATE": <EditIcon />,
        "USER": <AccountIcon />,
        "UA-SCREEN": <AnalyticsIcon />,
        "WEB_UI": `<DesktopIcon />`,


    }
    const timeFramePresets = [
        {
            from: '-30m',
            to: 'now()',
        },
        {
            from: '-1h',
            to: 'now()',
        },
        {
            from: '-2h',
            to: 'now()',
        },
        {
            from: '-12h',
            to: 'now()',
        },
        {
            from: '-24h',
            to: 'now()',
        },
        {
            from: '-72h',
            to: 'now()',
        },
        {
            from: '-7d',
            to: 'now()',
        },
        {
            from: '-14d',
            to: 'now()',
        },
        {
            from: '-30d',
            to: 'now()',
        },
        {
            from: '-365d',
            to: 'now()',
        },

    ]


    const { onChange, filteredData } = useFilteredData(auditData, filterFn);
    const [rowDensity, setRowDensity] = useState('default');
    const userMap = useUserMap(auditLogs as any[]);

    const columns = useMemo<DataTableColumnDef<any>[]>(() => injectUserColumns(auditColumns, userMap), [userMap]);

    type ColumnVisibilityType = Record<string, boolean>;
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityType>({});
    const [columnVisibility2, setColumnVisibility2] = useState<ColumnVisibilityType>({});

    function onColumnVisibilityChange(columnVisibility: ColumnVisibilityType) {
        setColumnVisibility(columnVisibility);
    }
    function onColumnVisibilityChange2(columnVisibility2: ColumnVisibilityType) {
        setColumnVisibility2(columnVisibility2);
    }

    const tableVariant = useMemo<{ rowDensity: 'default' | 'condensed' | 'comfortable'; verticalAlignment: 'center' }>(
        () => ({
            rowDensity: rowDensity as 'default' | 'condensed' | 'comfortable',
            verticalAlignment: 'center',
        }),
        [rowDensity]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function filterFn(filters: FilterItemValues, entry: any): boolean {
        return Object.keys(filters).every((filterName) =>
            Object.values(entry)
                .join()
                .toLowerCase()
                .includes((filters[filterName].value as string)?.toLowerCase())
        );
    }

    const myRowSelectionChangedListener = (
        selectedRows: Record<string, boolean>
    ) => {
        const selectedRowsData = Object.entries(selectedRows)
            .filter(([, selected]) => selected)
            .map(([index]) => filteredData[parseInt(index)])
            .filter(Boolean);
        if (selectedRowsData.length >= 1) {
            setSelectedLogs(selectedRowsData)
        }
        if (selectedRowsData.length < 1 && showSheet == true) {
            setShowSheet(false)
        }
    }

    const clearFilters = (e: ClearFiltersInput) => {
        if (e == "") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            setSelectedResources([]);
            return;
        }
        if (e === "shift") {
            const useThis = [...selectedFilters];
            useThis.shift();
            if (useThis.length == 0) {
                setSelectedFilterType('')
                setSelectedResources([]);
                setSelectedFilters([]);
                setLogCount(currentTimeFrameLogs.length.toString());
                setSelectedResources([]);
                return;
            }

            const useThese = [...currentTimeFrameLogs];
            const filteredLogs = useThese?.filter(log => useThis.includes(log.resource ?? ''));
            setSelectedFilters(useThis);
            setSelectedResources(useThis);
            setAuditLogs(filteredLogs)
            setLogCount(filteredLogs.length.toString());
            return;
        }
        if (typeof (e) == 'number') {
            const useThis = [...selectedFilters];
            useThis.splice(e, 1);

            const useThese = [...currentTimeFrameLogs];
            const filteredLogs = useThese?.filter(log => useThis.includes(log.resource ?? ''));
            setSelectedFilters(useThis);
            setSelectedResources(useThis);
            setAuditLogs(filteredLogs)
            setLogCount(filteredLogs.length.toString());
            return;
        }
        e.preventDefault();
        setSelectedFilterType('')
        setAuditLogs(currentTimeFrameLogs);
        setSelectedFilters([]);
        setLogCount(currentTimeFrameLogs.length.toString());
    setSelectedResources([]);
        return;
    }

    const getAuditLogs = async (timeFrame: Timeframe) => {
        setLoading(true);
        const apiAuditLogs: ClassicAuditLogsResponse = await functions.call('get-classic-audit-logs', { data: timeFrame }).then(response => response.json());

        setCurrentTimeFrameLogs(apiAuditLogs.result.records);
        setAuditLogs(apiAuditLogs.result.records);
        setOldestLogs(apiAuditLogs.result.records);
        setLogCount(apiAuditLogs.result.records?.length.toString());
        setLoading(false);

        const eventTypes = apiAuditLogs.result.records
            .map((log: ClassicAuditLog) => log["event.type"]?.toUpperCase())
            .filter((value): value is string => Boolean(value));
        const uniqueEventTypes = new Set(eventTypes);
        const uniqueEventTypesArray = [...uniqueEventTypes];
        setEventTypes(uniqueEventTypesArray);


        const resources = apiAuditLogs.result.records
            .map((log: ClassicAuditLog) => log.resource)
            .filter((value): value is string => Boolean(value));
        const uniqueResources = new Set(resources);
        const resourceArray = [...uniqueResources];
        setResources(resourceArray);

        const userOrgTypes = apiAuditLogs.result.records
            .map((log: ClassicAuditLog) => log["user.organization"])
            .filter((value): value is string => Boolean(value));
        const userOrgSchema = new Set(userOrgTypes);
        const userOrgArray = ["ALL", ...userOrgSchema];
        setUserOrgs(userOrgArray);
    }

    useEffect(() => {
        if (timeFrame) {
            getAuditLogs(timeFrame);
        }
    }, [])

    useEffect(() => {
        if (timeFrame !== null) {
            if (oldestQuery == '') {
                setOldestQuery(timeFrame.from.absoluteDate)
            }
            const oldestDate = new Date(oldestQuery);
            const selectedDate = new Date(timeFrame.from.absoluteDate);
            setLastSelectedDate(timeFrame.from.absoluteDate);

            // number MS since 1970 so if a date is a greater number, its later in the year therefore most recent
            if (selectedDate > oldestDate) {
                // number ms since 1970 so if a date is a greater number, its later in the year therefore most recent
                // If selected Date is more recent than oldest date, but older than last selected date, filter from the original logs from oldest query
                if (selectedDate < new Date(lastSelectedDate)) {
                    const useThese = [...oldestLogs];
                    const timestampLogsInsteadOfNew = useThese.filter(auditLog => {
                        const logTimestamp = new Date(auditLog.timestamp);
                        return logTimestamp > selectedDate;
                    })

                    clearFilters('')
                    setCurrentTimeFrameLogs(timestampLogsInsteadOfNew);
                    setAuditLogs(timestampLogsInsteadOfNew);
                    setLogCount(timestampLogsInsteadOfNew.length.toString());
                    return;
                }
                // SelectedDate > oldest date, selected is NEWER than oldest Date, therefore filter instead of query
                if (selectedDate > new Date(lastSelectedDate) && filteredData.length > 0) {
                    const filteredLogsInsteadofFetchingNew = filteredData.filter(auditLog => {
                        const logTimestamp = new Date(auditLog.timestamp);
                        return logTimestamp > selectedDate;
                    })

                    setCurrentTimeFrameLogs(filteredLogsInsteadofFetchingNew);
                    setAuditLogs(filteredLogsInsteadofFetchingNew);
                    setLogCount(filteredLogsInsteadofFetchingNew.length.toString());
                }
                else {
                    const useThese = [...oldestLogs];
                    const filteredLogsInsteadofFetchingNew = useThese.filter(auditLog => {
                        const logTimestamp = new Date(auditLog.timestamp);
                        return logTimestamp > selectedDate;
                    })

                    clearFilters('')
                    setCurrentTimeFrameLogs(filteredLogsInsteadofFetchingNew);
                    setAuditLogs(filteredLogsInsteadofFetchingNew);
                    setLogCount(filteredLogsInsteadofFetchingNew.length.toString());
                }

            }

            // number MS since 1970 so if a date is a less number, its earlier in the year therefore older time frame
            if (selectedDate < oldestDate) {
                setOldestQuery(timeFrame.from.absoluteDate)
                console.log('updated the oldest query time')
                getAuditLogs(timeFrame)
            }

        }
    }, [timeFrame])

    const handleEventTypeClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const selectedValue = e.currentTarget.innerText;

        if (selectedValue == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => (log["event.type"] ?? '').toLowerCase() === selectedValue.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([selectedValue]);
        setSelectedFilterType('Event Type')
        setLogCount(filteredLogs.length.toString());

    }

    const handleResourceClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const selectedValue = e.currentTarget.innerText;
        if (selectedValue == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => (log.resource ?? '') === selectedValue.replace(/\s+/g, '_'));
        setAuditLogs(filteredLogs);
        setSelectedFilters([selectedValue]);
        setSelectedFilterType('Resource')
        setLogCount(filteredLogs.length.toString());
    }

    const handleOrgTypeClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const selectedValue = e.currentTarget.innerText;
        if (selectedValue == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => (log["user.organization"] ?? '').toLowerCase() === selectedValue.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([selectedValue]);
        setSelectedFilterType('User Organization')
        setLogCount(filteredLogs.length.toString());
    }

    const handleSelectResource = (e: string[]) => {
        setSelectedResources(e);

        if (e.length == 0) {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }

        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => e.includes(log.resource ?? ''));
        setAuditLogs(filteredLogs);
        setSelectedFilters(e);
        setSelectedFilterType('Resource');
        setLogCount(filteredLogs.length.toString());
        setSelectedResources(e);
    }

    const handleForceRefresh = async () => {
        if (!timeFrame) {
            return;
        }

        setShowSheet(false);
        setSelectedLogs([]);
        setSelectedFilterType('');
        setSelectedFilters([]);
        setSelectedResources([]);
        setOldestQuery(timeFrame.from.absoluteDate);
        setLastSelectedDate(timeFrame.from.absoluteDate);

        await getAuditLogs(timeFrame);
    }

    const handleClearFiltersClick = (e: React.MouseEvent<Element>) => {
        clearFilters(e);
    }

    return (
        <Page style={{ height: 'unset', maxHeight: 'unset' }}>
            <Page.Sidebar resizable={true} preferredWidth={300}>
                <Flex flexDirection='column'>
                    <h3 style={{ margin: 5 }}>Event Type Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            <Flex justifyContent='flex-start' alignItems='center' key={'all'}>
                                {iconMap["ALL"]}
                                <Button onClick={handleEventTypeClick} key={'all'}>ALL</Button>
                            </Flex>
                            {eventTypes.sort().map((scope, index) => {
                                const scopeKey = scope?.toUpperCase();
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[scopeKey]}
                                        <Button onClick={handleEventTypeClick} key={index}>{scopeKey}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    <h3 style={{ margin: 5 }}>Resource Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            <Flex justifyContent='flex-start' alignItems='center' key={'all'}>
                                {iconMap["ALL"]}
                                <Button onClick={handleResourceClick} key={'all'}>ALL</Button>
                            </Flex>
                            {resources.sort().map((scope, index) => {
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        <Button onClick={handleResourceClick} key={index}>{scope}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    <h3 style={{ margin: 5 }}>User Organization Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            {userOrgs.sort().map((org, index) => {
                                const orgKey = org?.toUpperCase();
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[orgKey]}
                                        <Button onClick={handleOrgTypeClick} key={index}>{orgKey}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    {/* <UserTypeFilters handleUserTypeClick={handleUserTypeClick} userTypes={userTypes} /> */}
                </Flex>
            </Page.Sidebar>
            <Page.Main style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                <Flex justifyContent='space-between'>
                    <TitleBar>
                        <TitleBar.Prefix>
                            <Page.PanelControlButton target="sidebar" />
                        </TitleBar.Prefix>
                        <TitleBar.Title>View Audit Logs - Classic API</TitleBar.Title>
                        <TitleBar.Subtitle>Audit Log Count: {logCount} {logCount == '1000' ? <div style={{ color: Colors.Text.Warning.Default, display: 'flex', alignItems: 'center' }}> <WarningIcon /> Log Limit 1000 records reached</div> : <br />}
                            Selected Filter:
                            <Grid gridTemplateColumns={'repeat(3, 250px)'}>
                                {selectedFilters?.map((filter, index) => {
                                    return (
                                        <Chip key={index}>
                                            {filter}
                                            <Chip.DeleteButton key={index}
                                                aria-label="Remove Filter"
                                                onClick={() => {
                                                    const index = selectedFilters.indexOf(filter);
                                                    const val = index === 0 ? 'shift' : index
                                                    clearFilters(val);
                                                }}
                                            />
                                        </Chip>
                                    )
                                })}
                            </Grid>
                            {selectedFilters?.length == 0 && <Chip>No filter applied</Chip>}
                        </TitleBar.Subtitle>

                        <TitleBar.Suffix style={{ minWidth: '250px' }}>
                            <Flex style={{ minWidth: 'fit-content' }} justifyContent='flex-end' alignItems='flex-end' >
                                <Button
                                    variant="emphasized"
                                    onClick={handleForceRefresh}
                                    disabled={loading || !timeFrame}
                                    style={{ marginRight: '8px' }}
                                >
                                    <Button.Prefix>
                                        <RefreshIcon />
                                    </Button.Prefix>
                                    Force Refresh
                                </Button>

                                <TimeframeSelector style={{ minWidth: 'fit-content' }} value={timeFrame} onChange={setTimeFrame} >
                                    <TimeframeSelector.Presets>
                                        {timeFramePresets.map(preset => (
                                            <TimeframeSelector.PresetItem key={preset.from + preset.to} value={preset} />
                                        ))}
                                    </TimeframeSelector.Presets>
                                </TimeframeSelector >
                            </Flex>
                        </TitleBar.Suffix>
                    </TitleBar>
                </Flex>
                {<DataTable
                    loading={loading}
                    data={filteredData}
                    columns={columns}
                    columnVisibility={columnVisibility}
                    // columnOrder={columnOrder}
                    variant={tableVariant}
                    resizable
                    selectableRows
                    sortable
                    onRowSelectionChange={myRowSelectionChangedListener}
                    // onColumnOrderChange={handleColumnOrderChange}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                    key={"mainTable"}
                >
                        <DataTable.CellActions>
                            {({ cellValue }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                </TableActionsMenu>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="eventType">
                            {({ cellValue, row }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                    <TableActionsMenu.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = oldestLogs?.filter(log => String(log.eventType ?? '').toLowerCase() === String(cellValue ?? '').replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([String(cellValue ?? '')]);
                                            setSelectedFilterType('Event Type');
                                            setLogCount(filteredLogs.length.toString());


                                        }}
                                    >
                                        <TableActionsMenu.Prefix>
                                            <FilterIcon />
                                        </TableActionsMenu.Prefix>
                                        Set as filter
                                    </TableActionsMenu.Item>
                                </TableActionsMenu>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="category">
                            {({ cellValue, row }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                    <TableActionsMenu.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = oldestLogs?.filter(log => String(log.category ?? '').toLowerCase() === String(cellValue ?? '').replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([String(cellValue ?? '')]);
                                            setSelectedFilterType('Category');
                                            setLogCount(filteredLogs.length.toString());
                                        }}
                                    >
                                        <TableActionsMenu.Prefix>
                                            <FilterIcon />
                                        </TableActionsMenu.Prefix>
                                        Set as filter
                                    </TableActionsMenu.Item>
                                </TableActionsMenu>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="userType">
                            {({ cellValue, row }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                    <TableActionsMenu.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = oldestLogs?.filter(log => String(log.userType ?? '').toLowerCase() === String(cellValue ?? '').replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([String(cellValue ?? '')]);
                                            setSelectedFilterType('User Type');
                                            setLogCount(filteredLogs.length.toString());
                                        }}
                                    >
                                        <TableActionsMenu.Prefix>
                                            <FilterIcon />
                                        </TableActionsMenu.Prefix>
                                        Set as filter
                                    </TableActionsMenu.Item>
                                </TableActionsMenu>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column='app.id'>
                            {({ cellValue, row }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                    <TableActionsMenu.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = oldestLogs?.filter(log => log.resource === String(cellValue ?? ''));
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([String(cellValue ?? '')]);
                                            setSelectedFilterType('Resource');
                                            setLogCount(filteredLogs.length.toString());
                                            setSelectedResources([String(cellValue ?? '')]);
                                        }}
                                    >
                                        <TableActionsMenu.Prefix>
                                            <FilterIcon />
                                        </TableActionsMenu.Prefix>
                                        Set as filter
                                    </TableActionsMenu.Item>
                                </TableActionsMenu>
                            )}
                        </DataTable.CellActions>
                        <DataTable.ColumnActions>
                            {() => (
                                <>
                                    <TableActionsMenu>
                                        <TableActionsMenu.HideColumn />
                                        <TableActionsMenu.LineWrap />
                                        {/* <TableActionsMenu.ColumnOrder /> */}
                                    </TableActionsMenu>

                                </>
                            )}
                        </DataTable.ColumnActions>
                    <DataTable.TableActions>

                        {/* Custom Action - Clear Filters */}
                        <Button color={'neutral'} width={'content'} onClick={() => setShowSheet(true)}>
                            <Button.Prefix>
                                <FolderOpenIcon />
                            </Button.Prefix>
                            Open Detailed View
                        </Button>

                        {/* Search Bar for anything in table */}
                        <FilterBar onFilterChange={onChange}>
                            <FilterBar.Item name="filterItem" label="">
                                <TextInput placeholder="Search Table" />
                            </FilterBar.Item>
                        </FilterBar>

                        {/* Select Drop down for schema Id */}
                        <FormField>
                            <Select multiple clearable onChange={(e) => handleSelectResource(e)} value={selectedResources}>
                                <Select.Trigger width='200px' placeholder="Select Resource" />
                                <Select.Content width="500px" showSelectedOptionsFirst={true}>
                                    <Select.EmptyState>
                                        No matching resources found.
                                    </Select.EmptyState>
                                    <Select.Filter />
                                    {resources.filter((r) => r).map((r, index) => {
                                        return (
                                            <Select.Option key={index} value={r}>{r}</Select.Option>
                                        )
                                    })}
                                </Select.Content>
                            </Select>
                        </FormField>

                        {/* Custom Action - Clear Filters */}
                        <Button color={'neutral'} width={'content'} onClick={handleClearFiltersClick}>
                            <Button.Prefix>
                                <FilterOutIcon />
                            </Button.Prefix>
                            Clear Filters
                        </Button>




                        {/* Button group for table look */}
                        <Flex flexDirection="column" flex={1}>
                            <Flex justifyContent="end">
                                <ToggleButtonGroup value={rowDensity} onChange={setRowDensity}>
                                    <ToggleButtonGroup.Item value="condensed">
                                        Condensed
                                    </ToggleButtonGroup.Item>
                                    <ToggleButtonGroup.Item value="default">
                                        Default
                                    </ToggleButtonGroup.Item>
                                    <ToggleButtonGroup.Item value="comfortable">
                                        Comfortable
                                    </ToggleButtonGroup.Item>
                                </ToggleButtonGroup>
                            </Flex>
                        </Flex>

                    </DataTable.TableActions>
                    <DataTable.Toolbar>
                        <DataTable.LineWrap />
                        <DataTable.VisibilitySettings />
                        <DataTable.DownloadData />
                        {/* <DataTable.ColumnOrderSettings /> */}
                    </DataTable.Toolbar>
                    <DataTable.Pagination defaultPageSize={20} />

                </DataTable>}

            </Page.Main>
            <Sheet
                title="Individual Audit Logs"
                show={showSheet}
                onDismiss={() => setShowSheet(false)}
                actions={
                    <Button variant="emphasized" onClick={() => setShowSheet(false)}>
                        Close
                    </Button>
                }
            >
                <Flex flexDirection='column'>
                    <Grid gridTemplateColumns='1fr' width='100%'>
                        {selectedLogs.map((log, index) => <Grid key={index} gridItem><IndividualLog key={index} log={log} /></Grid>)}
                    </Grid>
                </Flex>


            </Sheet>
        </Page>
    )
}
