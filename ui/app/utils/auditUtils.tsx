import React from 'react';
import { DataTable } from '@dynatrace/strato-components-preview/tables';
import type { DataTableColumnDef } from '@dynatrace/strato-components-preview/tables';
import type { UserInfo } from '../hooks/useUserMap';

/**
 * Masks a token by showing the first 6 and last 4 characters.
 * Tokens of 12 characters or fewer are returned as-is.
 */
export function maskToken(v: string | undefined): string | undefined {
    if (!v || v.length <= 12) return v;
    return `${v.slice(0, 6)}...${v.slice(-4)}`;
}

/**
 * Takes a column group definition array and injects "User Full Name" and "Email" columns
 * immediately after any column with id '"user.id"', using the provided userMap for lookups.
 */
export function injectUserColumns(
    baseColumns: DataTableColumnDef<any>[],
    userMap: Map<string, UserInfo>
): DataTableColumnDef<any>[] {
    return baseColumns.map((group: any) => {
        if (!group.columns) return group;
        const userIdIdx = group.columns.findIndex((c: any) => c.id === '"user.id"');
        if (userIdIdx === -1) return group;

        const userFullNameCol: DataTableColumnDef<any> = {
            header: 'User Full Name',
            id: 'user.fullname',
            accessor: '["user.id"]',
            minWidth: 150,
            width: { type: 'auto', maxWidth: 300 },
            cell: ({ value }) => {
                const user = userMap.get(value as string);
                const name = user ? [user.name, user.surname].filter(Boolean).join(' ') : '';
                return <DataTable.DefaultCell>{name}</DataTable.DefaultCell>;
            },
        };

        const userEmailCol: DataTableColumnDef<any> = {
            header: 'Email',
            id: 'user.email',
            accessor: '["user.id"]',
            minWidth: 150,
            width: { type: 'auto', maxWidth: 300 },
            cell: ({ value }) => {
                const user = userMap.get(value as string);
                return <DataTable.DefaultCell>{user?.email ?? ''}</DataTable.DefaultCell>;
            },
        };

        const newCols = [...group.columns];
        newCols.splice(userIdIdx + 1, 0, userFullNameCol, userEmailCol);
        return { ...group, columns: newCols };
    });
}
