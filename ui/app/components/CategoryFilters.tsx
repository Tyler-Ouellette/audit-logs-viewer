import React from "react";
import { Button, Flex, Surface } from "@dynatrace/strato-components-preview";
import { BugReportIcon, CodeIcon, ContainerIcon, DesktopIcon, LockIcon, ManualIcon, OneAgentSignetIcon, ResetIcon } from "@dynatrace/strato-icons";

export const CategoryFilters = ({ handleCategoryClick }: { handleCategoryClick: (category: string) => void }) => {

    return (
        <Flex flexDirection='column'>
            <h3 style={{ margin: 5 }}>Categories</h3>
            <Surface padding={16}>
                <Flex flexDirection='column' gap={2}>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ResetIcon />
                        <Button onClick={() => handleCategoryClick('ALL')}>ALL</Button>
                    </Flex>

                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ContainerIcon />
                        <Button onClick={() => handleCategoryClick('ACTIVE_GATE')}>ACTIVE_GATE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <OneAgentSignetIcon />
                        <Button onClick={() => handleCategoryClick('AGENT')}>AGENT</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <CodeIcon />
                        <Button onClick={() => handleCategoryClick('CONFIG')}>CONFIG</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <BugReportIcon />
                        <Button onClick={() => handleCategoryClick('DEBUG_UI')}>DEBUG_UI</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <ManualIcon />
                        <Button onClick={() => handleCategoryClick('MANUAL_TAGGING_SERVICE')}>MANUAL_TAGGING_SERVICE</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <LockIcon />
                        <Button onClick={() => handleCategoryClick('TOKEN')}>TOKEN</Button>
                    </Flex>
                    <Flex justifyContent='flex-start' alignItems='center'>
                        <DesktopIcon />
                        <Button onClick={() => handleCategoryClick('WEB_UI')}>WEB_UI</Button>
                    </Flex>
                </Flex>
            </Surface>
        </Flex>
    );
};