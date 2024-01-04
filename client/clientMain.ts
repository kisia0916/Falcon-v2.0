import * as net from "net"
import * as fs from "fs"
import { setFormat } from "../dataFormat/setFormat"

const PORT = 3000
const HOST = "localhost"

const client = new net.Socket()

const sendFile = fs.readFileSync("./testFiles/example.txt")

client.on("data",(data:string)=>{
    //json pase
    try{
        const getData = JSON.parse(data)
        if(getData.type === "mess"){
            console.log(getData.data)
            client.write(setFormat("mess","hello server"))
        }
    }catch(error){
        console.log(`client error! message : ${error}`)
    }

})

client.connect(PORT,HOST,()=>{
    console.log("done connection!")
})