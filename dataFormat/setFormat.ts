export const setFormat = (type:string,data:any)=>{
    const sendJson = {type:type,data:data}
    return JSON.stringify(sendJson)
}