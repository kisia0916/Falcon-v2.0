import * as net from "net"
import * as fs from "fs"
import { setFormat } from "../dataFormat/setFormat"
import { sendFileMain } from "./sendFile"

const PORT = 3000
const HOST = "localhost"

const client = new net.Socket()
const DataSendClient = new net.Socket()

const sendFile = fs.readFileSync("./testFiles/example.txt")
const fileSize = fs.statSync("./testFiles/example.txt").size

let userId:string = ""

sendFileMain(client,DataSendClient,sendFile,fileSize)
client.on("data",(data:string)=>{
    //json pase
    try{
        const getData = JSON.parse(data)
        if (getData.target === 1){
            if(getData.type === "init"){
                console.log(getData.data)
                userId = getData.data
                //send clinet connect
                DataSendClient.connect(PORT,HOST,()=>{
                    console.log("done connection datasend")
                })
                client.write(setFormat("connection_state_client","client",1,"done"))
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
            DataSendClient.write(setFormat("connection_state_sendClient","sendClient",1,userId))
        }
    }catch(error){
        console.log(`client error! message : ${error}`)
    }
})

client.connect(PORT,HOST,()=>{
    console.log("done connection!")
})
