import createForm, {
  deleteFormSettings,
  getAllForms,
  getFormSettingsById,
  updateFormSettings,
} from '../app/(dashboard)/dashboard/utils/form.utils'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { E2E_USER_ID, randomUserId } from './utils/config'
import mongoose, { Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { formSchema, formType } from '../db/models/Form/form.schema'

let createdFormID = ''
let createdFormIDs:mongoose.Types.ObjectId[] = []

describe("Form operation testing",()=>{
  describe('Authenticated User Form Operations', () => {
    // Edge case: Creating form with optional description
    it('Creating form with description', async () => {
      const formInfo = {
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo as any)
      expect(formResponse).toHaveProperty('status')
      expect(formResponse).toHaveProperty('formID')
      expect(formResponse['status']).toBe(true)
      const formId = formResponse['formID']
      const isValidFormID = Types.ObjectId.isValid(formId as any)
      expect(isValidFormID).toBe(true)
      createdFormID = formId as string
      createdFormIDs.push(formId as any) // Store in array
    })
  
    // Edge case: Creating form with extremely long name
    it('Creating form with long name', async () => {
      const formInfo = {
        name: faker.string.alphanumeric(200),
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo as any)
      expect(formResponse).toHaveProperty('status')
      expect(formResponse).toHaveProperty('formID')
      expect(formResponse['status']).toBe(true)
      createdFormIDs.push(formResponse['formID'] as any) // Store in array
    })
  
    // Edge case: Attempt to create form without name
    it('Creating form without name should fail', async () => {
      const formInfo = {
        name: '',
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo as any)
      expect(formResponse['status']).toBe(false)
      expect(formResponse).toHaveProperty('errors')
    })
  
    // Existing create form test
    it('Creating form', async () => {
      const formInfo = {
        name: faker.person.fullName(),
      }
      const formResponse = await createForm(E2E_USER_ID, formInfo as any)
      expect(formResponse).toHaveProperty('status')
      expect(formResponse).toHaveProperty('formID')
      expect(formResponse['status']).toBe(true)
      const formId = formResponse['formID'] as string
      const isValidFormID = Types.ObjectId.isValid(formId)
      expect(isValidFormID).toBe(true)
      createdFormID = formId
      createdFormIDs.push(formId as any) // Store in array
  
      const form = await getFormSettingsById(E2E_USER_ID, createdFormID)
      expect(form).toHaveProperty('settings')
      const settings = form['settings']
      const validation = await formSchema.safeParseAsync(settings)
      expect(validation.success).toBe(true)
    })
  
    it('Getting all Forms', async () => {
      const forms = await getAllForms(E2E_USER_ID)
      expect(forms['forms']).toBeInstanceOf(Array)
      expect(forms['forms']?.length).toBeGreaterThanOrEqual(1)
    })
  
    // Edge case: Partial update of form settings
    it('Partial update of form settings', async () => {
      const partialUpdate = {
        name: faker.person.fullName(),
      }
      const updateResponse = await updateFormSettings(
        E2E_USER_ID,
        createdFormID,
        partialUpdate as any,
      )
      expect(updateResponse).toBeTruthy()
    })
  
    // Edge case: Attempt to update with empty name
    it('Update form with empty name should fail', async () => {
      const invalidUpdate = {
        name: '',
      }
      const updateResponse = await updateFormSettings(
        E2E_USER_ID,
        createdFormID,
        invalidUpdate as any,
      )
      expect(updateResponse['status']).toBe(false)
    })
  
    // Existing update test
    it('updating form', async () => {
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
  
      // Check if the status is true
      expect(updateFormSettingsResponse['status']).toBe(true)
    })
  
    it('deletion should be allowed for authenticated users', async () => {
      const res = await deleteFormSettings(E2E_USER_ID, createdFormID)
      expect(res).toBe(true)
    })
  
    afterAll(async () => {
      async function deleteAndCheck(formID: string) {
        await deleteFormSettings(E2E_USER_ID, formID)
        const { settings } = await getFormSettingsById(E2E_USER_ID, formID)
        expect(settings).toBe(null)
      }
      const promises = createdFormIDs.map((id) => deleteAndCheck(id as any))
      await Promise.allSettled(promises)
    })
  })
  
  describe('Non-Authenticated User Form Operations', () => {
    it('updation should not be allowed by non authenticated users', async () => {
      const newFormSettings = {
        name: faker.person.fullName(),
        formSubmissionMessage: {
          message: 'Your form submitted',
          link: 'link to some group',
        },
        discordNotification: true,
      }
  
      const updateFormSettingsResponse = await updateFormSettings(
        randomUserId,
        createdFormID,
        newFormSettings,
      )
  
      // Check if the status is true
      expect(updateFormSettingsResponse['status']).toBe(false)
    })
    it('deletion should not be allowed by non-authenticated users', async () => {
      const res = await deleteFormSettings(randomUserId, createdFormID)
      expect(res).toBe(false)
    })
  })
})
