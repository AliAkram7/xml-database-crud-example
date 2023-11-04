import getSuppliers from "../serverFun/suppliers";
import { Container } from "@mantine/core";
import ViewTable from "../components/daynamicTable";




export default async function HomePage() {

  // redirect('/suppliers')


  const { data, keysArray } = await getSuppliers()
  // const {data , keysArray} = await getProducts()
  // const { data, keysArray } = await getDeployment()





  


  return (<div>
    <Container size={'lg'} pb={50}>
      <ViewTable rows={data} columns={keysArray} />
    </Container>

  </div>);

}
