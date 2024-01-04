import * as net from "net"
import { sendDataType } from "../dataFormat/sendData"
import { setFormat } from "../dataFormat/setFormat"
const PORT = 3000
const HOST = "localhost"

const server = net.createServer()

server.on("connection",(socket)=>{
    //test send
    socket.write(setFormat("mess","hello client"))
    //json parse
    socket.on("data",(data:string)=>{
        try{
            const getData:sendDataType = JSON.parse(data)
            console.log(getData.data)
        }catch(error){
            console.log(`server error! message : ${error}`)
        }

    })
})

server.listen(PORT,()=>{
    console.log("server runing!")
})