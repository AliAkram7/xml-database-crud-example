'use client'
import { useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import classes from './deploymentTable.module.css';

export interface deploymentRowData {
  id: string;
  supplierID: string;
  productID: string
  deploymentDate: String;
  location: String;
  quantity: string;
}



interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: deploymentRowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: deploymentRowData[],
  payload: { sortBy: keyof deploymentRowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(String(a[sortBy]));
      }

      return a[sortBy].localeCompare(String(b[sortBy]));
    }),
    payload.search
  );
}


export function DeploymentsTableSort({ data }: { data: deploymentRowData[] }) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof deploymentRowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof deploymentRowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id + row.supplierID}>
      <Table.Td>{row.supplierID}</Table.Td>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.productID}</Table.Td>
      <Table.Td>{row.deploymentDate}</Table.Td>
      
      <Table.Td>{row.quantity}</Table.Td>
      <Table.Td>{row.location}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      {/* <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      /> */}
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('id')}
            >
              ID
            </Th>
            <Th
              sorted={sortBy === 'productID'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('productID')}
            >
              ProductID
            </Th>
            <Th
              sorted={sortBy === 'supplierID'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('supplierID')}
            >
              supplierID
            </Th>
            <Th
              sorted={sortBy === 'deploymentDate'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('deploymentDate')}
            >
              Deployment Date
            </Th>
            <Th
              sorted={sortBy === 'quantity'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('quantity')}
            >
              Quantity
            </Th>
            <Th
              sorted={sortBy === 'location'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('location')}
            >
              Location
            </Th>

          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0]).length}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}