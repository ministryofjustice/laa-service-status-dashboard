import Admin from './Admin';
import { Auth } from 'aws-amplify';

import {
  getMessage,
  getServices,
  putService,
  deleteService,
  updateMessage,
  updateServiceStatus,
  toggleServiceDisplay
} from '../dynamodb';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';

global.console = {
  ...console,
  error: jest.fn()
};

jest.mock('../dynamodb', () => ({
  getMessage: jest.fn(),
  getServices: jest.fn(),
  putService: jest.fn(),
  deleteService: jest.fn(),
  updateMessage: jest.fn(),
  updateServiceStatus: jest.fn(),
  toggleServiceDisplay: jest.fn(),
}));

describe('Admin component', () => {
  it('renders the Login component when not logged in', async () => {
    Auth.currentAuthenticatedUser = jest.fn()
      .mockRejectedValue(new Error('Auth Error'));
    getServices.mockResolvedValue([]);
    getMessage.mockResolvedValue('');

    const { getByRole } = render(<Admin />);

    await waitFor(() => {
      expect(getByRole('heading')).toHaveTextContent('Login');
      expect(getByRole('form')).toBeInTheDocument();
    });
  })

  describe('when logged in', () => {
    beforeEach(() => {
      Auth.currentAuthenticatedUser = jest.fn().mockResolvedValue({
        username: 'admin@example.com'
      });

      getServices.mockResolvedValue([
        { display: true, name: 'ServiceB', status: 'red' },
        { display: false, name: 'ServiceA', status: 'green' }
      ]);
      getMessage.mockResolvedValue('test message');
    });

    it('renders the Admin component', async () => {
      const { getByText } = render(<Admin />);

      await waitFor(() => {
        expect(getByText('admin@example.com')).toBeInTheDocument();
        expect(getByText('Message')).toBeInTheDocument();
        expect(getByText('Services')).toBeInTheDocument();
      });
    });

    it('displays the status message', async () => {
      const { getByText } = render(<Admin />);

      await waitFor(() => {
        expect(getByText('test message')).toBeInTheDocument();
      });
    });

    it('displays the list of all services', async () => {
      const { getByText } = render(<Admin />);

      await waitFor(() => {
        expect(getByText('ServiceB')).toBeInTheDocument();
        expect(getByText('ServiceA')).toBeInTheDocument();
      })
    });

    it('allows the user to sign out', async () => {
      Auth.signOut = jest.fn().mockResolvedValue();

      const { findByText, getByRole } = render(<Admin />);

      fireEvent.click(await findByText('Sign out'));

      await waitFor(() => {
        expect(Auth.signOut).toBeCalledTimes(1);
      });

      await waitFor(() => {
        expect(getByRole('heading')).toHaveTextContent('Login');
        expect(getByRole('form')).toBeInTheDocument();
      });
    });

    it('allows the user to edit a message', async () => {
      const { findByRole, getByText } = render(<Admin />);

      fireEvent.click(
        await findByRole('button', { name: 'editMessage' }));

      await userEvent.type(
        await findByRole('textbox', { name: "messageInput" }),
        '...with more info');

      updateMessage.mockResolvedValue();
      getMessage.mockResolvedValue('test message...with more info');

      fireEvent.click(await findByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(updateMessage).toBeCalledWith(
          'test message...with more info', 'admin@example.com');
      })

      await waitFor(() => {
        expect(getByText('test message...with more info'))
          .toBeInTheDocument();
      })
    });

    it('allows the user to change service status', async () => {
      getServices.mockResolvedValue([
        { display: true, name: 'ServiceA', status: 'green' },
        { display: true, name: 'ServiceB', status: 'red' }
      ]);
      getMessage.mockResolvedValue('test message');

      updateServiceStatus.mockResolvedValue();

      const { getByRole, findByRole } = render(<Admin />);

      getServices.mockResolvedValue([
        { display: true, name: 'ServiceA', status: 'red' },
        { display: true, name: 'ServiceB', status: 'red' }
      ]);

      await fireEvent.click(
        await findByRole('button', { name: 'setStatus-red-0' }));

      await waitFor(() => {
        expect(updateServiceStatus)
          .toBeCalledWith('ServiceA', 'red', 'admin@example.com');
      });

      await waitFor(() => {
        expect(
          getByRole('button', { name: 'setStatus-red-0' }))
          .toHaveClass('w3-disabled');

        expect(
          getByRole('button', { name: 'setStatus-green-0' }))
          .not
          .toHaveClass('w3-disabled');
      });
    })

    it('allows the user to pause a service', async () => {
      Auth.currentAuthenticatedUser = jest.fn().mockResolvedValue({
        username: 'admin@example.com'
      });

      getServices.mockResolvedValue([
        { display: true, name: 'ServiceA', status: 'red' }
      ]);
      getMessage.mockResolvedValue('test message');

      toggleServiceDisplay.mockResolvedValue();

      const { getByRole, findByRole } = render(<Admin />);

      await fireEvent.click(
        await findByRole('button', { name: 'toggleStatus-0' }));

      await waitFor(() => {
        expect(toggleServiceDisplay)
          .toBeCalledWith('ServiceA', false, 'admin@example.com');
      });

      await waitFor(() => {
        expect(
          getByRole('button', { name: 'toggleStatus-0' }).children[0])
          .toHaveClass('fa-pause');
      });
    })

    it('allows the user to delete a service', async () => {
      getServices.mockResolvedValue([
        { display: true, name: 'ServiceA', status: 'red' }
      ]);
      getMessage.mockResolvedValue('test message');

      deleteService.mockResolvedValue();

      global.confirm = jest.fn(() => true);

      const { findByRole } = render(<Admin />);

      await fireEvent.click(
        await findByRole('button', { name: 'deleteService-0' }));

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(deleteService).toBeCalledWith('ServiceA');
      })
    })

    it('allows the user to create a service', async () => {
      getServices.mockResolvedValue([]);
      putService.mockResolvedValue();

      const { getByRole, findByRole } = render(<Admin />);

      await fireEvent.click(
        await findByRole('button', { name: 'addService' }));

      const nameInput = await getByRole('heading', { name: 'Name' })
        .nextElementSibling;
      await userEvent.type(nameInput, 'SvcA');

      await fireEvent.click(await findByRole('radio', { name: 'Amber' }));

      await fireEvent.click(await findByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(putService)
          .toBeCalledWith('SvcA', 'amber', true, 'admin@example.com');
      });
    });
  });
});
