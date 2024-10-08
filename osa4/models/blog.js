const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
  },

  author: {
    type: String,
  },

  url: {
    type: String,
  },
  
  likes: {
    type: Number
  },
  user: {    
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User'  
  }
})

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)