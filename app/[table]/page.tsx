import getSuppliers from "../../serverFun/suppliers";
import { Container, Modal, SimpleGrid } from "@mantine/core";
import ViewTable from "../../components/daynamicTable";
import { getProducts } from "../../serverFun/products";
import { getDeployment, getDeploymentDetailed } from "../../serverFun/deployments";


export async function generateStaticParams() {
  return [{ table: 'suppliers' }, { table: 'products' }, { table: 'deployments' }]
}

export default async function TablesPage({ params }: { params: { table: string } }) {


  let data = []

  let keysArray = []

  switch (params.table) {
    case 'suppliers':
      const res = await getSuppliers()
      data = res.data
      keysArray = res.keysArray
      break;
    case 'products':
      const res2 = await getProducts()
      data = res2.data
      keysArray = res2.keysArray
      break;
    case 'deployments':
      const res3 = await getDeployment()
      data = res3.data
      keysArray = res3.keysArray
      break;
    default:
      const res4 = await getSuppliers()
      data = res4.data
      keysArray = res4.keysArray
      break;
  }


  return (<div>
    <Container size={'xl'} pt={10} pb={50}>
      <SimpleGrid >
        <ViewTable rows={data} columns={keysArray} />
      </SimpleGrid>
    </Container>

  </div>);

}
