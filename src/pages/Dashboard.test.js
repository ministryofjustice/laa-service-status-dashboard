import Dashboard from './Dashboard'
import { onValue, ref } from 'firebase/database';

import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  onValue: jest.fn(),
  ref: jest.fn()
}));

describe('Dashboard component', () => {
  it('displays a list of active services', async () => {
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
          }, {
            key: '2',
            val() {
              return {
                display: false, name: 'ServiceB', status: 'green'
              }
            }
          }
        ])
      }
    })

    const { getByText, queryByText } = render(<Dashboard />)

    await waitFor(() => {
      expect(queryByText('ServiceB')).not.toBeInTheDocument()
      expect(getByText('ServiceA')).toBeInTheDocument()
      expect(getByText('Severe Issues')).toBeInTheDocument()
    })
  })

  it('displays a status message', async () => {
    ref.mockImplementation((_database, path) => {
      return `${path}-ref`
    })

    onValue.mockImplementation((ref, snapshot) => {
      if (ref === '/message-ref') {
        snapshot({ val() { return 'test message' } })
      }
    })

    const { getByText } = render(<Dashboard />)

    expect(getByText('test message')).toBeInTheDocument()
  })
})
