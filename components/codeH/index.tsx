'use client'
import { Alert, Box, Center, Flex, SegmentedControl, SimpleGrid, Skeleton, Tabs, TabsPanel, rem } from '@mantine/core'
import { IconCode, IconEye } from '@tabler/icons-react';
import { IconInfoCircle } from '@tabler/icons-react';
import React, { useState } from 'react'
import ViewTable from '../daynamicTable';
import { CodeHighlight } from '@mantine/code-highlight';


type Props = {
    tsxcode?: string;
    description?: string;
    rows: []
    columns: {key : string  , label : string }[]
}


export function CodePreview({description, tsxcode , rows , columns} : Props) {
    const [value, setValue] = useState("preview");



    return (

        <SimpleGrid cols={1} spacing={30}>
            <Alert variant="light" color="blue" title="Description" icon={<IconInfoCircle />}>
                {description || "Select Query" }
            </Alert>

            <Skeleton visible={!columns}>
            <Flex align={"center"} gap={"sm"}>
                <SegmentedControl
                    value={value}
                    onChange={setValue}
                    data={[
                        {
                            value: "preview",
                            label: (
                                <Center>
                                    <IconEye style={{ width: rem(16), height: rem(16) }} />
                                    <Box ml={10}>Preview</Box>
                                </Center>
                            ),
                        },
                        {
                            value: "code",
                            label: (
                                <Center>
                                    <IconCode style={{ width: rem(16), height: rem(16) }} />
                                    <Box ml={10}>Code</Box>
                                </Center>
                            ),
                        },
                    ]}
                />
            </Flex>
            <Tabs value={value} defaultValue="preview" orientation="horizontal">
                <TabsPanel value="preview">
                    <ViewTable rows={rows} columns={columns} />
                </TabsPanel>
                <TabsPanel value="code">
                    <CodeHighlight
                        highlightOnClient
                        code={tsxcode ? tsxcode : 'no code provided'}
                        language="tsx"
                        withCopyButton={false}
                    />
                </TabsPanel>
            </Tabs>
            </Skeleton>


        </SimpleGrid>
    )
}
