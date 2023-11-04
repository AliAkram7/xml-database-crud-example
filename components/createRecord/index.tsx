'use client'
import { isNotEmpty, useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    Select,
    ComboboxData,
    ScrollArea,
    NumberInput,
    LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import {addRecord} from '../../serverFun/CDRecord'
import { useDisclosure } from '@mantine/hooks';

type Inputs = {
    name: string
    label: string
    value: string
}[]

type listIds = {
    value: string;
    label: string;
}


type Props = {

    inputs: Inputs;
    productsList?: ComboboxData;
    suppliersList?: ComboboxData
    recordTable: string
    recordRow: string
    closeModal: () => void,
}


type InitialValue = { [key: string]: string };
type validator = { [key: string]: (value: unknown) => string | number | true | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null };







export function CreateRecordForm({ inputs, productsList, suppliersList, recordRow, recordTable, closeModal }: Props) {


    const initialValues: InitialValue = inputs.reduce((acc: InitialValue, input) => {
        acc[input.name] = input.value;
        return acc;
    }, {});
    const validator: validator = inputs.reduce((acc: validator, input) => {
        acc[input.name] = isNotEmpty(`${input.label} can not be empty`);
        return acc;
    }, {});
    const form = useForm({
        initialValues: initialValues,
        validate: validator
    })


    const [visibleLoading, { open, close }] = useDisclosure()



    const handleSubmit = async () => {

        let payload = {...form.values}
        open()

        if (payload.DeploymentDate) {
            let d = new Date(payload.DeploymentDate)
            payload.DeploymentDate = d.toDateString()
        }

        await addRecord(recordTable, recordRow, payload)
        close()
        closeModal()
    }

    const fields = inputs.map(key => {
        if (key.name === 'ProductID')
            return (productsList ?
                <Select
                    key={key.name}
                    // required
                    allowDeselect={false}
                    data={productsList}
                    label="Product"
                    placeholder="Pick value"
                    {...form.getInputProps(key.name)}
                /> :
                <Select required error={true} color='red' label="Product" placeholder="not found" />)

        if (key.name === 'SupplierID') {
            return (suppliersList ?
                <Select
                    key={key.name}
                    // required
                    allowDeselect={false}
                    data={suppliersList}
                    label="Supplier"
                    placeholder="Pick value"
                    {...form.getInputProps(key.name)}
                /> :
                <Select required error={true} color='red' label="Supplier" placeholder="not found" />)
        }
        if (key.name === 'DeploymentDate') {
            return (suppliersList ?
                <DateInput
                    // required
                    valueFormat="DD MMM YYYY"
                    key={key.name}
                    label="Date input"
                    placeholder="Date input"
                    {...form.getInputProps(key.name)}
                />
                :
                <Select required error={true} color='red' label="Supplier" placeholder="not found" />)
        }
        if (key.name === 'Quantity') {
            return (suppliersList ?
                <NumberInput
                    // required
                    key={key.name}
                    label="Quantity"
                    placeholder="Quantity"
                    {...form.getInputProps(key.name)}
                />
                :
                <Select required error={true} color='red' label="Supplier" placeholder="not found" />)
        }

        return (
            <TextInput
                // required
                key={key.name}
                label={key.label}
                radius="md"
                {...form.getInputProps(key.name)}
            />
        )


    })


    return (
        <Paper radius="md" p="xl" withBorder >
            <LoadingOverlay
                visible={visibleLoading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />
            <Text size="lg" fw={900}>
                create new {recordTable}
            </Text>
            <Divider label="fill all this fields" labelPosition="center" my="sm" />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    {fields}
                </Stack>
                <Group justify="space-between" mt="xl">
                    <Button type="submit" radius="xl">
                        create
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}