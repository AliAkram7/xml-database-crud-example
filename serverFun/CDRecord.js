"use server";
import { connectionExecute } from './connection'
import { revalidatePath } from 'next/cache';
import uuid4 from "uuid4";

export  async function addRecord(recordTable, recordRow, recordBody) {

    const deploymentXml = createXml(recordRow, recordBody)

    // XQuery update expression to insert the new 'Deployment' node
    const xquery = `
      xquery version "3.1";
      declare namespace xmldb="http://exist-db.org/xquery/xmldb";
      let $uri := '/db/JSAPP/db.xml'
      let $doc := doc($uri)
      let $newDeployment := ${deploymentXml}
      return update insert $newDeployment into $doc//${recordTable}
    `;


    console.log({ xquery })

   await  connectionExecute(xquery)

   revalidatePath('/')

}
function createXml(rowName, obj) {

    let xml = `<${rowName}>\n`;

    xml += `<${rowName}ID>${uuid4()}</${rowName}ID>\n`
    for (let key in obj) {
        xml += `  <${key}>${obj[key]}</${key}>\n`;
    }
    xml += `</${rowName}>`;
    return xml;
}



export  async function deleteRecord(recordTable, recordRow, recordID) {


    const xquery = `
      xquery version "3.1";
      declare namespace xmldb="http://exist-db.org/xquery/xmldb";
      let $uri := '/db/JSAPP/db.xml'
      let $doc := doc($uri)
      return update delete $doc//${recordTable}/${recordRow}[${recordRow}ID="${recordID}"]
    `;

    console.log(xquery)

   await  connectionExecute(xquery)

   revalidatePath('/')

}