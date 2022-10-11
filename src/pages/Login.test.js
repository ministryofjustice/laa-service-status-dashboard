import Login from './Login';
import { Auth } from 'aws-amplify';

import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Login component', () => {
  it('requires an email', async () => {
    const props = { onSuccess: jest.fn() };
    const { getByRole } = render(<Login {...props} />);

    userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Email required');
      expect(props.onSuccess).toBeCalledTimes(0);
    })
  })

  it('requires a password', async () => {
    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />);

    await userEvent.type(getByLabelText('Email'), 'email@example.com');
    userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Password required');
      expect(props.onSuccess).toBeCalledTimes(0);
    })
  })

  it('displays an error message when auth fails', async () => {
    Auth.signIn = jest.fn().mockRejectedValue(new Error('Auth Error'));

    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />);

    await userEvent.type(getByLabelText('Email'), 'invalid');
    await userEvent.type(getByLabelText('Password'), 'invalid');
    userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('form')).toHaveTextContent('Auth Error');
      expect(props.onSuccess).toBeCalledTimes(0);
    })
  })

  it('shows alert window when password change required', async () => {
    Auth.signIn = jest.fn().mockResolvedValue({
      challengeName: 'NEW_PASSWORD_REQUIRED'
    });

    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />);
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    await userEvent.type(getByLabelText('Email'), 'invalid');
    await userEvent.type(getByLabelText('Password'), 'invalid');
    userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledTimes(1);
      expect(props.onSuccess).toBeCalledTimes(1);
    })
  })

  it('invokes callback when auth succeeds', async () => {
    Auth.signIn = jest.fn().mockResolvedValue({ challengeName: null });

    const props = { onSuccess: jest.fn() };
    const { getByRole, getByLabelText } = render(<Login {...props} />);

    await userEvent.type(getByLabelText('Email'), 'valid');
    await userEvent.type(getByLabelText('Password'), 'valid');
    userEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(getByRole('form')).not.toHaveTextContent('Auth Error');
      expect(props.onSuccess).toBeCalledTimes(1);
    });
  });
});
