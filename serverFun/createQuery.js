'use server'

import { DOMParser } from "xmldom";
import xpath from "xpath";
import connection from "./connection";

export default async function createQuery(query) {

    const xml = await connection(query); // Execute the provided XQuery.
    const doc = new DOMParser().parseFromString(xml);

    const nodes = xpath.select("//*", doc); // Select all elements in the XML.


    const data = nodes.map((node) => {
        const rowData = {};
        // Extract column names dynamically from the XML.
        
        const columnNames = Array.from(node.childNodes)
            .filter((child) => child.nodeType === 1) // Select only element nodes.
            .map((child) => child.nodeName);

            console.log({columnNames})

        // Loop through the extracted column names and extract data.
        columnNames.forEach((columnName) => {
            const value = (xpath.select1(`${columnName}/text()`, node))?.nodeValue;
            rowData[columnName] = value;
        });

        return rowData;
    });

    const keysArray = Object.keys(data[0]).map((key) => ({ key, label: key }));

    return { data, keysArray };


}

