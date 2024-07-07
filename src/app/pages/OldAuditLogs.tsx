import React, { useEffect, useMemo, useState } from 'react';
import { functions } from "@dynatrace-sdk/app-utils";
import { Page, TitleBar } from '@dynatrace/strato-components-preview/layouts';
import { DataTable, TableUserActions, createDefaultVisibilityObjectForColumns, TableVariantConfig, useFilteredData, } from '@dynatrace/strato-components-preview/tables';
import type { TableColumn } from '@dynatrace/strato-components-preview/tables';
import Colors from '@dynatrace/strato-design-tokens/colors';
import { Button, FilterBar, FilterItemValues, Flex, FormField, Grid, SelectV2, TextInput, ToggleButtonGroup, ToggleButtonGroupItem } from '@dynatrace/strato-components-preview';
import { FilterIcon, FilterOutIcon, FolderOpenIcon } from '@dynatrace/strato-icons';
import { Sheet } from '@dynatrace/strato-components-preview/overlays';
import { IndividualLog } from '../components/IndividualLog';
import { CategoryFilters } from '../components/CategoryFilters';
import { EventTypeFilters } from '../components/EventTypeFilters';
import { UserTypeFilters } from '../components/UserTypeFilters';


const auditColumns: TableColumn[] = [
    {
        header: 'Log Information',
        id: 'logInfo',
        columns: [
            {
                header: 'Timestamp',
                accessor: 'timestamp',
                columnType: 'date',
                minWidth: 200,
                autoWidth: true,
            },
            {
                header: 'Event Type',
                accessor: 'eventType',
                // columnType: 'date',
                minWidth: 100,
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
                        value: 'LOGIN',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Emphasized,
                    },
                    {
                        value: 'LOGOUT',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Neutral.Accent,
                    },
                    {
                        value: 'REMOTE_CONFIGURATION_MANAGEMENT',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Default,
                    },
                    {
                        value: 'REVOKE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Default,
                    },
                    {
                        value: 'TAG_ADD',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Success.Accent,
                    },
                    {
                        value: 'TAG_REMOVE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Critical.Accent,
                    },
                    {
                        value: 'TAG_UPDATE',
                        comparator: 'equal-to',
                        backgroundColor: Colors.Background.Container.Warning.Accent,
                    },
                    {
                        value: 'UPDATE',
                        comparator: 'equal-to',
                        color: Colors.Text.Primary.OnAccent.Default,
                        backgroundColor: Colors.Background.Container.Warning.Accent,
                    },
                ],
            },
            {
                header: 'Category',
                accessor: 'category',
                autoWidth: true,
                alignment: 'center',
            },
            {
                header: 'Environment',
                accessor: 'environmentId',
                autoWidth: true,
                maxAutoWidth: 100,
            },
            {
                header: 'Message',
                accessor: 'message',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
                lineWrap: false
            },
        ]
    },
    {
        header: 'Settings Information',
        id: 'settingsInfo',
        columns: [
            {
                header: 'Schema ID',
                accessor: '"dt.settings.schema_id"',
                minWidth: 200
            },
            {
                header: 'Key',
                accessor: '"dt.settings.key"',
                minWidth: 150
            },
            {
                header: 'Object ID',
                accessor: '"dt.settings.object_id"',
                minWidth: 150
            },
            {
                header: 'Scope Name',
                accessor: '"dt.settings.scope_name"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'Scope Id',
                accessor: '"dt.settings.scope_id"',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'Entity Id',
                accessor: 'entityId',
                minWidth: 200,
                autoWidth: true,
                maxAutoWidth: 300,
            },
        ]
    },
    {
        header: 'Change Patach Information',
        id: 'changePathInfo',
        columns: [
            {
                header: 'Operation',
                accessor: 'patch[0].op',
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'Path',
                accessor: 'patch[0].path',
                maxAutoWidth: 300,
            },
            {
                header: 'From',
                accessor: 'patch[0].from',
                autoWidth: true,
                maxAutoWidth: 300,
            },
            // {
            //     header: 'Patch Old Value',
            //     accessor: 'patch[0].oldValue',
            // },
        ]
    },
    {
        header: 'User Information',
        id: 'userInfo',
        columns: [
            {
                header: 'User',
                accessor: 'user',
                minWidth: 150,
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'User Origin',
                accessor: 'userOrigin',
                autoWidth: true,
                maxAutoWidth: 300,
            },
            {
                header: 'User Type',
                accessor: 'userType',
                autoWidth: true,
                maxAutoWidth: 300,
            },
        ]
    }
];

