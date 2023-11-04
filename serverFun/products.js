// pages/api/suppliers.js
"use server";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import connection, { connectionExecute } from "./connection";

export async function getProducts() {
  // const xml = fs.readFileSync(path.resolve("database/DB.xml"), "utf8");


  const xml = await connection(`
  xquery version "3.1";
  doc("/db/JSAPP/db.xml")//Products`)

  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Product", doc);

  const data = nodes?.map((node) => (
    {
      ProductID: (xpath.select1("ProductID/text()", node))?.nodeValue,
      ProductName: (xpath.select1("ProductName/text()", node))?.nodeValue,
      Description: (xpath.select1("Description/text()", node))
        ?.nodeValue,
      Price: (xpath.select1("Price/text()", node))
        ?.nodeValue,

    }
  ));


  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));



  return { data, keysArray };
}

export async function getProductsPrices() {

  const xQuery = `
  xquery version "3.1";
  let $result := for $product in //Product 
  return  <Product>{$product/ProductName, $product/Price}</Product>
  return <Products>{$result}</Products>
  `

  const xml = await connection(xQuery)

  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Product", doc);

  const data = nodes?.map((node) => (
    {
      ProductName: (xpath.select1("ProductName/text()", node))?.nodeValue,
      Price: (xpath.select1("Price/text()", node))?.nodeValue,
    }
  ));


  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));



  return { data, keysArray };

}


export async function getProductIdsAndNames() {

  const xQuery = `
  xquery version "3.1";
  
  let $uri := "/db/JSAPP/db.xml"
  let $doc := doc($uri)
    let $result := for $product in $doc//Product
  return  <Product>{$product/ProductID, $product/ProductName}</Product>
  return <Products>{$result}</Products>
  `

  const xml = await connection(xQuery)

  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Product", doc);

  const data = nodes?.map((node) => (
    {
      value: (xpath.select1("ProductID/text()", node))?.nodeValue,
      label: (xpath.select1("ProductName/text()", node))?.nodeValue,
    }
  ));


  return data;

}



export async function insertProduct() {

  const Product = {
    ProductID: 6,
    ProductName: 8,
    Description: 'Product Description Example',
    Price: 120.0
  };

  const deploymentXml = createXml('Product', Product)



  // XQuery update expression to insert the new 'Deployment' node
  const xquery = `
  xquery version "3.1";
  declare namespace xmldb="http://exist-db.org/xquery/xmldb";
  let $uri := '/db/JSAPP/db.xml'
  let $doc := doc($uri)
  let $newDeployment := "${deploymentXml}"
  return update insert $newDeployment into $doc//Products
`;


  connectionExecute(xquery)


}

function createXml(rowName, obj) {
  let xml = `<${rowName}>\n`;
  for (let key in obj) {
    xml += `  <${key}>${obj[key]}</${key}>\n`;
  }
  xml += `</${rowName}>`;
  return xml;
}



