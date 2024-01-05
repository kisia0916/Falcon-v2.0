import * as net from "net"
import * as uuid from "uuid"
import { sendDataType } from "../dataFormat/sendData"
import { setFormat } from "../dataFormat/setFormat"
import { getDataClient } from "./getDataClient"
const PORT = 3000
const HOST = "localhost"

const server = net.createServer()

interface clientListType{
    userId:string,
    socket:any,
    status:boolean,
    sendSocket:any
}

let clientList:clientListType[] = []
let targetList = []

export const pushClientList = (data:clientListType)=>{
    clientList.push(data)
    console.log(clientList)
}

server.on("connection",(socket)=>{
    let splitFileSize:number = 0
    let sendClientFlg:boolean = false
    const userId = uuid.v4()

    const setSplitFileSize = (size:number) =>{
        splitFileSize = size
    }
    socket.write(setFormat("init","server",1,userId))
    socket.on("data",(data:string)=>{
        try{
            let getData:sendDataType = {type:"",environment:"",target:1,data:""}
            if (!sendClientFlg){
                getData = JSON.parse(data)
            }else{
                
            }
            if(getData.environment === "client"){
                getDataClient(getData,userId,socket,setSplitFileSize)
            }else if (getData.environment === "sendClient"){
                const clientIndex = clientList.findIndex((i)=>i.userId === getData.data)
                if (clientIndex !== -1){
                    clientList[clientIndex].sendSocket = socket
                    sendClientFlg = true
                    console.log(clientList)
                }
            }
        }catch(error){
            console.log(`server error! message : ${error}`)
        }

    })
})

server.listen(PORT,()=>{
    console.log("server runing!")
})