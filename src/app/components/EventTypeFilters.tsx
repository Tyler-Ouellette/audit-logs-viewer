import React from "react";
import { Button, Flex, Surface } from "@dynatrace/strato-components-preview";
import { BlockIcon, CodeOffIcon, ConnectorIcon, DeleteIcon, EditIcon, LoginIcon, LogoutIcon, PlusIcon, ResetIcon } from '@dynatrace/strato-icons';

export const EventTypeFilters = ({handleEventTypeClick}) => {

    return (
        <Flex flexDirection='column'>
            <h3 style={{ margin: 5 }}>Event Type Filters</h3>
            <Surface padding={16}>
                <Flex flexDirection='column' gap={2}>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ResetIcon />
                        <Button onClick={handleEventTypeClick}>ALL</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <PlusIcon />
                        <Button onClick={handleEventTypeClick}>CREATE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <DeleteIcon />
                        <Button onClick={handleEventTypeClick}>DELETE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <LoginIcon />
                        <Button onClick={handleEventTypeClick}>LOGIN</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <LogoutIcon />
                        <Button onClick={handleEventTypeClick}>LOGOUT</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ConnectorIcon />
                        <Button onClick={handleEventTypeClick}>REMOTE_CONFIGURATION_MANAGEMENT</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <BlockIcon />
                        <Button onClick={handleEventTypeClick}>REVOKE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <PlusIcon />
                        <Button onClick={handleEventTypeClick}>TAG_ADD</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <DeleteIcon />
                        <Button onClick={handleEventTypeClick}>TAG_REMOVE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <EditIcon />
                        <Button onClick={handleEventTypeClick}>TAG_UPDATE</Button>
                    </Flex>
                    {/* <Flex justifyContent='flex-start' alignItems='center'>
                        <CodeOffIcon />
                        <Button onClick={handleEventTypeClick}>NO_CHANGE</Button>
                    </Flex> */}
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <EditIcon />
                        <Button onClick={handleEventTypeClick}>UPDATE</Button>
                    </Flex>
                </Flex>
            </Surface>
        </Flex>
    );
};