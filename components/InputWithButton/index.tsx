'use client'
import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';



export function InputWithButton(props: TextInputProps) {

    const theme = useMantineTheme();

    return (
        <TextInput
         

            radius="sm"
            size="sm"
            placeholder="enter a value"
            rightSectionWidth={42}
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
            rightSection={
                <ActionIcon size={22} radius="xl" color={theme.primaryColor} variant="filled">
                    <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
            }
            {...props}
        />
    );
}