import { subDays } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react'
import { useSettingsAuditLogs } from '../hooks/useSettingsAuditLogs';
import { Page, TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTable, TableActionsMenu, useFilteredData, } from '@dynatrace/strato-components-preview/tables';
import type { DataTableColumnDef } from '@dynatrace/strato-components-preview/tables';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { Button, Chip, FilterBar, FilterItemValues, Flex, FormField, Grid, Select, Surface, TextInput, ToggleButtonGroup } from '@dynatrace/strato-components-preview';
import { SyntheticMonitoringSignetIcon, FilterIcon, FilterOutIcon, FolderOpenIcon, LockIcon, PlusIcon, RefreshIcon, ResetIcon, WorldmapIcon, ApplicationsIcon, LineChartIcon, HostsIcon, ServicesIcon, HttpIcon, CodeIcon, AccountIcon, AnalyticsIcon, DynatraceIcon, ContainerIcon, QueuesIcon, SettingIcon, NetworkIcon, NodeIcon, TechnologiesIcon, DeleteIcon, CodeOffIcon, EditIcon, WarningIcon } from '@dynatrace/strato-icons';
import { Sheet } from '@dynatrace/strato-components-preview/overlays';
import { IndividualLog } from '../components/IndividualLog';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/filters';
import type { Timeframe } from '@dynatrace/strato-components-preview/core';
import { useUserMap } from '../hooks/useUserMap';
import { injectUserColumns, maskToken } from '../utils/auditUtils';

