import * as net from "net"
const PORT = 3000
const HOST = "localhost"

const target = new net.Socket()

target.connect(PORT,HOST,()=>{
    console.log("done connection!")
})