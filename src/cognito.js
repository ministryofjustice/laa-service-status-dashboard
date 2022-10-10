import { Amplify } from 'aws-amplify';

const {
  REACT_APP_IDENTITY_POOL_ID,
  REACT_APP_AUTH_REGION,
  REACT_APP_AUTH_USER_POOL_ID,
  REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID
} = process.env;

export const AwsCognitoConfig = {
  identityPoolId: REACT_APP_IDENTITY_POOL_ID,
  region: REACT_APP_AUTH_REGION,
  userPoolId: REACT_APP_AUTH_USER_POOL_ID,
  userPoolWebClientId: REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
  authenticationFlowType: 'USER_SRP_AUTH'
};

Amplify.configure({ Auth: AwsCognitoConfig });
