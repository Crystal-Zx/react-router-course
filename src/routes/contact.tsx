import { getContact, updateContact } from '@/contacts'
import { ContactType } from '@/types/contacts'
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData
  // useNavigate
} from 'react-router-dom'

export async function loader({ params }: LoaderFunctionArgs) {
  // if (!params.contactId) return null
  const contact = await getContact(params.contactId ?? '')
  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found'
    })
  }
  return contact
}

export default function Contact() {
  const contact = useLoaderData() as ContactType

  // const navigate = useNavigate()

  return (
    <div id='contact'>
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target='_blank' href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          {/* Because this is a GET, not a POST, React Router does not call the action. Submitting a GET form is the same as clicking a link: only the URL changes. */}
          <Form action='edit'>
            <button type='submit'>Edit</button>
          </Form>
          {/* NOTE: 也可以使用编程式跳转，不走 form 的 get 默认事件处理程序 */}
          {/* <button type='submit' onClick={() => navigate('edit')}>
            Edit
          </button> */}
          <Form
            method='post'
            action='destroy'
            onSubmit={event => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type='submit'>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData()
  return await updateContact(params.contactId as string, {
    favorite: formData.get('favorite') === 'true'
  })
}
function Favorite({ contact }: { contact: ContactType }) {
  const fetcher = useFetcher()
  const favorite = fetcher.formData
    ? fetcher.formData.get('favorite') === 'true'
    : contact.favorite
  console.log('🚀 ~ Favorite ~ fetcher.formData:', fetcher.formData)

  return (
    <fetcher.Form method='post'>
      <button
        name='favorite'
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
