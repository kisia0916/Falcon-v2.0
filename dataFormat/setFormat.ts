export const setFormat = (type:string,environment:string,target:number,data:any)=>{
    const sendJson = {type:type,environment:environment,target:target,data:data}
    return JSON.stringify(sendJson)
}