import { createContact, getContacts } from '@/contacts'
import { ContactType } from '@/types/contacts'
import classNames from 'classnames'
import { useEffect } from 'react'

import {
  Form,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit
} from 'react-router-dom'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const contacts = await getContacts(q ?? '')
  return { contacts, q }
}

export async function action() {
  const contact = await createContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export default function Root() {
  const { contacts, q } = useLoaderData() as {
    contacts: ContactType[]
    q?: string
  }

  const navigation = useNavigation()

  // The navigation.location will show up when the app is navigating to a new URL and loading the data for it. It then goes away when there is no pending navigation anymore.
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q')

  const submit = useSubmit()
  useEffect(() => {
    ;(document.getElementById('q')! as HTMLInputElement).value = q || ''
  }, [q])

  const renderContacts = () => {
    if (!contacts.length) {
      return (
        <p>
          <i>No Contacts</i>
        </p>
      )
    }
    return (
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <NavLink
              to={`/contacts/${contact.id}`}
              className={({ isActive, isPending }) =>
                classNames({
                  active: isActive,
                  pending: isPending
                })
              }
            >
              {contact.first || contact.last ? (
                <>
                  {contact.first} {contact.last}
                </>
              ) : (
                <i>No Name</i>
              )}
              {contact.favorite && <span>★</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <>
      <div id='sidebar'>
        <h1>React Router Contacts</h1>
        <div>
          <Form id='search-form' role='search'>
            <input
              id='q'
              aria-label='Search contacts'
              placeholder='Search'
              type='search'
              name='q'
              defaultValue={q}
              onChange={event => {
                submit(event.currentTarget.form, {
                  replace: !!q // 方便一次后退即可退出当前词搜索
                })
              }}
              className={searching ? 'loading' : ''}
            />
            <div id='search-spinner' aria-hidden hidden={!searching} />
            <div className='sr-only' aria-live='polite'></div>
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>{renderContacts()}</nav>
      </div>
      <div
        id='detail'
        className={classNames({
          loading: navigation.state === 'loading'
        })}
      >
        <Outlet />
      </div>
    </>
  )
}
