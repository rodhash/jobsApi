
import mongoose from 'mongoose'
import xss from 'xss'

const ObjectId = mongoose.Types.ObjectId

mongoose.set('sanitizeFilter', true)

const JobSchema = new mongoose.Schema({
  company      : { type: String  , maxlength: 50       , required: [true       , 'Company name is required'] , } ,
  position     : { type: String  , maxlength: 100      , required: [true       , 'Position name is required'], } ,
  status       : { type: String  , default  : 'pending', enum    : ['interview', 'declined', 'pending'],       } ,
  createdById  : { type: ObjectId, ref      : 'User'   , required: [true       , "User is required"],          } ,
  createdByName: { type: String },
}, {timestamps: true})

// Fills in the userName
JobSchema.pre('save', async function(_next) {
  if (!this.createdByName) {
    const user = await mongoose.model("User").findById(this.createdById).select("name")
    if (user) {
      this.createdByName = user.name
    }
    // next()
  }
})

// Manual sanitizing (too simple)
// JobSchema.pre('save', async function(_next) {
//   this.company = this.company.replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   // next();
// });

// Pre-save middleware to sanitize input
JobSchema.pre('save', async function(_next) {
  this.company = xss(this.company);
  this.position = xss(this.position);
  // next();
});

export const Job = mongoose.model('Job', JobSchema)

