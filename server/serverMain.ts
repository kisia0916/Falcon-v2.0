import * as net from "net"
import * as uuid from "uuid"
import * as fs from "fs"
import { sendDataType } from "../dataFormat/sendData"
import { setFormat } from "../dataFormat/setFormat"
import { getDataClient, getSendDataClient } from "./getDataClient"
const PORT = 3000
const HOST = "localhost"

const server = net.createServer()

interface clientListType{
    userId:string|number,
    sendDataId:string|number,
    socket:any,
    status:boolean,
    sendSocket:any
}

export let clientList:clientListType[] = []

export const pushClientList = (data:clientListType)=>{
    clientList.push(data)
    console.log(clientList)
}
server.on("connection",(socket)=>{
    let splitFileSize:number = 0
    let sendClientFlg:boolean = false
    // const userId = uuid.v4()
    let userId:string|number = 0
    let targetid:string|number = 0
    let targetSendid:string|number = 0


    userId = uuid.v4()
    targetid = fs.readFileSync("./testFiles/target.txt","utf-8")

    let targetSocket = undefined
    let targetDataSocket = undefined

    const setSplitFileSize = (size:number) =>{
        splitFileSize = size
    }
    socket.write(setFormat("init","server",1,{userId:userId,targetId:targetid}))
    socket.on("data",(data:string)=>{
        try{
            let getData:sendDataType = {type:"",environment:"",target:1,data:""}
            if (!sendClientFlg){
                getData = JSON.parse(data)
            }else{
                getSendDataClient(data,socket,splitFileSize)
            }
            if(getData.environment === "client"){
                getDataClient(getData,userId,socket,setSplitFileSize)
            }else if (getData.environment === "sendClient"){
                const clientIndex = clientList.findIndex((i)=>i.userId === getData.data.userId)
                targetid = getData.data.targetId
                console.log(targetid)
                if (clientIndex !== -1){
                    clientList[clientIndex].sendSocket = socket
                    clientList[clientIndex].sendDataId = userId
                    targetid = getData.data.targetId
                    console.log("hello"+ " " + getData.data.targetId)
                    sendClientFlg = true
                    console.log(clientList)
                    const targetIndex = clientList.findIndex((i)=>i.userId === targetid)
                    if (targetIndex !== -1){
                        targetSocket = clientList[targetIndex].socket
                        targetDataSocket = clientList[targetIndex].sendSocket
                        targetSendid = clientList[targetIndex].sendDataId
                        //targetに接続をリクエスト
                        targetSocket.write(setFormat("target_connection_reqest","server",1,{targetId:getData.data.userId,targetSendId:userId}))
                    }
                    // socket.write(setFormat("start_uplod","server",1,"done"))
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