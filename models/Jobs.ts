
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

const JobSchema = new mongoose.Schema({
  company      : { type: String  , maxlength: 50       , required: [true       , 'Company name is required'] , } ,
  position     : { type: String  , maxlength: 100      , required: [true       , 'Position name is required'], } ,
  status       : { type: String  , default  : 'pending', enum    : ['interview', 'declined', 'pending'],       } ,
  createdById  : { type: ObjectId, ref      : 'User'   , required: [true       , "User is required"],          } ,
  createdByName: { type: String },
}, {timestamps: true})

JobSchema.pre('save', async function(next) {
  if (!this.createdByName) {
    const user = await mongoose.model("User").findById(this.createdById).select("name")
    if (user) {
      this.createdByName = user.name
    }
    next()
  }
})


export const Job = mongoose.model('Job', JobSchema)

