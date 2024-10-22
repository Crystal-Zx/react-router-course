import { deleteContact } from '@/contacts'
import { ActionFunctionArgs, redirect } from 'react-router-dom'

export async function action({ params }: ActionFunctionArgs) {
  // throw new Error('Fail to delete contact')
  if (!params.contactId) return null
  await deleteContact(params.contactId)
  return redirect('/')
}
