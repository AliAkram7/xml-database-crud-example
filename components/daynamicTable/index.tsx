'use client'
import React from "react";
import { getKeyValue } from "@nextui-org/react";
import { ActionIcon, Alert, LoadingOverlay, Menu, Modal, Table, rem } from "@mantine/core";
import { nanoid } from "nanoid";
import { IconAlertCircle, IconAlertTriangleFilled, IconChevronDown, IconDotsVertical, IconTrash } from "@tabler/icons-react";

import { deleteRecord } from "../../serverFun/CDRecord";
import { useDisclosure } from "@mantine/hooks";

type Props = {
    rows: { key: string }[]
    columns: {
        key: string
        label: string
    }[]
}









export default function ViewTable({ rows, columns }: Props) {

    const [visibleLoading, { open, close }] = useDisclosure()

    const handleDelete = async (recordName: string, recordID: string) => {

        open()
        let recordTable = recordName?.replace('ID', 's')
        let recordRow = recordName?.replace('ID', '')


        await deleteRecord(recordTable, recordRow, recordID)

        close()

    }


    return (
        rows?.length > 0 ? (
            <>
                <LoadingOverlay
                    visible={visibleLoading}
                    zIndex={1000}
                    style={{position: 'fixed' , top: 0, left: 0 , bottom: 0, right: 0}}
                    overlayProps={{ radius: 'sm', blur: 2 }}
                    loaderProps={{ color: 'blue', type: 'bars' }}
                />
                <Table >

                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th key={nanoid()}></Table.Th>
                            {columns?.map((column) =>
                                <Table.Th key={nanoid()}>{column.label}</Table.Th>
                            )}
                        </Table.Tr>

                    </Table.Thead>
                    <Table.Tbody>

                        {
                            rows?.map((row) =>
                                <Table.Tr key={nanoid()}>
                                    <Table.Td
                                        key={nanoid()}
                                    >
                                        <Menu key={nanoid()} transitionProps={{ transition: 'pop' }} position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon
                                                    variant="transparent"
                                                    size={36}

                                                >
                                                    <IconChevronDown style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    leftSection={
                                                        <IconTrash
                                                            style={{ width: rem(16), height: rem(16) }}
                                                            stroke={1.5}
                                                        />
                                                    }
                                                    onClick={() => (handleDelete(columns[0].key, getKeyValue(row, columns[0].key)))}
                                                >
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu></Table.Td>
                                    {
                                        columns?.map(column =>
                                            <>
                                                <Table.Td key={nanoid()}>{getKeyValue(row, column.key)}</Table.Td>
                                            </>
                                        )
                                    }
                                </Table.Tr>
                            )


                        }
                    </Table.Tbody>
                </Table>
            </>
        ) : <Alert variant="light" color="yellow" title="Alert" icon={<IconAlertTriangleFilled />}>
            nothing found
        </Alert>
    );
}