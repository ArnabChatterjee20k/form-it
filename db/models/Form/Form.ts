import mongoose, { Schema, Document, Model } from 'mongoose'

export interface FormType extends Document {
  name: string
  closeDate?: Date
  userId: string
  description?: string
  formSubmissionMessage?: {
    message: string
    link?: string
  }
  discordNotification: boolean
}

// Define the form submission message schema
const formSubmissionMessageSchema = new Schema({
  message: {
    type: String,
    default: 'Your form submitted',
  },
  link: String,
})

type FormModel = Model<FormType>
const formSchema = new Schema<FormType,FormModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: [300, 'Max length of name is 300'],
    },
    closeDate: {
      type: Date,
    },
    userId: {
      type: String,
      required: [true, 'Authenticated User Id is required'],
    },
    description: {
      type: String,
      required: false,
      maxLength: [1000, 'Max length of description is 1000'],
    },
    formSubmissionMessage: formSubmissionMessageSchema,
    discordNotification: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Form: FormModel = mongoose.model<FormType,FormModel>('Form', formSchema)

export default Form
