import { useEffect, useState } from 'react';
import { usersAndGroupsClient } from '@dynatrace-sdk/client-iam';
import { getEnvironmentId } from '@dynatrace-sdk/app-environment';

export type UserInfo = { name?: string; surname?: string; email?: string };

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Fetches IAM user info for all unique user.id UUIDs present in the given audit log rows.
 * Returns a map from UUID to UserInfo.
 */
export function useUserMap(auditLogs: any[]): Map<string, UserInfo> {
    const [userMap, setUserMap] = useState<Map<string, UserInfo>>(new Map());

    useEffect(() => {
        const uuids = [...new Set(
            auditLogs.map((r: any) => r['user.id']).filter((id: any) => id && UUID_REGEX.test(id))
        )] as string[];
        if (uuids.length === 0) return;
        const batches: string[][] = [];
        for (let i = 0; i < uuids.length; i += 25) batches.push(uuids.slice(i, i + 25));
        Promise.all(
            batches.map(batch =>
                usersAndGroupsClient.getActiveUsersForOrganizationalLevel({
                    levelType: 'environment',
                    levelId: getEnvironmentId(),
                    uuid: batch,
                })
            )
        ).then(results => {
            setUserMap(prev => {
                const next = new Map(prev);
                results.forEach(res => res.results?.forEach(user => next.set(user.uid, user)));
                return next;
            });
        }).catch(() => {});
    }, [auditLogs]);

    return userMap;
}

/**
 * Fetches IAM user info for a single user.id UUID.
 * Returns null if the ID is not a valid UUID or if the request fails.
 */
export function useUserInfo(userId: string | undefined): UserInfo | null {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (!userId || !UUID_REGEX.test(userId)) {
            setUserInfo(null);
            return;
        }
        let cancelled = false;
        usersAndGroupsClient.getActiveUsersForOrganizationalLevel({
            levelType: 'environment',
            levelId: getEnvironmentId(),
            uuid: [userId],
        })
            .then((res) => { if (!cancelled) setUserInfo(res.results?.[0] ?? null); })
            .catch(() => { if (!cancelled) setUserInfo(null); });
        return () => { cancelled = true; };
    }, [userId]);

    return userInfo;
}
