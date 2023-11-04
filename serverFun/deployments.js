// pages/api/suppliers.js
"use server";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import connection from "./connection";



export async function getDeployment() {


  const xml = await connection(`
  xquery version "3.1";
  doc("/db/JSAPP/db.xml")//Deployments
  `)
  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Deployment", doc);


  const data = nodes?.map((node) => (
    {
      DeploymentID: (xpath.select1("DeploymentID/text()", node))?.nodeValue,
      ProductID: (xpath.select1("ProductID/text()", node))?.nodeValue,
      SupplierID: (xpath.select1("SupplierID/text()", node))
        ?.nodeValue,
      DeploymentDate: (xpath.select1("DeploymentDate/text()", node))
        ?.nodeValue,
      Location: (xpath.select1("Location/text()", node))
        ?.nodeValue,
      Quantity: (xpath.select1("Quantity/text()", node))
        ?.nodeValue,
    }
  ));

  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));

  // const {data , keysArray } =  await createQuery(`xquery version "3.1";
  // doc("/db/JSAPP/db.xml")//Deployments`)



  return { data, keysArray };
}

export async function getDeploymentDetailed() {

  const xquery = `
  let $root := doc("/db/JSAPP/db.xml")/root

  let $result :=
    for $deployment in $root/Deployments/Deployment
    let $product-id := $deployment/ProductID
    let $supplier-id := $deployment/SupplierID
    let $product := $root/Products/Product[ProductID = $product-id]
    let $supplier := $root/Suppliers/Supplier[SupplierID = $supplier-id]
    return
      <DeploymentDetailed>
        {$deployment/DeploymentID}
        {$product/ProductName}
        {$supplier/SupplierName}
        {$deployment/DeploymentDate}
        {$deployment/Location}
        {$deployment/Quantity}
      </DeploymentDetailed>
  
  return
    <DeploymentDetaileds>{$result}</DeploymentDetaileds>
    `

  const xml = await connection(xquery)


  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//DeploymentDetailed", doc);


  const data = nodes?.map((node) => (
    {
      id: (xpath.select1("DeploymentID/text()", node))?.nodeValue,
      ProductName: (xpath.select1("ProductName/text()", node))?.nodeValue,
      SupplierName: (xpath.select1("SupplierName/text()", node))
        ?.nodeValue,
      deploymentDate: (xpath.select1("DeploymentDate/text()", node))
        ?.nodeValue,
      location: (xpath.select1("Location/text()", node))
        ?.nodeValue,
      quantity: (xpath.select1("Quantity/text()", node))
        ?.nodeValue,
    }
  ));

  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };




}

export async function getDeploymentByProductID(ProductID) {


  const XQuery = `xquery version "3.1";
  let $productId := "${ProductID}"
  let $result := for $deployment in //Deployment[ProductID = $productId]
  return $deployment
  return <Deployments>{$result}</Deployments>
  `

  const xml = await connection(XQuery)



  const doc = new DOMParser().parseFromString(xml);


  let nodes = []

  try {
    nodes = xpath.select("//Deployment", doc);
  } catch (e) {

    return { data: [], keysArray: [] };
  }


  const data = nodes?.map((node) => (
    {
      id: (xpath.select1("DeploymentID/text()", node))?.nodeValue,
      ProductID: (xpath.select1("ProductID/text()", node))?.nodeValue,
      SupplierID: (xpath.select1("SupplierID/text()", node))?.nodeValue,
      DeploymentDate: (xpath.select1("DeploymentDate/text()", node))
        ?.nodeValue,
      Location: (xpath.select1("Location/text()", node))
        ?.nodeValue,
      Quantity: (xpath.select1("Quantity/text()", node))
        ?.nodeValue,
    }
  ));

  let keysArray = []
  if (data.length > 0)
    keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };
}



export async function getSumQuantityDelivered(ProductID) {

  const xQuery = `xquery version "3.1";
  let $productId := "${ProductID}"
  let $result := 
  let $deployments := //Deployment[ProductID = $productId]
  let $product := //Product[ProductID = $productId]
  return <Deployment>
            <Quantity>
                {sum($deployments/Quantity)}
            </Quantity>
            {$product/ProductName}
        </Deployment>
return <Deployments>{$result}</Deployments>
  `


  const xml = await connection(xQuery)

  const doc = new DOMParser().parseFromString(xml);


  let nodes = []

  try {
    nodes = xpath.select("//Deployment", doc);
  } catch (e) {

    return { data: [], keysArray: [] };
  }


  const data = nodes?.map((node) => (
    {
      ProductName: (xpath.select1("ProductName/text()", node))?.nodeValue,
      Quantity: (xpath.select1("Quantity/text()", node))?.nodeValue,
    }
  ));

  let keysArray = []
  if (data.length > 0)
    keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };

}


export async function getDeploymentByLocation(searchParam) {

  const xQuery = `
  xquery version "3.1";
  let $searchTerm := "${searchParam}"
  let $result := 
  for $deployment in //Deployment
  where fn:contains($deployment/Location, $searchTerm)
  return $deployment
  return  <Deployments>{$result}</Deployments>
  `


  const xml = await connection(xQuery)



  const doc = new DOMParser().parseFromString(xml);


  let nodes = []

  try {
    nodes = xpath.select("//Deployment", doc);
  } catch (e) {

    return { data: [], keysArray: [] };
  }


  const data = nodes?.map((node) => (
    {
      id: (xpath.select1("DeploymentID/text()", node))?.nodeValue,
      ProductID: (xpath.select1("ProductID/text()", node))?.nodeValue,
      SupplierID: (xpath.select1("SupplierID/text()", node))?.nodeValue,
      DeploymentDate: (xpath.select1("DeploymentDate/text()", node))
        ?.nodeValue,
      Location: (xpath.select1("Location/text()", node))
        ?.nodeValue,
      Quantity: (xpath.select1("Quantity/text()", node))
        ?.nodeValue,
    }
  ));

  let keysArray = []
  if (data.length > 0)
    keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };



} 