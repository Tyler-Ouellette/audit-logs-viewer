import React from "react";
import {  Button, Flex, Surface } from "@dynatrace/strato-components-preview";
import { AccountIcon, BugReportIcon, CodeIcon, ContainerIcon, DesktopIcon, GroupIcon, HashtagIcon, LockIcon, ManualIcon, OneAgentSignetIcon, ResetIcon } from "@dynatrace/strato-icons";

export const CategoryFilters = ({userTypes, handleCategoryClick, handleUserTypeClick}) => {

    return (
        <Flex flexDirection='column'>
            <h3 style={{ margin: 5 }}>Category Filters</h3>
            <Surface padding={16}>
                <Flex flexDirection='column' gap={2}>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ResetIcon />
                        <Button onClick={handleCategoryClick}>ALL</Button>
                    </Flex>

                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ContainerIcon />
                        <Button onClick={handleCategoryClick}>ACTIVE_GATE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <OneAgentSignetIcon />
                        <Button onClick={handleCategoryClick}>AGENT</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <CodeIcon />
                        <Button onClick={handleCategoryClick}>CONFIG</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <BugReportIcon />
                        <Button onClick={handleCategoryClick}>DEBUG_UI</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ManualIcon />
                        <Button onClick={handleCategoryClick}>MANUAL_TAGGING_SERVICE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <LockIcon />
                        <Button onClick={handleCategoryClick}>TOKEN</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <DesktopIcon />
                        <Button onClick={handleCategoryClick}>WEB_UI</Button>
                    </Flex>
                </Flex>
            </Surface>
        </Flex>
    );
};