const auditColumns: DataTableColumnDef<any>[] = [
    {
        header: 'Audit Information',
        id: 'auditInfo',
        columns: [
            // UNIX EPOCH timestamp in nanoseconds
            {
                header: 'Timestamp (DD/MM/YYYY)',
                id: 'timestamp',
                accessor: 'timestamp',
                columnType: 'date',
                minWidth: 200,

            },

            // POST; PUT; GET
            {
                header: 'Type',
                id: `"event.type"`,
                accessor: '[\"event.type\"]',
                // columnType: 'date',
                minWidth: 125,

                alignment: 'center',
                thresholds: [
                    {
                        value: 'CREATE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Accent,
                    },
                    {
                        value: 'DELETE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Critical.Accent,
                    },
                    {
                        value: 'NO_CHANGE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Emphasized,
                    },
                    // {
                    //     value: 'LOGOUT',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Neutral.Accent,
                    // },
                    // {
                    //     value: 'REMOTE_CONFIGURATION_MANAGEMENT',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Success.Default,
                    // },
                    // {
                    //     value: 'REVOKE',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Success.Default,
                    // },
                    // {
                    //     value: 'TAG_ADD',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Success.Accent,
                    // },
                    // {
                    //     value: 'TAG_REMOVE',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Critical.Accent,
                    // },
                    // {
                    //     value: 'TAG_UPDATE',
                    //     comparator: 'equal-to',
                    //     backgroundColor: Colors.Background.Container.Warning.Accent,
                    // },
                    {
                        value: 'UPDATE',
                        comparator: 'equal-to',
                        color: Colors.Text.Primary.OnAccent.Default,
                        backgroundColor: Colors.Background.Container.Warning.Accent,
                    },
                ],
            },
            // 200; success; failure
            {
                header: 'Outcome',
                id: `"event.outcome"`,
                accessor: '[\"event.outcome\"]',
                minWidth: 100,
                alignment: 'center',
                cell: ({ value }) => {
                    if (typeof (value) === "string") {
                        return value.toUpperCase();
                    }
                    else {
                        return value;
                    }
                },
                thresholds: [
                    {
                        value: 'success',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Accent,
                    },
                    {
                        value: '200',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Accent,
                    },
                    {
                        value: 'failure',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Critical.Accent,
                    },
                ],
            },
            {
                header: 'Version',
                id: `"event.version"`,
                accessor: '[\"event.version\"]',
                minWidth: 100,
                alignment: 'center'
            },
            {
                header: 'Provider',
                id: '"event.provider"',
                accessor: '[\"event.provider\"]',
                minWidth: 150,
                alignment: 'center'

            },
            // {
            //     header: 'App Id',
            //     accessor: '[\"app.id\"]',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            {
                header: 'Origin Address',
                id: '"origin.address"',
                accessor: '[\"origin.address\"]',
                minWidth: 150,
            },
            // {
            //     header: 'Origin Session',
            //     accessor: '[\"origin.session\"]',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            // {
            //     header: 'Origin X-Forwarded-For',
            //     accessor: '[\"origin.x_forwarded_for\"]',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            {
                header: 'Resource',
                id: 'resource',
                accessor: 'resource',
                minWidth: 150,
                alignment: 'left'
            },
            {
                header: 'Source',
                id: '"details.source"',
                accessor: '[\"details.source\"]',
                minWidth: 100,
                cell: ({ value }) => {
                    return value?.toUpperCase();
                },
                alignment: 'left'
            },
        ]
    },
    {
        header: 'Settings Information',
        id: 'settingsInfo',
        columns: [
            {
                header: 'Schema ID',
                id: '"details.dt.settings.schema_id"',
                accessor: '[\"details.dt.settings.schema_id\"]',
                minWidth: 300
            },
            {
                header: 'Schema Version',
                id: '"details.dt.settings.schema_version"',
                accessor: '[\"details.dt.settings.schema_version\"]',
                minWidth: 130,
                alignment: 'center',
            },
            {
                header: 'Object ID',
                id: '"details.dt.settings.object_id"',
                accessor: '[\"details.dt.settings.object_id\"]',
                minWidth: 250,
            },
            {
                header: 'Object Summary',
                id: '"details.dt.settings.object_summary"',
                accessor: '[\"details.dt.settings.object_summary\"]',
                minWidth: 200,
            },
            {
                header: 'Scope Type',
                id: '"details.dt.settings.scope_type"',
                accessor: '[\"details.dt.settings.scope_type\"]',
                minWidth: 150,
                alignment: 'center',
                cell: ({ value }) => {
                    return value?.toUpperCase();
                },
            },
            {
                header: 'Scope Name',
                id: '"details.dt.settings.scope_name"',
                accessor: '[\"details.dt.settings.scope_name\"]',
                minWidth: 400,
            },
            {
                header: 'Scope Id',
                id: '"details.dt.settings.scope_id"',
                accessor: '[\"details.dt.settings.scope_id\"]',
                minWidth: 250,
            },
            {
                header: 'JSON Before Changes',
                id: '"details.json_before"',
                accessor: '[\"details.json_before\"]',
                minWidth: 150,
            },
            {
                header: 'JSON After Changes',
                id: '"details.json_after"',
                accessor: '[\"details.json_after\"]',
                minWidth: 150,
            },
            {
                header: 'JSON Patch',
                id: '"details.json_patch"',
                accessor: '[\"details.json_patch\"]',
                minWidth: 150,
            },
            {
                header: 'Position Changes',
                id: '"details.position"',
                accessor: '[\"details.position\"]',
                minWidth: 150,
            },

        ]
    },
    {
        header: 'Authentication Info',
        id: 'authInfo',
        columns: [
            // {
            //     header: 'Client Id',
            //     accessor: '[\"authentication.client.id\"]',
            //     minWidth: 200,
            //     autoWidth: true,
            // },
            // {
            //     header: 'Grant Type',
            //     accessor: '[\"authentication.grant.type\"]',
            //     minWidth: 100,
            //     autoWidth: true,
            //     alignment: 'center',
            // },
            {
                header: 'Auth Type',
                id: `"authentication.type"`,
                accessor: '[\"authentication.type\"]',
                minWidth: 120,
                alignment: 'center',
            },
            {
                header: 'DT Security Context',
                id: `"dt.security_context"`,
                accessor: '[\"dt.security_context\"]',
                minWidth: 150,
            },
            // 35ba9499-f87c-4047-962c-14dc32e255e5
            {
                header: 'User Id',
                id: `"user.id"`,
                accessor: '[\"user.id\"]',
                minWidth: 150,
            },
            // DYNATRACE; CUSTOMER; PARTNER
            {
                header: 'User Organization',
                id: `"user.organization"`,
                accessor: '[\"user.organization\"]',
                minWidth: 150,
            },
            {
                header: 'Authentication Token',
                id: `"authentication.token"`,
                accessor: '[\"authentication.token\"]',
                minWidth: 180,
                cell: ({ value }) => (
                    <DataTable.DefaultCell>{maskToken(value as string | undefined)}</DataTable.DefaultCell>
                ),
            },
        ]
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

export const SettingsLogs = () => {

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
    const [oldestTimeFrame, setOldestTimeFrame] = useState<string>('');
    const [lastSelectedDate, setLastSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showSheet, setShowSheet] = useState<boolean>(false);
    const [auditLogs, setAuditLogs] = useState<Array<any>>([]);
    const [scopeTypes, setScopeTypes] = useState<Array<any>>([]);
    const [eventTypes, setEventTypes] = useState<Array<any>>([]);
    const [schemaIds, setschemaIds] = useState<Array<any>>([]);
    const [userOrgs, setUserOrgs] = useState<Array<any>>([]);
    const [oldestLogs, setOldestLogs] = useState<Array<any>>([]);
    const [currentTimeFrameLogs, setCurrentTimeFrameLogs] = useState<Array<any>>([]);
    const [selectedLogs, setSelectedLogs] = useState<Array<any>>([]);
    const [logCount, setLogCount] = useState<string>('');
    const [selectedSchemas, setSelectedSchemas] = useState<Array<any>>([]);
    const [selectedFilters, setSelectedFilters] = useState<Array<any>>([]);
    const [selectedFilterType, setSelectedFilterType] = useState<string>('');

    const auditData = useMemo(() => auditLogs, [auditLogs]);

    const iconMap = {
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
        "HOST": <HostsIcon />,
        "HOST_GROUP": <HostsIcon />,
        "HTTP_CHECK": <HttpIcon />,
        "INGEST_CONFIG": <SettingIcon />,
        "KUBERNETES_CLUSTER": <NodeIcon />,
        "MANUAL_TAGGING_SERVICE": `<ManualIcon />`,
        "METRIC": <LineChartIcon />,
        "NO_CHANGE": <CodeOffIcon />,
        "PIPELINE": <QueuesIcon />,
        "PROCESS_GROUP": <TechnologiesIcon />,
        "PROCESS_GROUP_INSTANCE": <TechnologiesIcon />,
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
    const userMap = useUserMap(auditLogs);
    const fetchSettingsLogs = useSettingsAuditLogs();

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
                .includes((filters[filterName].value as string).toLowerCase())
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
        };
    }

    const clearFilters = (e: string | number | React.MouseEvent) => {
        if (e == "") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            setSelectedSchemas([]);
            return;
        }
        if (e === "shift"){
            const useThis = [...selectedFilters];
            useThis.shift();
            if (useThis.length == 0){
                setSelectedFilterType('')
                setAuditLogs(currentTimeFrameLogs);
                setSelectedFilters([]);
                setLogCount(currentTimeFrameLogs.length.toString());
                setSelectedSchemas([]);
                return;
            }

            const useThese = [...currentTimeFrameLogs];
            const filteredLogs = useThese?.filter(log => useThis.includes(log["details.dt.settings.schema_id"]));
            setSelectedFilters(useThis);
            setSelectedSchemas(useThis);
            setAuditLogs(filteredLogs)
            setLogCount(filteredLogs.length.toString());
            return;
        }
        if (typeof(e) == 'number'){
            const useThis = [...selectedFilters];
            useThis.splice(e, 1);
            
            const useThese = [...currentTimeFrameLogs];
            const filteredLogs = useThese?.filter(log => useThis.includes(log["details.dt.settings.schema_id"]));
            setSelectedFilters(useThis);
            setSelectedSchemas(useThis);
            setAuditLogs(filteredLogs)
            setLogCount(filteredLogs.length.toString());
            return;
        }
        if (typeof e === 'object' && 'preventDefault' in e) {
            e.preventDefault();
        }
        setSelectedFilterType('')
        setAuditLogs(currentTimeFrameLogs);
        setSelectedFilters([]);
        setLogCount(currentTimeFrameLogs.length.toString());
        setSelectedSchemas([]);
        return;
    }

    const getAuditLogs = async (timeFrame: Timeframe | null) => {
        setLoading(true);
        const records = await fetchSettingsLogs(timeFrame);

        setCurrentTimeFrameLogs(records);
        setAuditLogs(records);
        setOldestLogs(records);
        setLogCount(records?.length);
        setLoading(false);

        const eventTypes = records.map((log: Record<string, string>) => log["event.type"].toUpperCase());
        const uniqueEventTypes = new Set(eventTypes);
        const uniqueEventTypesArray = [...uniqueEventTypes];
        setEventTypes(uniqueEventTypesArray);

        const scopeTypes = records.map((log: Record<string, string>) => log["details.dt.settings.scope_type"].toUpperCase());
        const uniqueScopeTypes = new Set(scopeTypes);
        const uniqueScopeTypesArray = [...uniqueScopeTypes];
        setScopeTypes(uniqueScopeTypesArray);

        const schemaIdss = records.map((log: Record<string, string>) => log["details.dt.settings.schema_id"]);
        const uniqueSchema = new Set(schemaIdss);
        const schemaArray = [...uniqueSchema];
        setschemaIds(schemaArray);

        const userOrgTypes = records.map((log: Record<string, string>) => log["user.organization"]);
        const userOrgSchema = new Set(userOrgTypes);
        const userOrgArray = ["ALL", ...userOrgSchema];
        setUserOrgs(userOrgArray);
    }

    useEffect(() => {
        getAuditLogs(timeFrame);
    }, [])

    useEffect(() => {
        if (timeFrame !== null) {
            if (oldestTimeFrame == '') {
                setOldestTimeFrame(timeFrame.from.absoluteDate)
            }
            const oldestDate = new Date(oldestTimeFrame);
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
                setOldestTimeFrame(timeFrame.from.absoluteDate)
                console.log('updated the oldest query time');
                getAuditLogs(timeFrame)
            }

        }
    }, [timeFrame])

    const handleEventTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        if (target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => log["event.type"].toLowerCase() === target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([target.innerText]);
        setSelectedFilterType('Event Type')
        setLogCount(filteredLogs.length.toString());

    }

    const handleScopeTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        if (target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => log["details.dt.settings.scope_type"].toLowerCase() === target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([target.innerText]);
        setSelectedFilterType('Scope Type')
        setLogCount(filteredLogs.length.toString());
    }

    const handleOrgTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        if (target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }
        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => log["user.organization"] === target.innerText);
        setAuditLogs(filteredLogs);
        setSelectedFilters([target.innerText]);
        setSelectedFilterType('User Organization')
        setLogCount(filteredLogs.length.toString());
    }

    const handleSelectSchema = (e: string[]) => {
        setSelectedSchemas(e);
        if (e.length == 0) {
            setSelectedFilterType('')
            setAuditLogs(currentTimeFrameLogs);
            setSelectedFilters([]);
            setLogCount(currentTimeFrameLogs.length.toString());
            return;
        }

        const useThese = [...currentTimeFrameLogs];
        const filteredLogs = useThese?.filter(log => e.includes(log["details.dt.settings.schema_id"]));
        setAuditLogs(filteredLogs);
        setSelectedFilters(e);
        setSelectedFilterType('Schema Id');
        setLogCount(filteredLogs.length.toString());
        setSelectedSchemas(e);
    }

    const handleForceRefresh = async () => {
        if (!timeFrame) {
            return;
        }

        setShowSheet(false);
        setSelectedLogs([]);
        setSelectedFilterType('');
        setSelectedFilters([]);
        setSelectedSchemas([]);
        setOldestTimeFrame(timeFrame.from.absoluteDate);
        setLastSelectedDate(timeFrame.from.absoluteDate);

        await getAuditLogs(timeFrame);
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
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[scope.toUpperCase() as keyof typeof iconMap]}
                                        <Button onClick={handleEventTypeClick} key={index}>{scope.toUpperCase()}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    <h3 style={{ margin: 5 }}>Scope Type Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            <Flex justifyContent='flex-start' alignItems='center' key={'all'}>
                                {iconMap["ALL"]}
                                <Button onClick={handleScopeTypeClick} key={'all'}>ALL</Button>
                            </Flex>
                            {scopeTypes.sort().map((scope, index) => {
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[scope.toUpperCase() as keyof typeof iconMap]}
                                        <Button onClick={handleScopeTypeClick} key={index}>{scope.toUpperCase()}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    <h3 style={{ margin: 5 }}>User Organization Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            {userOrgs?.sort().map((org, index) => {
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[org?.toUpperCase() as keyof typeof iconMap]}
                                        <Button onClick={handleOrgTypeClick} key={index}>{org?.toUpperCase()}</Button>
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
                        <TitleBar.Title>View Audit Logs - Settings Changes</TitleBar.Title>
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
                                            const filteredLogs = oldestLogs?.filter(log => log.eventType.toLowerCase() === (cellValue as string).replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cellValue]);
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
                                            const filteredLogs = oldestLogs?.filter(log => log.category.toLowerCase() === (cellValue as string).replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cellValue]);
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
                                            const filteredLogs = oldestLogs?.filter(log => log.userType.toLowerCase() === (cellValue as string).replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cellValue]);
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
                        <DataTable.CellActions column='dt.settings.schema_id'>
                            {({ cellValue }) => (
                                <TableActionsMenu>
                                    <TableActionsMenu.CopyItem value={`${cellValue}`} />
                                    <TableActionsMenu.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = oldestLogs?.filter(log => log["dt.settings.schema_id"] === cellValue);
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cellValue]);
                                            setSelectedFilterType('Schema Id');
                                            setLogCount(filteredLogs.length.toString());
                                            setSelectedSchemas([cellValue]);
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
                            <Select multiple clearable onChange={(e) => handleSelectSchema(e)} value={selectedSchemas}>
                                <Select.Trigger width='200px' placeholder="Select a schema Id" />
                                <Select.Content width="500px" showSelectedOptionsFirst={true}>
                                    <Select.EmptyState>
                                        No matching countries found.
                                    </Select.EmptyState>
                                    <Select.Filter />
                                    {schemaIds.filter((schema) => schema?.length > 0).map((schema, index) => {
                                        return (
                                            <Select.Option key={index} value={schema}>{schema}</Select.Option>
                                        )
                                    })}
                                </Select.Content>
                            </Select>
                        </FormField>

                        {/* Custom Action - Clear Filters */}
                        <Button color={'neutral'} width={'content'} onClick={(e) => clearFilters(e)}>
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
