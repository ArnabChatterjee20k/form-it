import createForm, {
  deleteFormSettings,
  getAllForms,
  getFormSettingsById,
  updateFormSettings,
} from '../app/(dashboard)/dashboard/utils/utils'
import { describe, it, expect, afterAll } from 'vitest'
import { E2E_USER_ID, randomUserId } from './utils/config'
import { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { formSchema } from '../db/models/Form/form.schema'
describe('form operation', () => {
  let createdFormID = ''

  // Edge case: Creating form with optional description
  it('Creating form with description', async () => {
    const formInfo = {
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
    }
    const formResponse = await createForm(E2E_USER_ID, formInfo)
    expect(formResponse).toHaveProperty('status')
    expect(formResponse).toHaveProperty('formID')
    expect(formResponse['status']).toBe(true)
    const formId = formResponse['formID']
    const isValidFormID = Types.ObjectId.isValid(formId)
    expect(isValidFormID).toBe(true)
    createdFormID = formId
  }),
    // Edge case: Creating form with extremely long name
    it('Creating form with long name', async () => {
      const formInfo = {
        name: faker.string.alphanumeric(200),
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo)
      expect(formResponse).toHaveProperty('status')
      expect(formResponse).toHaveProperty('formID')
      expect(formResponse['status']).toBe(true)
    }),
    // Edge case: Attempt to create form without name
    it('Creating form without name should fail', async () => {
      const formInfo = {
        name: '',
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo)
      expect(formResponse['status']).toBe(false)
      expect(formResponse).toHaveProperty('errors')
    }),
    // Existing create form test
    it('Creating form', async () => {
      const formInfo = {
        name: faker.person.fullName(),
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo)
      expect(formResponse).toHaveProperty('status')
      expect(formResponse).toHaveProperty('formID')
      expect(formResponse['status']).toBe(true)
      const formId = formResponse['formID']
      const isValidFormID = Types.ObjectId.isValid(formId)
      expect(isValidFormID).toBe(true)
      createdFormID = formId

      const form = await getFormSettingsById(E2E_USER_ID, createdFormID)
      expect(form).toHaveProperty('settings')
      const settings = form['settings']
      const validation = await formSchema.safeParseAsync(settings)
      console.log({ validationResult: validation.error?.errors })
      expect(validation.success).toBe(true)
    }),
    it('Getting all Forms', async () => {
      const forms = await getAllForms(E2E_USER_ID)
      expect(forms['forms']).toBeInstanceOf(Array)
      expect(forms['forms']?.length).toBeGreaterThanOrEqual(1)
    }),
    // Edge case: Partial update of form settings
    it('Partial update of form settings', async () => {
      const partialUpdate = {
        name: faker.person.fullName(),
      }
      const updateResponse = await updateFormSettings(
        E2E_USER_ID,
        createdFormID,
        partialUpdate,
      )
      expect(updateResponse).toBeTruthy()
    }),
    // Edge case: Attempt to update with empty name
    it('Update form with empty name should fail', async () => {
      const invalidUpdate = {
        name: '',
      }
      const updateResponse = await updateFormSettings(
        E2E_USER_ID,
        createdFormID,
        invalidUpdate,
      )
      expect(updateResponse['status']).toBe(false)
    }),
    // Existing update test
    it('updating form', async () => {
      const form = await getFormSettingsById(E2E_USER_ID, createdFormID)
      const settings = form['settings']
      const newFormSettings = {
        name: faker.person.fullName(),
        formSubmissionMessage: {
          message: 'Your form submitted',
          link: 'link to some group',
        },
        discordNotification: true,
      }
      const updateFormSettingsResponse = await updateFormSettings(
        E2E_USER_ID,
        createdFormID,
        newFormSettings,
      )
      Object.keys(updateFormSettingsResponse).forEach((k) => {
        const v = updateFormSettings[k]
        console.log({ k, v })
        expect(v).toBe(newFormSettings[k])
      })
    }),
    // Existing tests remain the same...
    it('deletion should not be allowed by non authenticated users', async () => {
      const res = await deleteFormSettings(randomUserId, createdFormID)
      expect(res).toBe(false)
    }),
    afterAll(async () => {
      const res = await deleteFormSettings(E2E_USER_ID, createdFormID)
      expect(res).toBe(true)
    })
})
