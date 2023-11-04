// pages/api/suppliers.js
"use server";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import connection from "./connection";

export default async function getSuppliers() {

  // const xml = fs.readFileSync(path.resolve("database/DB.xml"), "utf8");

  const xml = await connection(`
  xquery version "3.1";
  doc("/db/JSAPP/db.xml")//Suppliers`)
  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Supplier", doc);

  const data = nodes.map((node) => {
    const rowData = {};

    // Extract column names dynamically from the XML.
    const columnNames = Array.from(node.childNodes)
      .filter((child) => child.nodeType === 1) // Select only element nodes.
      .map((child) => child.nodeName);

    // Loop through the extracted column names and extract data.
    columnNames.forEach((columnName) => {
      const value = (xpath.select1(`${columnName}/text()`, node))?.nodeValue;
      rowData[columnName] = value;
    });

    return rowData;
  });


  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };
}



export async function getSupplierIdAndNames() {


  const xQuery = `
    xquery version "3.1";

    let $uri := "/db/JSAPP/db.xml"
    let $doc := doc($uri)
    let $result := for $supplier in $doc//Supplier
    return  <Supplier>{$supplier/SupplierID, $supplier/SupplierName}</Supplier>
    return <Suppliers>{$result}</Suppliers>
    `

  const xml = await connection(xQuery)

  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Supplier", doc);

  const data = nodes?.map((node) => (
    {
      value: (xpath.select1("SupplierID/text()", node))?.nodeValue,
      label: (xpath.select1("SupplierName/text()", node))?.nodeValue,
    }
  ));


  return data;


}

