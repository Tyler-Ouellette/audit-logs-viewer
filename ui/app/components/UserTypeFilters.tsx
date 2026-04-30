import React from "react";
import { Button, Flex, Surface } from "@dynatrace/strato-components-preview";
import { AccountIcon, GroupIcon, HashtagIcon, LockIcon, ResetIcon } from '@dynatrace/strato-icons';

export const UserTypeFilters = ({ userTypes, handleUserTypeClick }: { userTypes: string[]; handleUserTypeClick: (type: string) => void }) => {
    let icon;
    return (
        <Flex flexDirection='column'>
            <h3 style={{ margin: 5 }}>User Types</h3>
            <Surface padding={16}>
                <Flex flexDirection='column' gap={2}>
                    <Flex key={'allUserType'} justifyContent='flex-start' alignItems='center'>
                        <ResetIcon />
                        <Button key={'allUserType'} onClick={() => handleUserTypeClick('ALL')}>ALL</Button>
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
                                <Button key={index} onClick={() => handleUserTypeClick(type)}>{type}</Button>
                            </Flex>
                        )
                    })}
                </Flex>
            </Surface>
        </Flex>
    );
};