import { sendDataType } from "../dataFormat/sendData";
import { setFormat } from "../dataFormat/setFormat";
import { clientList, pushClientList } from "./serverMain";

let splitFileSize = 0
export const getDataClient = (getData:sendDataType,userId:string|number,socket:any,setSplitFileSize:any)=>{
    if(getData.type === "connection_state_client"){
        if(getData.data === "done"){
            pushClientList({userId:userId,sendDataId:"",socket:socket,status:true,sendSocket:null})
            //ファイル送信開始
            socket.write(setFormat("start_send","server",2,""))
        }
    }else if(getData.type === "send_split_size"){
        splitFileSize = getData.data
        setSplitFileSize(getData.data)
        
        console.log(`split size is ${splitFileSize}`)
    }else if(getData.type === "done_allData_upload"){
        console.log("done upload")
    }else if (getData.type === "done_establish_connection"){
        console.log("うまく動いてます2")
        console.log(getData.data)
        const clientIndex = clientList.findIndex((i)=>i.userId === getData.data)
        if (clientIndex !== -1){
            console.log("うまく動いてます")
            clientList[clientIndex].sendSocket.write(setFormat("start_uplod","server",1,"done"))
        }
    }
}

let cacheData:any = []
export const getSendDataClient = (getData:string,sendClient:any,splitFileSize:number)=>{
    console.log("get bary")
    cacheData.push(getData)
    console.log(Buffer.concat(cacheData).length)
    if (Buffer.concat(cacheData).length >=splitFileSize){
        //targetに送信
        
        //targetに送信し終わったら
        sendClient.write(setFormat("done_upload_splitData","sendClient",1,"done"))
    }
}