const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: String,
    url: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{ body: String }]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()

        delete returnedObject._id
        delete returnedObject.__v

        if (returnedObject.comments !== undefined) {
            for (let i = 0; i < returnedObject.comments.length; i++) {
                returnedObject.comments[i].id = returnedObject.comments[i]._id.toString()
                delete returnedObject.comments[i]._id
            }
        }
    }
})


const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog