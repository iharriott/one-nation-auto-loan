export const removeSpaceToUpper = (str) => {
    return str.replace(/\s+/g, '').toUpperCase();
}

export const responseApi = async (data) => {
    return  response = {
         statusCode: 200,
         headers: {
             "Access-Control-Allow-Headers" : "Content-Type",
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
         },
         body: data
     };
   }