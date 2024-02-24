const moongoose = require('mongoose')


const ConnectDatabase = async()=>{

    try {
        await moongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected...")
    } catch (error) {
        console.log(`Error In Connecting In database ${error}`)
    }


}

module.exports =ConnectDatabase