export const OldAuditLogs = () => {

    const [showSheet, setShowSheet] = useState<boolean>(false);
    const [auditLogs, setAuditLogs] = useState<Array<any>>([]);
    const [userTypes, setUserTypes] = useState<Array<any>>([]);
    const [schemaIds, setschemaIds] = useState<Array<any>>([]);
    const [selectedSchemas, setSelectedSchemas] = useState<Array<any>>([]);
    const [oldestLogs, setOldestLogs] = useState<Array<any>>([]);
    const [logCount, setLogCount] = useState<String>('');
    const [loading, setLoading] = useState(true);
    const [selectedLogs, setSelectedLogs] = useState<Array<any>>([]);
    const [selectedFilters, setSelectedFilters] = useState<Array<any>>([]);
    const [selectedFilterType, setSelectedFilterType] = useState<String>('');

    const columns = useMemo<TableColumn[]>(() => auditColumns, []);
    const auditData = useMemo(() => auditLogs, [auditLogs]);

    const { onChange, filteredData } = useFilteredData(auditData, filterFn);
    const [rowDensity, setRowDensity] = useState('default');

    var icon;
    const iconMap = {
        "ACTIVE_GATE": `<ContainerIcon />`,
        "AGENT": `<OneAgentSignetIcon />`,
        "CONFIG": `<CodeIcon />`,
        "DEBUG_UI": `<BugReportIcon />`,
        "MANUAL_TAGGING_SERVICE": `<ManualIcon />`,
        "TOKEN": `<CodeIcon />`,
        "WEB_UI": `<DesktopIcon />`
    }

    const colorsMap = {
        "CREATE": Colors.Background.Container.Success.Accent,
        "DELETE": Colors.Background.Container.Critical.Accent,
        "LOGIN": Colors.Background.Container.Success.Emphasized,
        "LOGOUT": Colors.Background.Container.Neutral.Accent,
        "REMOTE_CONFIGURATION_MANAGEMENT": Colors.Background.Container.Success.Default,
        "REVOKE": Colors.Background.Container.Neutral.Accent,
        "TAG_ADD": Colors.Background.Container.Success.Accent,
        "TAG_REMOVE": Colors.Background.Container.Critical.Accent,
        "TAG_UPDATE": Colors.Background.Container.Warning.Accent,
        "UPDATE": Colors.Background.Container.Warning.Accent,
    }

    // const [columnOrder, setColumnOrder] = useState([
    //     'timestamp',
    //     'eventType',
    //     'category',
    //     'entityId',
    //     'environmentId',
    //     'message',
    //     'user',
    //     'userOrigin',
    //     'userType',
    //     '"dt.settings.key"',
    //     '"dt.settings.object_id"',
    //     '"dt.settings.schema_id"',
    //     'patch[0].op',
    //     'patch[0].path',
    //     'patch[0].from',
    //     '"dt.settings.scope_name"',
    //     '"dt.settings.scope_id"',
    // ]);

    // const handleColumnOrderChange = (order) => {
    //     console.log(order);
    //     setColumnOrder(order);
    //   };

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
        setAuditLogs(oldestLogs);
        setSelectedFilters([]);
        setLogCount(oldestLogs.length.toString());
        setSelectedSchemas([]);
        return;
    }

    const handleEventTypeClick = (e) => {
        e.preventDefault();

        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(oldestLogs);
            setSelectedFilters([]);
            setLogCount(oldestLogs.length.toString());
            return;
        }
        const filteredLogs = oldestLogs?.filter(log => log.eventType.toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('Event Type')
        setLogCount(filteredLogs.length.toString());

    }

    const handleCategoryClick = (e) => {
        e.preventDefault();

        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(oldestLogs);
            setSelectedFilters([]);
            setLogCount(oldestLogs.length.toString());
            return;
        }
        const filteredLogs = oldestLogs?.filter(log => log.category.toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('Category')
        setLogCount(filteredLogs.length.toString());
    }

    const handleUserTypeClick = (e) => {
        e.preventDefault();


        if (e.target.innerText == "ALL") {
            setSelectedFilterType('')
            setAuditLogs(oldestLogs);
            setSelectedFilters([]);
            setLogCount(oldestLogs.length.toString());
            return;
        }
        const filteredLogs = oldestLogs?.filter(log => log.userType.toLowerCase() === e.target.innerText.replace(/\s+/g, '_').toLowerCase());
        setAuditLogs(filteredLogs);
        setSelectedFilters([e.target.innerText]);
        setSelectedFilterType('User Type')
        setLogCount(filteredLogs.length.toString());

    }

    const handleSelectSchema = (e) => {
        setSelectedSchemas(e);

        if (e.length == 0 || e.length == schemaIds.length) {
            setSelectedFilterType('')
            setAuditLogs(oldestLogs);
            setSelectedFilters([]);
            setLogCount(oldestLogs.length.toString());
            return;
        }

        const filteredLogs = oldestLogs?.filter(log => e.includes(log["dt.settings.schema_id"]));
        setAuditLogs(filteredLogs);
        setSelectedFilters(e);
        setSelectedFilterType('Schema Id');
        setLogCount(filteredLogs.length.toString());
        setSelectedSchemas(e);

    }

    const getAuditLogs = async () => {
        setLoading(true);
        const apiAuditLogs = await functions.call('get-old-audit-logs').then(response => response.json());

        setAuditLogs(apiAuditLogs.auditLogs);
        setOldestLogs(apiAuditLogs.auditLogs);
        setLogCount(apiAuditLogs.totalCount);
        setLoading(false);

        const userTypes = apiAuditLogs.auditLogs.map(log => log.userType);
        const uniqueUserTypes = new Set(userTypes);
        const uniqueTypesArray = [...uniqueUserTypes];
        setUserTypes(uniqueTypesArray);

        const schemaIdss = apiAuditLogs.auditLogs.map(log => log["dt.settings.schema_id"]);
        const uniqueSchema = new Set(schemaIdss);
        const schemaArray = [...uniqueSchema];
        setschemaIds(schemaArray);
    }

    useEffect(() => {
        getAuditLogs();
    }, [])


    return (
        <Page style={{ height: 'unset', maxHeight: 'unset' }}>
            <Page.Sidebar resizable={true} preferredWidth={300}>
                <Flex flexDirection='column'>
                    <EventTypeFilters handleEventTypeClick={handleEventTypeClick} />
                    <CategoryFilters handleCategoryClick={handleCategoryClick} handleUserTypeClick={handleUserTypeClick} userTypes={userTypes} />
                    <UserTypeFilters handleUserTypeClick={handleUserTypeClick} userTypes={userTypes} />
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
                    </TitleBar>
                </Flex>
                {<DataTable
                    loading={loading}
                    data={filteredData || []}
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
                                            const filteredLogs = oldestLogs?.filter(log => log.eventType.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
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
                                            const filteredLogs = oldestLogs?.filter(log => log.category.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
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
                                            const filteredLogs = oldestLogs?.filter(log => log.userType.toLowerCase() === cell.value.replace(/\s+/g, '_').toLowerCase());
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
                                            const filteredLogs = oldestLogs?.filter(log => log["dt.settings.schema_id"] === cell.value);
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
            {<Sheet
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
                    <DataTable
                        loading={loading}
                        data={selectedLogs || []}
                        columns={columns}
                        columnVisibility={columnVisibility2}
                        variant={tableVariant}
                        enableDefaultSort={true}
                        resizable
                        sortable
                        onSortChange={onSortChange}
                        onColumnVisibilityChange={onColumnVisibilityChange2}
                        key={"sheetTable"}
                    >
                        <DataTable.UserActions>
                            <DataTable.CellActions>
                                {({ cell }) => (
                                    <TableUserActions>
                                        <TableUserActions.CopyItem value={`${cell.value}`} />
                                    </TableUserActions>
                                )}
                            </DataTable.CellActions>
                            <DataTable.ColumnActions>
                                {() => (
                                    <TableUserActions>
                                        <TableUserActions.HideColumn />
                                        <TableUserActions.LineWrap />
                                    </TableUserActions>
                                )}
                            </DataTable.ColumnActions>
                        </DataTable.UserActions>
                        <DataTable.TableActions>

                            {/* Custom Action - Clear Filters */}
                            <Button color={'neutral'} width={'content'} onClick={() => setShowSheet(false)}>
                                <Button.Prefix>
                                    <FolderOpenIcon />
                                </Button.Prefix>
                                Close Detailed View
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
                        </DataTable.Toolbar>
                        <DataTable.Pagination defaultPageSize={20} />

                    </DataTable>
                    {/* <Grid gridTemplateColumns='1fr 1fr 1fr 1fr' width='100%'>
                        {selectedLogs.map((log, index) => <Grid key={index} gridItem><IndividualLog key={index} log={log} /></Grid>)}
                    </Grid> */}
                    <Flex flexDirection='column'>
                        <Grid gridTemplateColumns='1fr' width='100%'>
                            {selectedLogs.map((log, index) => <Grid key={index} gridItem><IndividualLog key={index} log={log} /></Grid>)}
                        </Grid>
                    </Flex>
                </Flex>


            </Sheet>}
        </Page>
    );
}