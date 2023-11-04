'use client'
import { useEffect, useState } from 'react';
import { Group, Button, Flex, Indicator, Modal } from '@mantine/core';
import {
    IconShoppingCart,
    IconMapShare,
    IconUser,
    IconEye,
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { CreateRecordForm } from '../createRecord';
import { useDisclosure } from '@mantine/hooks';
import { getProductIdsAndNames } from '../../serverFun/products';
import { getSupplierIdAndNames } from '../../serverFun/suppliers';

const data = [
    { link: '/suppliers', label: 'Suppliers', icon: IconUser },
    { link: '/products', label: 'Products', icon: IconShoppingCart },
    { link: '/deployments', label: 'Deployments', icon: IconMapShare },
    { link: '/query', label: 'Query', icon: IconEye },
];

export function NavbarSimple() {

    const router = useRouter()
    const pathname = usePathname()

    const [active, setActive] = useState(() => {
        let search = data.find((item) => item.link === pathname)
        if (search != null) return search
        else return data[0]

    }
    );

    const [opened, { open, close }] = useDisclosure()


    // const [activeIcon, setActiveIcon] = useState(() => {
    //     return data.find((item) => item.link === pathname)
    // });

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active?.label || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                router.push(item.link)
                setActive(item);
                // setActiveIcon(<item.icon />)
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    const SupplierInputs = [
        { name: "SupplierName", label: "Supplier Name", value: "" },
        { name: "ContactName", label: "Contact Name", value: "" },
        { name: "ContactEmail", label: "Contact Email", value: "" },
        { name: "Location", label: "Location", value: "" },
    ];

    const ProductInputs = [
        { name: "ProductName", label: "Product Name", value: "" },
        { name: "Description", label: "Description", value: "" },
        { name: "Price", label: "Price", value: "" },
    ];

    const DeploymentInputs = [
        { name: "ProductID", label: "Product", value: "" },
        { name: "SupplierID", label: "Supplier", value: "" },
        { name: "DeploymentDate", label: "Deployment Date", value: "" },
        { name: "Location", label: "Location", value: "" },
        { name: "Quantity", label: "Quantity", value: "" },
    ];


    const [ProdIDNames, setProdIDNames] = useState()
    const [SuppIdNames, setSuppIdNames] = useState()

    useEffect(() => {

        const getIDS = async () => {
            const prod = await getProductIdsAndNames()
            setProdIDNames(prod)
            const supp = await getSupplierIdAndNames()
            setSuppIdNames(supp)
        }
        getIDS()

    }, [active?.label])

    console.log(ProdIDNames)





    let inputs = active?.label === "Suppliers" ? SupplierInputs : active?.label === "Products" ? ProductInputs : active?.label === "Deployments" ? DeploymentInputs : SupplierInputs

    let recordRow = active?.label === "Suppliers" ? 'Supplier' : active?.label === "Products" ? 'Product' : active?.label === "Deployments" ? 'Deployment' : 'Product'



    const createForm =
        <Modal size={'xl'} opened={opened} onClose={close}>
            <CreateRecordForm closeModal={close} inputs={inputs} productsList={ProdIDNames} recordRow={recordRow} recordTable={active?.label} suppliersList={SuppIdNames} />
        </Modal>
    return (
        <nav className={classes.navbar}>
            {createForm}
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">

                    <Indicator w={'100%'} inline label={'+ create'} size={20}>
                        <Button size={'lg'}
                            w={'100%'}
                            variant='light'
                            onClick={() => {
                                router.refresh()
                                open()
                            }}
                        >
                            <Flex gap={'sm'} align={'center'}>
                                {active && <active.icon />}
                                {active?.label}
                            </Flex>
                        </Button>
                    </Indicator>
                </Group>

                {links}
            </div>


        </nav>
    );
}