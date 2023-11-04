'use client'
import { Chip, ChipGroup, Flex, Select, SimpleGrid } from '@mantine/core'
import React, { useCallback, useEffect, useState } from 'react'
import { FunctionMapKeys } from '../../app/query/page'
import GetExamplesAction from '../../serverFun/Examples'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { InputWithButton } from '../InputWithButton'


type Example = {
    id: string;
    label: string;
    description: string;
    code: string;
    funName: FunctionMapKeys;
    hasParams: string;
}
type Props = {
    // setFunName: React.Dispatch<React.SetStateAction<FunctionMapKeys | undefined>>
    setExample: React.Dispatch<Example | undefined>
    param: string;
    setParam: React.Dispatch<React.SetStateAction<string>>
    example: Example | undefined
}



export default function SelectQuery({ param, setParam, example, setExample }: Props) {



    const [examples, setExamples] = useState<Example[]>()

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()!

    const [selectedQuery, setSelectedQuery] = useState(searchParams.get('example'))



    useEffect(() => {

        const getExamples = async () => {
            const { data }: {
                data: Example[]
            } = await GetExamplesAction()
            setExamples(data)
        }
        getExamples()


        setSelectedQuery(searchParams.get('example') || '')
        setParam(searchParams.get('param') || '')


    }, [])

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )


    let ex = examples?.find((example) => { return example.funName === searchParams.get('example') })
    if (ex) {
        setExample(ex)
        // router.push(pathname + '?' + createQueryString('example', ex.funName))
    }


    const handleChangeExample = (value: string) => {

        let ex = examples?.find((example) => { return example.funName === value })
        if (ex) {
            setExample(ex)
            setSelectedQuery(ex.funName)
            router.push(pathname + '?' + createQueryString('example', ex.funName))
        }
    }


    const handleChangeParam = (value: string) => {

        setParam(value)
        router.push(pathname + '?' + createQueryString('param', value))
    }




    const items = examples?.map((item: any) => {

        return { value: item.funName, label: item.label }

    })

    return (<div>
        <Flex align={'end'} gap={'xl'} >
            <Select
                w={'35%'}
                onChange={(value) => handleChangeExample(value!)}
                label="Select a Query"
                placeholder="Pick one"
                value={selectedQuery}
                required
                data={items}
                // searchable
                nothingFoundMessage="Nothing found..."
            />

            <InputWithButton
                value={param}
                onChange={(event) => handleChangeParam(event.currentTarget.value)}
                disabled={example?.hasParams === "false" || !selectedQuery}
            />

        </Flex>
    </div>
    )
}
