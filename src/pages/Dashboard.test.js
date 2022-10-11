import Dashboard from './Dashboard';
import { Auth } from 'aws-amplify';

import { getMessage, getServices } from '../dynamodb';

import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

global.console = {
  ...console,
  error: jest.fn()
};

jest.mock('../dynamodb', () => ({
  getMessage: jest.fn(),
  getServices: jest.fn()
}));

beforeEach(() => {
  Auth.currentAuthenticatedUser = jest.fn().mockResolvedValue({
    username: 'admin@example.com'
  });

  getServices.mockResolvedValue([
    { display: false, name: 'ServiceA', status: 'green' },
    { display: true, name: 'ServiceB', status: 'red' }
  ]);
  getMessage.mockResolvedValue('test message');
});

describe('Dashboard component', () => {
  it('displays the list of active services', async () => {
    const { getByText, queryByText } = render(<Dashboard />);

    await waitFor(() => {
      expect(queryByText('ServiceA')).not.toBeInTheDocument();
      expect(getByText('ServiceB')).toBeInTheDocument();
      expect(getByText('Severe Issues')).toBeInTheDocument();
    })
  })

  it('displays a status message', async () => {
    const { getByText } = render(<Dashboard />);

    await waitFor(() => {
      expect(getByText('test message')).toBeInTheDocument();
    });
  });
});
