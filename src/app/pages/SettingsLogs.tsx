import { subDays } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react'
import { functions } from "@dynatrace-sdk/app-utils";
import { Page, TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTable, TableUserActions, createDefaultVisibilityObjectForColumns, TableVariantConfig, useFilteredData, } from '@dynatrace/strato-components-preview/tables';
import type { TableColumn } from '@dynatrace/strato-components-preview/tables';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { Button, FilterBar, FilterItemValues, Flex, FormField, Grid, SelectV2, Surface, TextInput, ToggleButtonGroup, ToggleButtonGroupItem, Paragraph } from '@dynatrace/strato-components-preview';
import { SyntheticMonitoringIcon, FilterIcon, FilterOutIcon, FolderOpenIcon, GroupIcon, HashtagIcon, LockIcon, LoginIcon, LogoutIcon, ManualIcon, OneAgentSignetIcon, PlusIcon, ResetIcon, WorldmapIcon, ApplicationsIcon, LineChartIcon, HostsIcon, ServicesIcon, HttpIcon, CodeIcon, AccountIcon, AnalyticsIcon, DynatraceIcon, UfoIcon, ContainerIcon, QueuesIcon, SettingIcon, NetworkIcon, NodeIcon, TechnologiesIcon, DeleteIcon, CodeOffIcon, EditIcon } from '@dynatrace/strato-icons';
import { Sheet } from '@dynatrace/strato-components-preview/overlays';
import { IndividualLog } from '../components/IndividualLog';
import { TimeframeSelector } from '@dynatrace/strato-components-preview/forms';
import type { TimeframeV2 } from '@dynatrace/strato-components-preview/core';

