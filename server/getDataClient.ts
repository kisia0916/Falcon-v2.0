import { sendDataType } from "../dataFormat/sendData";
import { setFormat } from "../dataFormat/setFormat";
import { pushClientList } from "./serverMain";

let splitFileSize = 0
export const getDataClient = (getData:sendDataType,userId:string,socket:any,setSplitFileSize:any)=>{
    if(getData.type === "connection_state_client"){
        if(getData.data === "done"){
            pushClientList({userId:userId,socket:socket,status:true,sendSocket:null})
            //ファイル送信開始
            socket.write(setFormat("start_send","server",2,""))
        }
    }else if(getData.type === "send_split_size"){
        splitFileSize = getData.data
        setSplitFileSize(getData.data)
        console.log(`split size is ${splitFileSize}`)
    }else if (getData.type === "send_split_data"){

    }
}