import React from "react";
import { Button, Flex, Surface } from "@dynatrace/strato-components-preview";
import { AccountIcon, BlockIcon, BugReportIcon, CodeIcon, ConnectorIcon, ContainerIcon, DeleteIcon, DesktopIcon, EditIcon, FilterIcon, FilterOutIcon, FolderOpenIcon, GroupIcon, HashtagIcon, LockIcon, LoginIcon, LogoutIcon, ManualIcon, OneAgentSignetIcon, PlusIcon, ResetIcon } from '@dynatrace/strato-icons';

export const UserTypeFilters = ({ userTypes, handleUserTypeClick }) => {
    let icon;
    return (
        <Flex flexDirection='column'>
            <h3 style={{ margin: 5 }}>User Type Filters</h3>
            <Surface padding={16}>
                <Flex flexDirection='column' gap={2}>
                    <Flex key={'allUserType'} justifyContent='flex-start' alignItems='center'>
                        <ResetIcon />
                        <Button key={'allUserType'} onClick={handleUserTypeClick}>ALL</Button>
                    </Flex>
                    {userTypes.map((type, index) => {
                        if (type == "USER_NAME") {
                            icon = <AccountIcon />
                        }
                        if (type == "TOKEN_HASH") {
                            icon = <HashtagIcon />
                        }
                        if (type == "PUBLIC_TOKEN_IDENTIFIER") {
                            icon = <LockIcon />
                        }
                        else {
                            icon = <GroupIcon />
                        }
                        return (
                            <Flex key={index} justifyContent='flex-start' alignItems='center'>
                                {icon}
                                <Button key={index} onClick={handleUserTypeClick}>{type}</Button>
                            </Flex>
                        )
                    })}
                </Flex>
            </Surface>
        </Flex>
    );
};