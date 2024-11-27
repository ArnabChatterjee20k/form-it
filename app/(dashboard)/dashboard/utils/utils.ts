import { z } from 'zod'
import connectToDB from '../../../../db/db'
import Form from '../../../../db/models/Form/Form'
import { formSchema, formType } from '../../../../db/models/Form/form.schema'
import mongoose, { Types } from 'mongoose'

export default async function createForm(userID: string, formInfo: formType) {
  try {
    await connectToDB()
    const validatedResult = await formSchema.safeParseAsync(formInfo)
    if (validatedResult.success) {
      const form = new Form({ ...formInfo, userId: userID })
      const createdForm = await form.save()
      const formID = createdForm._id
      return { status: true, formID, errors: [] }
    }
    return { status: false, errors: validatedResult.error.errors.values() }
  } catch (error) {
    return { status: false, errors: ['Some error occured'] }
  }
}

export async function getAllForms(userID: string) {
  try {
    await connectToDB()
    const forms = await Form.find({ userId: userID })
    return { forms, errors: [] }
  } catch (error) {
    return { forms: [], errors: ['Some erorr occured'] }
  }
}

export async function getFormSettingsById(
  userID: string,
  formId: string,
): Promise<{ settings: formType | null; errors: any[] }> {
  try {
    await connectToDB()
    const form = await Form.findOne({
      userId: userID,
      _id: new mongoose.Types.ObjectId(formId),
    })
    return { settings: form as any as formType, errors: [] }
  } catch (error) {
    return { settings: null, errors: ['Some error occured'] }
  }
}

export async function updateFormSettings(
  userID: string,
  formId: string,
  newFormSettings: formType,
) {
  const errorResponse = {
    status: false,
    settings: null,
  }
  try {
    await connectToDB()
    if (!Object.keys(newFormSettings).length) return errorResponse
    const validatedResult = await formSchema
      .partial()
      .safeParseAsync(newFormSettings)
    if (!validatedResult.success) return errorResponse
    const form = await Form.findOne({
      userId: userID,
      _id: new mongoose.Types.ObjectId(formId),
    })
    if (!form) return errorResponse

    const formSettings = { ...form, newFormSettings }
    await form.updateOne(formSettings)
    return { status: true, ...formSettings }
  } catch (error) {
    return errorResponse
  }
}

export async function deleteFormSettings(userID: string, formId: string) {
  try {
    const deletedResponse = await Form.deleteOne({userId:userID,_id:new mongoose.Types.ObjectId(formId)})
    return Boolean(deletedResponse.deletedCount)
  } catch (error) {
    return false
  }
}
