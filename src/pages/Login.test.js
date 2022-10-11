import Login from './Login'
import { signInWithEmailAndPassword } from 'firebase/auth';

import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn()
}));

describe('Login component', () => {
  it('requires an email', async () => {
    const props = { onSuccess: jest.fn() };
    const { getByRole } = render(<Login {...props} />)

    userEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Email required')
      expect(props.onSuccess).toBeCalledTimes(0)
    })
  })

  it('requires a password', async () => {
    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />)

    userEvent.type(getByLabelText('Email'), 'email@example.com')
    userEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Password required')
      expect(props.onSuccess).toBeCalledTimes(0)
    })
  })

  it('displays an error message when auth fails', async () => {
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.reject(new Error('Auth Error')))

    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />)

    userEvent.type(getByLabelText('Email'), 'invalid')
    userEvent.type(getByLabelText('Password'), 'invalid')
    userEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Auth Error')
      expect(props.onSuccess).toBeCalledTimes(0)
    })
  })

  it('invokes callback when auth succeeds', async () => {
    signInWithEmailAndPassword.mockImplementation(() =>
      Promise.resolve())

    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />)

    userEvent.type(getByLabelText('Email'), 'valid')
    userEvent.type(getByLabelText('Password'), 'valid')
    userEvent.click(getByRole('button'))

    await waitFor(() => {
      expect(getByRole('form')).not.toHaveTextContent('Auth Error')
      expect(props.onSuccess).toBeCalledTimes(1)
    })
  })
})
