const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

const MongoDB_URI = process.env.MONGO_DB_URI

const mongoDBConnection = async () => {

    await mongoose.connect(MongoDB_URI, async (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Conencted to Database");
            const food_items_data = await mongoose.connection.db.collection(process.env.ITEM_COLLECTION_NAME)
            food_items_data.find({}).toArray(async (err, data) => {
                const foodCategory = await mongoose.connection.db.collection(process.env.ITEM_CATEGORY_NAME)
                foodCategory.find({}).toArray(async (err, catData) => {
                    if (err) console.log(err)
                    else {
                        global.food_data = data
                        global.food_category_data = catData
                        console.log(catData)
                    }
                })
            })
        }
    })

}

mongoDBConnection()