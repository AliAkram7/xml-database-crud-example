'use server'


import { connect } from '@existdb/node-exist'

const db = connect({
  basic_auth: {
    user: 'admin',
    pass: 'printf(";'
  },
  protocol: 'http:',
  host: '127.0.1.1',
  port: '8080',
  path: '/exist/xmlrpc'
})





export default async function connection(query) {


  const options = { collection: "/db/JSAPP/" }


  const result = await db.queries.read(query, options).then((result) => {
    return result
  }).catch((error) => {
    console.error(error);
  });

  return result

}


export  async function connectionExecute(xquery) {

  const options = { collection: "/db/JSAPP/" }
  
  const result = db.queries.execute(xquery, options).then(result => {
    return result
  }).catch(error => {
    console.error(error);
  });

  return result


}




