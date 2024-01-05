import * as fs from "fs"
import { setFormat } from "../dataFormat/setFormat"

const splitSize:number = 1024

const splitFileData = (data:any,fileSize:number) =>{
    let splitFileData = []
    const splitNum = Math.ceil(fileSize/splitSize)
    if (fileSize>splitSize){
        for (let i = 0;splitNum>i;i++){
            const chunck = data.slice(i*splitSize,i*splitSize+splitSize)
            console.log(chunck.length)
            splitFileData.push(chunck)
        }
    }else{
        splitFileData.push(data)
    }
    console.log(splitFileData)
    return splitFileData
}

export const sendFileMain = (client:any,dataSendClient:any,fileData:any,size:number)=>{
    let splitList = []
    client.on("data",(data:string)=>{
        try{
            const getData = JSON.parse(data)
            if (getData.target === 2){
                if (getData.type === "start_send"){
                    client.write(setFormat("send_split_size","client",1,splitSize))
                    splitList = splitFileData(fileData,size)
                }
            }
        }catch(error){

        }

    })
}