// pages/api/suppliers.js
"use server";
import { DOMParser } from "xmldom";
import xpath from "xpath";
import fs from "fs";
import path from "path";
import connection from "./connection";



export default async function GetExamplesAction() {
  // const xml = fs.readFileSync(path.resolve("database/query.xml"), "utf8");


  const xml = await connection(`doc("/db/JSAPP/query.xml")//Examples`)


  const doc = new DOMParser().parseFromString(xml);

  let nodes = xpath.select("//Example", doc);




  const data = nodes?.map((node) => (
    {
      id: (xpath.select1("ID/text()", node))?.nodeValue,
      label: (xpath.select1("Label/text()", node))?.nodeValue,
      description: (xpath.select1("Description/text()", node))
        ?.nodeValue,
      code: extractCodeFromCDATA(node),
      funName: (xpath.select1("funName/text()", node))
        ?.nodeValue,
      hasParams: (xpath.select1("HasParams/text()", node))
      ?.nodeValue
    }
  ));



  const keysArray = Object.keys(data[0]).map(key => ({ key: key, label: key }));


  return { data, keysArray };
}


function extractCodeFromCDATA(node) {
  const codeNode = xpath.select1("Code/text()", node);
  if (codeNode) {
    const cdata = codeNode.data.trim(); // Trim the CDATA content
    if (cdata) {
      return cdata;
    }
  }
  return null;
}