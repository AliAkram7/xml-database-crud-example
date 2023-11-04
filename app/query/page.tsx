'use client'
import { Chip, ChipGroup, Flex, SimpleGrid, Tabs, TabsPanel, Transition, rem } from '@mantine/core'
import React, { useEffect, useState } from 'react'

import { CodePreview } from '../../components/codeH';
import getSuppliers from '../../serverFun/suppliers';
import { getProducts, getProductsPrices } from '../../serverFun/products';
import { getDeployment, getDeploymentDetailed, getDeploymentByProductID, getSumQuantityDelivered, getDeploymentByLocation } from '../../serverFun/deployments';
import SelectQuery from '../../components/selectQuery';
import { useTimeout } from '@mantine/hooks';

export type FunctionMapKeys = 'getSuppliers' | 'getProducts' | 'getDeployment' | 'getDeploymentDetailed' | 'getProductsPrices' | 'getDeploymentByProductID' | 'getSumQuantityDelivered'  |'getDeploymentByLocation';


type Example = {
    id: string;
    label: string;
    description: string;
    code: string;
    funName: FunctionMapKeys;
    hasParams: string;
}


export function ViewsPage() {


    const [example, setExample] = useState<Example | undefined>()
    const [tran, setTran] = useState(true)
    const [param, setParam] = useState('')


    const functionMap = {
        getSuppliers,
        getProducts,
        getDeployment,
        getDeploymentDetailed,
        getProductsPrices,
        getDeploymentByProductID,
        getSumQuantityDelivered,
        getDeploymentByLocation,
        // add other functions here
    };


    const [table, setTable] = useState<{
        data: any;
        keysArray: {
            key: string;
            label: string;
        }[];
    }>()


    const { start, clear } = useTimeout(() => setTran(true), 200)



    useEffect(() => {


        const getData = async () => {

            if (example?.funName && typeof functionMap[example?.funName] === 'function') {

                if (!example.hasParams) {
                    const { data, keysArray } = await functionMap[example?.funName]()
                    setTable({ data, keysArray })
                }
                else {
                    const { data, keysArray } = await functionMap[example?.funName](param)
                    setTable({ data, keysArray })
                }


            }

        }

        setTran(false)

        clear()

        getData()

        start()

    }, [example?.funName, param])



    return (
        <div>
            <Flex direction={'column'} gap='xl'
                justify={'flex-start'} mih={'100vh'}  >
                <SelectQuery setExample={setExample} example={example} param={param} setParam={setParam} />
                <Transition mounted={tran} transition="skew-up" duration={100} timingFunction="ease">
                    {(styles) => <div style={styles}>
                        <CodePreview
                            description={example?.description}
                            tsxcode={example?.code} rows={...table?.data} columns={table?.keysArray!} />
                    </div>}
                </Transition>
            </Flex>
        </div>
    )
}

export default ViewsPage