const auditColumns: TableColumn[] = [
    {
        header: 'Audit Information',
        id: 'auditInfo',
        columns: [
            // UNIX EPOCH timestamp in nanoseconds
            {
                header: 'Timestamp (DD/MM/YYYY)',
                accessor: 'timestamp',
                columnType: 'date',
                minWidth: 200,
                autoWidth: true,
            },

            // POST; PUT; GET
            {
                header: 'Type',
                accessor: `"event.type"`,
                // columnType: 'date',
                minWidth: 125,
                autoWidth: true,
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
                accessor: `"event.outcome"`,
                autoWidth: true,
                alignment: 'center',
                cell: ({ value, row }) => {
                    return value.toUpperCase();
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
                accessor: `"event.version"`,
                autoWidth: true,
                maxAutoWidth: 120,
                alignment: 'center'
            },
            {
                header: 'Provider',
                accessor: '"event.provider"',
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            // {
            //     header: 'App Id',
            //     accessor: '"app.id"',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            {
                header: 'Origin Address',
                accessor: '"origin.address"',
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            // {
            //     header: 'Origin Session',
            //     accessor: '"origin.session"',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            // {
            //     header: 'Origin X-Forwarded-For',
            //     accessor: '"origin.x_forwarded_for"',
            //     autoWidth: true,
            //     maxAutoWidth: 300,
            //     lineWrap: false
            // },
            {
                header: 'Resource',
                accessor: 'resource',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            {
                header: 'Source',
                accessor: '"details.source"',
                autoWidth: true,
                alignment: 'center',
                maxAutoWidth: 300,
                cell: ({ value, row }) => {
                    return value.toUpperCase();
                },
            },
        ]
    },
    {
        header: 'Settings Information',
        id: 'settingsInfo',
        columns: [
            {
                header: 'Schema ID',
                accessor: '"details.dt.settings.schema_id"',
                minWidth: 300
            },
            {
                header: 'Schema Version',
                accessor: '"details.dt.settings.schema_version"',
                autoWidth: true,
                alignment: 'left'
            },
            {
                header: 'Object ID',
                accessor: '"details.dt.settings.object_id"',
                autoWidth: true,
                maxAutoWidth: 400
            },
            {
                header: 'Object Summary',
                accessor: '"details.dt.settings.object_summary"',
                autoWidth: true,
                maxAutoWidth: 400
            },
            {
                header: 'Scope Type',
                accessor: '"details.dt.settings.scope_type"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                alignment: 'center',
                cell: ({ value, row }) => {
                    return value.toUpperCase();
                },
            },
            {
                header: 'Scope Name',
                accessor: '"details.dt.settings.scope_name"',
                minWidth: 400,
            },
            {
                header: 'Scope Id',
                accessor: '"details.dt.settings.scope_id"',
                minWidth: 250,
                autoWidth: true,
                maxAutoWidth: 400,
            },
            {
                header: 'JSON Before Changes',
                accessor: '"details.json_before"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'JSON After Changes',
                accessor: '"details.json_after"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'JSON Patch',
                accessor: '"details.json_patch"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'Position Changes',
                accessor: '"details.position"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },

        ]
    },
    {
        header: 'Authentication Info',
        id: 'authInfo',
        columns: [
            // {
            //     header: 'Client Id',
            //     accessor: `"authentication.client.id"`,
            //     minWidth: 200,
            //     autoWidth: true,
            // },
            // {
            //     header: 'Grant Type',
            //     accessor: `"authentication.grant.type"`,
            //     minWidth: 100,
            //     autoWidth: true,
            //     alignment: 'center',
            // },
            {
                header: 'Auth Type',
                accessor: `"authentication.type"`,
                autoWidth: true,
                alignment: 'center',
            },
            {
                header: 'DT Security Context',
                accessor: `"dt.security_context"`,
                autoWidth: true,
                maxAutoWidth: 100,
            },
            // 35ba9499-f87c-4047-962c-14dc32e255e5
            {
                header: 'User Id',
                accessor: `"user.id"`,
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            // Wolfgang Amadeus Mozart
            {
                header: 'User Name',
                accessor: `"user.name"`,
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            // DYNATRACE; CUSTOMER; PARTNER
            {
                header: 'User Organization',
                accessor: `"user.organization"`,
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
            {
                header: 'Authentication Token',
                accessor: `"authentication.token"`,
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
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

    const [timeFrame, setTimeFrame] = useState<TimeframeV2 | null>({
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
    // const [filteredData, setFilteredData] = useState<Array<any>>([]);



    const [loading, setLoading] = useState<boolean>(false);
    const [showSheet, setShowSheet] = useState<boolean>(false);
    const [auditLogs, setAuditLogs] = useState<Array<any>>([]);
    const [scopeTypes, setScopeTypes] = useState<Array<any>>([]);
    const [eventTypes, setEventTypes] = useState<Array<any>>([]);
    const [schemaIds, setschemaIds] = useState<Array<any>>([]);
    const [userOrgs, setUserOrgs] = useState<Array<any>>([]);
    const [originalLogs, setOriginalLogs] = useState<Array<any>>([]);
    const [selectedLogs, setSelectedLogs] = useState<Array<any>>([]);
    const [logCount, setLogCount] = useState<String>('');
    const [selectedSchemas, setSelectedSchemas] = useState<Array<any>>([]);
    const [selectedFilters, setSelectedFilters] = useState<Array<any>>([]);
    const [selectedFilterType, setSelectedFilterType] = useState<String>('');

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
        "SYNTHETIC_TEST": <SyntheticMonitoringIcon />,
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

    const columns = useMemo<TableColumn[]>(() => auditColumns, []);

    type ColumnVisibilityType = Record<string, 'visible' | 'hidden'>;
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityType>(createDefaultVisibilityObjectForColumns(columns));
    const [columnVisibility2, setColumnVisibility2] = useState<ColumnVisibilityType>(createDefaultVisibilityObjectForColumns(columns));

    function onColumnVisibilityChange(columnVisibility: ColumnVisibilityType) {
        setColumnVisibility(columnVisibility);
    }
    function onColumnVisibilityChange2(columnVisibility2: ColumnVisibilityType) {
        setColumnVisibility2(columnVisibility2);
    }

    const tableVariant: TableVariantConfig = useMemo(
        () => ({
            rowDensity: rowDensity as 'default' | 'condensed' | 'comfortable',
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

    const [sortChangeMessage, setSortChangeMessage] = useState(
        'onSortChange: unset'
    );
    // onSortChange handler
    const onSortChange = (columnId, direction) => {
        setSortChangeMessage(
            direction === 'unset'
                ? 'onSortChange: unset'
                : `onSortChange: columnId :: ${columnId}, direction :: ${direction}`
        );
    };

    const myRowSelectionChangedListener = (
        selectedRows: Record<string, boolean>,
        selectedRowsData: any[],
        trigger: 'user' | 'internal'
    ) => {
        console.log('row selection obj', selectedRows);
        console.log('row selection data', selectedRowsData);
        console.log('trigger', trigger);
        if (selectedRowsData?.length >= 1) {
            setSelectedLogs(selectedRowsData)
        }
        if (selectedRowsData?.length < 1 && showSheet == true) {
            setShowSheet(false)
        };
    }

    const clearFilters = (e) => {
        e.preventDefault();
        setSelectedFilterType('')
        setAuditLogs(originalLogs);
        setSelectedFilters(['No additional filter applied']);
        setLogCount(originalLogs.length.toString());
        setSelectedSchemas([]);
        return;
    }

    const getAuditLogs = async (timeFrame) => {
        setLoading(true);
        const apiAuditLogs = await functions.call('get-audit-logs', { data: timeFrame }).then(response => response.json());

        console.log(apiAuditLogs)

        setAuditLogs(apiAuditLogs.result.records);
        setOriginalLogs(apiAuditLogs.result.records);
        setLogCount(apiAuditLogs.result.records?.length);
        setLoading(false);

        const eventTypes = apiAuditLogs.result.records.map(log => log["event.type"].toUpperCase());
        const uniqueEventTypes = new Set(eventTypes);
        const uniqueEventTypesArray = [...uniqueEventTypes];
        setEventTypes(uniqueEventTypesArray);

        const scopeTypes = apiAuditLogs.result.records.map(log => log["details.dt.settings.scope_type"].toUpperCase());
        const uniqueScopeTypes = new Set(scopeTypes);
        const uniqueScopeTypesArray = [...uniqueScopeTypes];
        setScopeTypes(uniqueScopeTypesArray);

        const schemaIdss = apiAuditLogs.result.records.map(log => log["details.dt.settings.schema_id"]);
        const uniqueSchema = new Set(schemaIdss);
        const schemaArray = [...uniqueSchema];
        setschemaIds(schemaArray);

        const userOrgTypes = apiAuditLogs.result.records.map(log => log["user.organization"]);
        const userOrgSchema = new Set(userOrgTypes);
        const userOrgArray = ["ALL", ...userOrgSchema];
        setUserOrgs(userOrgArray);
    }

    useEffect(() => {
        getAuditLogs(timeFrame);
    }, [])


    // const fetchAuditLogsQuery = `
    // fetch logs, from: ${timeFrame?.from.value}, to:${timeFrame?.to.value}
    //     | filter logtype == "AUDIT"
    // `





    // const { data, error, isLoading, refetch } = useDqlQuery({ body: { query: fetchAuditLogsQuery } }, { autoFetch: false, autoFetchOnUpdate: false });

    // console.log(data, error, isLoading, refetch);

    // const auditLogs = data?.records;


    useEffect(() => {
        if (timeFrame !== null) {
            if (oldestQuery == '') {
                setOldestQuery(timeFrame.from.absoluteDate)
            }
            const oldestDate = new Date(oldestQuery);
            const selectedDate = new Date(timeFrame.from.absoluteDate);
            console.log("Oldest Date: " + oldestDate)
            console.log("Selected Date: " + selectedDate)

            // number MS since 1970 so if a date is a greater number, its later in the year therefore most recent
            if (selectedDate > oldestDate) {
                console.log("selectedDate > oldest date, selected Date is NEWER than oldest Date therefore we don't fetch data but instead filter")
                const filteredLogsInsteadofFetchingNew = filteredData.filter(auditLog => {
                    const logTimestamp = new Date(auditLog.timestamp);
                    return logTimestamp > selectedDate;
                })

                console.log(filteredLogsInsteadofFetchingNew)
                setAuditLogs(filteredLogsInsteadofFetchingNew);
                setLogCount(filteredLogsInsteadofFetchingNew.length.toString());

            }

            // number MS since 1970 so if a date is a less number, its earlier in the year therefore older time frame
            if (selectedDate < oldestDate) {
                setOldestQuery(timeFrame.from.absoluteDate)
                console.log('updated the oldest query time')
                getAuditLogs(timeFrame)
            }

        }
    }, [timeFrame])

    const handleEventTypeClick = (e) => {
        e.preventDefault();

        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }
        const filteredLogs = originalLogs?.filter(log => log["event.type"].toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('Event Type')
        setLogCount(filteredLogs.length.toString());

    }

    const handleCategoryClick = (e) => {
        e.preventDefault();

        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }
        const filteredLogs = originalLogs?.filter(log => log.category.toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('Category')
        setLogCount(filteredLogs.length.toString());
    }

    const handleScopeTypeClick = (e) => {
        e.preventDefault();
        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }
        const filteredLogs = originalLogs?.filter(log => log["details.dt.settings.scope_type"].toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('Scope Type')
        setLogCount(filteredLogs.length.toString());
    }

    const handleOrgTypeClick = (e) => {
        e.preventDefault();
        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }
        const filteredLogs = originalLogs?.filter(log => log["user.organization"].toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('User Organization')
        setLogCount(filteredLogs.length.toString());
    }

    const handleUserTypeClick = (e) => {
        e.preventDefault();
        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }
        const filteredLogs = originalLogs?.filter(log => log.userType.toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('User Type')
        setLogCount(filteredLogs.length.toString());


    }

    const handleSelectSchema = (e) => {
        console.log(e)
        setSelectedSchemas(e);

        if (e.length == 0 || e.length == schemaIds.length) {
            setSelectedFilterType('')
            setAuditLogs(originalLogs);
            setSelectedFilters(['No additional filter applied']);
            setLogCount(originalLogs.length.toString());
            return;
        }

        const filteredLogs = originalLogs?.filter(log => e.includes(log["details.dt.settings.schema_id"]));
        setAuditLogs(filteredLogs);
        setSelectedFilters(e);
        setSelectedFilterType('Schema Id');
        setLogCount(filteredLogs.length.toString());
        setSelectedSchemas(e);

    }

    // function onClickQuery() {
    //     refetch();
    // }
    // const grailLogs = useDqlQuery(
    //     {
    //         body: {
    //             query: fetchAuditLogsQuery
    //         },
    //     },
    //     { autoFetch: false, autoFetchOnUpdate: false }
    // );

    // console.log(grailLogs)

    return (
        <Page style={{ height: 'unset', maxHeight: 'unset' }}>
            <Page.Sidebar resizable={true} preferredWidth={300}>
                <Flex flexDirection='column'>
                    {/* <EventTypeFilters handleEventTypeClick={handleEventTypeClick} /> */}
                    {/* <CategoryFilters handleCategoryClick={handleCategoryClick} handleUserTypeClick={handleUserTypeClick} userTypes={userTypes} /> */}
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
                                        {iconMap[scope.toUpperCase()]}
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
                                        {iconMap[scope.toUpperCase()]}
                                        <Button onClick={handleScopeTypeClick} key={index}>{scope.toUpperCase()}</Button>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Surface>
                    <h3 style={{ margin: 5 }}>User Organization Filters</h3>
                    <Surface>
                        <Flex flexDirection='column'>
                            {userOrgs.sort().map((org, index) => {
                                return (
                                    <Flex justifyContent='flex-start' alignItems='center' key={index}>
                                        {iconMap[org.toUpperCase()]}
                                        <Button onClick={handleOrgTypeClick} key={index}>{org.toUpperCase()}</Button>
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
                        <TitleBar.Title>View your Audit Logs</TitleBar.Title>
                        <TitleBar.Subtitle>Audit Log Count: {logCount} <br /> Selected Filter {selectedFilterType.length == 0 ? '' : '- ' + selectedFilterType} - {selectedFilters?.length == 0 ? 'No additional filter applied' : selectedFilters?.length == 1 ? selectedFilters : selectedFilters.join(' ')}</TitleBar.Subtitle>

                        <TitleBar.Suffix style={{ minWidth: '250px' }}>
                            <Flex flexDirection='column' style={{ minWidth: 'fit-content' }} justifyContent='flex-end' alignItems='flex-end' >

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
                    enableDefaultSort={true}
                    resizable
                    selectableRows
                    sortable
                    onSortChange={onSortChange}
                    onRowSelectionChange={myRowSelectionChangedListener}
                    // onColumnOrderChange={handleColumnOrderChange}
                    onColumnVisibilityChange={onColumnVisibilityChange}
                    key={"mainTable"}
                >
                    <DataTable.UserActions>
                        <DataTable.CellActions>
                            {({ cell }) => (
                                <TableUserActions>
                                    <TableUserActions.CopyItem value={`${cell.value}`} />
                                </TableUserActions>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="eventType">
                            {({ cell, row, column }) => (
                                <TableUserActions>
                                    <TableUserActions.CopyItem value={`${cell.value}`} />
                                    <TableUserActions.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = originalLogs?.filter(log => log.eventType.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cell.value]);
                                            setSelectedFilterType('Event Type');
                                            setLogCount(filteredLogs.length.toString());


                                        }}
                                    >
                                        <TableUserActions.ItemIcon>
                                            <FilterIcon />
                                        </TableUserActions.ItemIcon>
                                        Set as filter
                                    </TableUserActions.Item>
                                </TableUserActions>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="category">
                            {({ cell, row, column }) => (
                                <TableUserActions>
                                    <TableUserActions.CopyItem value={`${cell.value}`} />
                                    <TableUserActions.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = originalLogs?.filter(log => log.category.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cell.value]);
                                            setSelectedFilterType('Category');
                                            setLogCount(filteredLogs.length.toString());
                                        }}
                                    >
                                        <TableUserActions.ItemIcon>
                                            <FilterIcon />
                                        </TableUserActions.ItemIcon>
                                        Set as filter
                                    </TableUserActions.Item>
                                </TableUserActions>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column="userType">
                            {({ cell, row, column }) => (
                                <TableUserActions>
                                    <TableUserActions.CopyItem value={`${cell.value}`} />
                                    <TableUserActions.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = originalLogs?.filter(log => log.userType.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cell.value]);
                                            setSelectedFilterType('User Type');
                                            setLogCount(filteredLogs.length.toString());
                                        }}
                                    >
                                        <TableUserActions.ItemIcon>
                                            <FilterIcon />
                                        </TableUserActions.ItemIcon>
                                        Set as filter
                                    </TableUserActions.Item>
                                </TableUserActions>
                            )}
                        </DataTable.CellActions>
                        <DataTable.CellActions column='dt.settings.schema_id'>
                            {({ cell, row, column }) => (
                                <TableUserActions>
                                    <TableUserActions.CopyItem value={`${cell.value}`} />
                                    <TableUserActions.Item
                                        onSelect={() => {
                                            /* trigger custom action */
                                            const filteredLogs = originalLogs?.filter(log => log["dt.settings.schema_id"] === cell.value);
                                            setAuditLogs(filteredLogs);
                                            setSelectedFilters([cell.value]);
                                            setSelectedFilterType('Schema Id');
                                            setLogCount(filteredLogs.length.toString());
                                            setSelectedSchemas([cell.value]);
                                        }}
                                    >
                                        <TableUserActions.ItemIcon>
                                            <FilterIcon />
                                        </TableUserActions.ItemIcon>
                                        Set as filter
                                    </TableUserActions.Item>
                                </TableUserActions>
                            )}
                        </DataTable.CellActions>
                        <DataTable.ColumnActions>
                            {() => (
                                <>
                                    <TableUserActions>
                                        <TableUserActions.HideColumn />
                                        <TableUserActions.LineWrap />
                                        {/* <TableUserActions.ColumnOrder /> */}
                                    </TableUserActions>

                                </>
                            )}
                        </DataTable.ColumnActions>
                    </DataTable.UserActions>
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
                            <SelectV2 multiple clearable onChange={(e) => handleSelectSchema(e)} value={selectedSchemas}>
                                <SelectV2.Trigger width='200px' placeholder="Select a schema Id" />
                                <SelectV2.Content width="500px" showSelectedOptionsFirst={true}>
                                    <SelectV2.EmptyState>
                                        No matching countries found.
                                    </SelectV2.EmptyState>
                                    <SelectV2.Filter />
                                    {schemaIds.filter((schema) => schema?.length > 0).map((schema, index) => {
                                        return (
                                            <SelectV2.Option key={index} value={schema}>{schema}</SelectV2.Option>
                                        )
                                    })}
                                </SelectV2.Content>
                            </SelectV2>
                        </FormField>

                        {/* Custom Action - Clear Filters */}
                        <Button color={'neutral'} width={'content'} onClick={clearFilters}>
                            <Button.Prefix>
                                <FilterOutIcon />
                            </Button.Prefix>
                            Clear Filters
                        </Button>




                        {/* Button group for table look */}
                        <Flex flexDirection="column" flex={1}>
                            <Flex justifyContent="end">
                                <ToggleButtonGroup value={rowDensity} onChange={setRowDensity}>
                                    <ToggleButtonGroupItem value="condensed">
                                        Condensed
                                    </ToggleButtonGroupItem>
                                    <ToggleButtonGroupItem value="default">
                                        Default
                                    </ToggleButtonGroupItem>
                                    <ToggleButtonGroupItem value="comfortable">
                                        Comfortable
                                    </ToggleButtonGroupItem>
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