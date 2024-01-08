import * as net from "net"
import * as fs from "fs"
import { setFormat } from "../dataFormat/setFormat"
import { sendFileMain, dataUpload, doneSplitUpload } from "./sendFile"

const PORT = 3000
const HOST = "localhost"

const client = new net.Socket()
const DataSendClient = new net.Socket()

const sendFile = fs.readFileSync("./testFiles/example.txt")
const fileSize = fs.statSync("./testFiles/example.txt").size

let userId:string|number = ""
let sendUserId:string|number = ""
let targetId:string|number = ""
let targetSendId:string|number = ""

sendFileMain(client,DataSendClient,sendFile,fileSize)
client.on("data",(data:string)=>{
    //json pase
    try{
        const getData = JSON.parse(data)
        if (getData.target === 1){
            if(getData.type === "init"){
                console.log(getData.data)
                userId = getData.data.userId
                targetId = getData.data.targetId
                console.log(getData.data.targetId)
                //send clinet connect
                DataSendClient.connect(PORT,HOST,()=>{
                    console.log("done connection datasend")
                })
                client.write(setFormat("connection_state_client","client",1,"done"))
            }else if (getData.type === "target_connection_reqest"){
                console.log("ターゲットから接続のリクエストがありました")
                console.log(getData.data)
                targetId = getData.data.targetId
                targetSendId = getData.data.targetSendId
                //リクエストがあったクライアントに接続完了を知らせる
                client.write(setFormat("done_establish_connection","client",1,targetId))
            }
        }
    }catch(error){
        console.log(`client error! message : ${error}`)
    }
})

DataSendClient.on("data",(data:string)=>{
    try{
        const getData = JSON.parse(data)
        if (getData.type === "init"){
            sendUserId = getData.data.userId
            console.log(sendUserId)
            DataSendClient.write(setFormat("connection_state_sendClient","sendClient",1,{userId:userId,targetId:targetId}))
        }else if (getData.type === "start_uplod"){
            //start upload
            console.log("start uload")
            dataUpload(DataSendClient)
        }else if (getData.type === "done_upload_splitData"){
            doneSplitUpload(DataSendClient,client)
        }
    }catch(error){
        console.log(`client error! message : ${error}`)
    }
})

client.connect(PORT,HOST,()=>{
    console.log("done connection!")
})
