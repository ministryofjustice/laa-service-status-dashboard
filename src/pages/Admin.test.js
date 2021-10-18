import Admin from './Admin'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  onValue,
  push,
  ref,
  remove,
  set
} from 'firebase/database';

import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  child: jest.fn(),
  getDatabase: jest.fn(),
  onValue: jest.fn(),
  push: jest.fn(),
  ref: jest.fn(),
  remove: jest.fn(),
  set: jest.fn()
}));

describe('Admin component', () => {
  it('renders the Login component when not logged in', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user(null)
    })

    const { getByRole } = render(<Admin />)

    expect(getByRole('heading')).toHaveTextContent('Login')
    expect(getByRole('form')).toBeInTheDocument()
  })

  it('renders the Admin component when logged in', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    const { getByText } = render(<Admin />)

    expect(getByText('admin@example.com')).toBeInTheDocument()
    expect(getByText('Message')).toBeInTheDocument()
    expect(getByText('Services')).toBeInTheDocument()
  })

  it('displays a message', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/message-ref') {
        snapshot({ val() { return 'test message' } })
      }
    })

    const { getByText } = render(<Admin />)

    expect(getByText('test message')).toBeInTheDocument()
  })

  it('displays a list of services', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/services-ref') {
        snapshot([
          {
            key: '1',
            val() {
              return {
                display: true, name: 'ServiceB', status: 'red'
              }
            }
          }, {
            key: '2',
            val() {
              return {
                display: false, name: 'ServiceA', status: 'green'
              }
            }
          }
        ])
      }
    })

    const { getByText } = render(<Admin />)

    await waitFor(() => {
      expect(getByText('ServiceB')).toBeInTheDocument()
      expect(getByText('ServiceA')).toBeInTheDocument()
    })
  })

  it('allows the user to sign out', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    const { getByText } = render(<Admin />)

    userEvent.click(getByText('Sign out'))

    await waitFor(() => {
      expect(signOut).toBeCalledTimes(1)
    })
  })

  it('allows the user to edit a message', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementationOnce((ref, snapshot) => {
      if (ref === '/message-ref') {
        snapshot({ val() { return 'test message' } })
      }
    })

    const { getByText, getByRole } = render(<Admin />)

    userEvent.click(getByRole('button', { name: 'editMessage' }))

    await waitFor(() => {
      getByRole('heading', { name: 'Edit Message' })
    })

    set.mockImplementation((_ref, _message) => Promise.resolve({}))

    userEvent.type(getByRole('textbox', { name: 'messageInput' }), 'hi')
    userEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(set).toBeCalledWith('/message-ref', 'hi')
      expect(getByText('hi')).toBeInTheDocument()
    })
  })

  it('allows the user to change service status', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/services-ref') {
        snapshot([
          {
            key: '1',
            val() {
              return {
                display: true, name: 'ServiceA', status: 'red'
              }
            }
          }
        ])
      }
    })

    set.mockImplementation((_ref, _status) => Promise.resolve({}))

    const { getByRole } = render(<Admin />)

    userEvent.click(getByRole('button', { name: 'setStatus-amber-1' }))

    await waitFor(() => {
      expect(set).toBeCalledWith('/services/1/status-ref', 'amber')

      expect(
        getByRole('button', { name: 'setStatus-red-1' }))
        .toHaveClass('w3-disabled')

      expect(
        getByRole('button', { name: 'setStatus-amber-1' }))
        .not
        .toHaveClass('w3-disabled')
    })
  })

  it('allows the user to pause a service', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/services-ref') {
        snapshot([
          {
            key: '1',
            val() {
              return {
                display: true, name: 'ServiceA', status: 'red'
              }
            }
          }
        ])
      }
    })

    set.mockImplementation((_ref, _status) => Promise.resolve({}))

    const { getByRole } = render(<Admin />)

    userEvent.click(getByRole('button', { name: 'toggleStatus-1' }))

    await waitFor(() => {
      expect(set).toBeCalledWith('/services/1/display-ref', false)

      expect(
        getByRole('button', { name: 'toggleStatus-1' }).children[0])
        .toHaveClass('fa-pause')
    })
  })

  it('allows the user to delete a service', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/services-ref') {
        snapshot([
          {
            key: '1',
            val() {
              return {
                display: true, name: 'ServiceA', status: 'red'
              }
            }
          }
        ])
      }
    })

    remove.mockImplementation((_ref) => Promise.resolve({}))

    global.confirm = jest.fn(() => true)

    const { getByRole } = render(<Admin />)

    userEvent.click(getByRole('button', { name: 'deleteService-1' }))

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled()
      expect(remove).toBeCalledWith('/services/1-ref')
    })
  })

  it('allows the user to create a service', async () => {
    onAuthStateChanged.mockImplementation((_auth, user) => {
      user({ email: 'admin@example.com' })
    })

    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/services-ref') {
        snapshot([])
      }
    })

    push.mockImplementation((_dbRef, _name) => {
      return { key: 1 }
    })

    set.mockImplementation((dbRef, value) => Promise.resolve({}))

    const { getByRole } = render(<Admin />)

    userEvent.click(getByRole('button', { name: 'addService' }))

    await waitFor(() => {
      getByRole('heading', { name: 'Add Service' })
    })

    userEvent.type(
      getByRole('heading', { name: 'Name' }).nextElementSibling, 'SvcA')
    userEvent.click(getByRole('radio', { name: 'Amber' }))

    userEvent.click(getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(set).toBeCalledWith(
        '/services/1-ref',
        { name: 'SvcA', status: 'amber', display: true })
    })
  })
})
