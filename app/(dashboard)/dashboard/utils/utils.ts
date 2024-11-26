import { z } from "zod"

interface Form{
    name:string,
    description?:string,
    closeDate?:Date,
    formSubmissionMessage?:{message?:string,link?:string},
    discordNotification?:boolean
}

import { Types } from 'mongoose';

export default async function createForm(userID: string, formInfo: any) {
  // Mocking a successful form creation response with a new form ID
  if (!formInfo.name) {
    return { status: false, error: 'Name is required' };
  }

  const formID = new Types.ObjectId().toString();
  return { status: true, formID };
}

export async function getAllForms(userID: string) {
  // Mocking a successful response with a list of forms
  return [
    { formID: '1', name: 'Sample Form 1', userID },
    { formID: '2', name: 'Sample Form 2', userID }
  ];
}

export async function getFormSettingsById(userID: string, formId: string) {
  // Mocking form settings retrieval by form ID
  return {
    formID: formId,
    userID,
    settings: {
      name: 'Sample Form',
      formSubmissionMessage: {
        message: 'Your form submitted',
        link: 'link to some group'
      },
      discordNotification: true
    }
  };
}

export async function updateFormSettings(userID: string, formId: string, newFormSettings: any) {
  // Mocking a successful form update response
  if (!newFormSettings.name) {
    return { status: false, error: 'Name is required' };
  }

  return { status: true, ...newFormSettings };
}

export async function deleteFormSettings(userID: string, formId: string) {
  // Mocking form deletion response
  return true;
}