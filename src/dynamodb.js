import { Auth } from 'aws-amplify';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  TransactWriteCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';

import './cognito'

const DYNAMODB_REGION = process.env.REACT_APP_DYNAMODB_REGION;

const UnauthenticatedUserException = new Error('Unauthenticated Error');
UnauthenticatedUserException.code = 'UnauthenticatedUserException';

const getClient = async (authRequired) => {
  const credentials = await Auth.currentUserCredentials();

  if (authRequired && !credentials.authenticated) {
    throw UnauthenticatedUserException;
  }

  const client = new DynamoDBClient({
    credentials,
    region: DYNAMODB_REGION
  });

  return DynamoDBDocumentClient.from(client)
}

const exec = async (command, authRequired = true) => {
  try {
    const client = await getClient(authRequired);
    return client.send(command)
  } catch (error) {
    throw error;
  } finally {
    if (typeof client !== 'undefined' && client !== null) {
      client.destroy();
    }
  }
}

const MESSAGES_TABLE = 'laa-portal-status-dashboard_messages';
const SERVICES_TABLE = 'laa-portal-status-dashboard_services';
const MESSAGES_INDEX = 'status-seq_num-index'

const getMessageCommand = new QueryCommand({
  TableName: MESSAGES_TABLE,
  IndexName: MESSAGES_INDEX,
  KeyConditionExpression: '#s = :status',
  ExpressionAttributeNames: { '#s': 'status' },
  ExpressionAttributeValues: { ':status': 'Active' },
  ScanIndexForward: false,
  Limit: 1
});

const getServicesCommand = new ScanCommand({
  TableName: SERVICES_TABLE,
  ConsistentRead: true,
  Limit: 25
});

const putMessageCommand = (message, username) => {
  return new PutCommand({
    TableName: MESSAGES_TABLE,
    Item: {
      seq_num: 1,
      status: 'Active',
      text: message,
      created_by: username,
    }
  });
}

const updateMessageCommand = (message, username, prev_seq) => {
  return new TransactWriteCommand({
    TransactItems: [
      {
        Update: {
          TableName: MESSAGES_TABLE,
          IndexName: MESSAGES_INDEX,
          Key: { 'seq_num': prev_seq },
          UpdateExpression: 'SET #s = :s, #ttl = :ttl',
          ConditionExpression: 'seq_num = :sn',
          ExpressionAttributeNames: { '#s': 'status', '#ttl': 'ttl' },
          ExpressionAttributeValues: {
            ':s': 'Deleted',
            ':ttl': (new Date()).setDate((new Date()).getDate() + 183),
            ':sn': prev_seq
          }
        },
      },
      {
        Put: {
          TableName: MESSAGES_TABLE,
          Item: {
            seq_num: prev_seq + 1,
            status: 'Active',
            text: message,
            created_by: username
          }
        }
      }
    ]
  })
}

const updateServiceStatusCommand = (name, status, username) => {
  return new UpdateCommand({
    TableName: SERVICES_TABLE,
    Key: { 'name': name },
    UpdateExpression: 'SET #s = :s, #ub = :ub',
    ExpressionAttributeNames: { '#s': 'status', '#ub': 'updated_by' },
    ExpressionAttributeValues: { ':s': status, ':ub': username }
  })
}

const toggleServiceDisplayCommand = (name, display, username) => {
  return new UpdateCommand({
    TableName: SERVICES_TABLE,
    Key: { 'name': name },
    UpdateExpression: 'SET #d = :d, #ub = :ub',
    ExpressionAttributeNames: { '#d': 'display', '#ub': 'updated_by' },
    ExpressionAttributeValues: { ':d': display, ':ub': username }
  })
}

const putServiceCommand = (name, status, display, username) => {
  return new PutCommand({
    TableName: SERVICES_TABLE,
    Item: {
      name: name,
      status: status,
      display: display,
      updated_by: username,
    }
  })
}

const deleteServiceCommand = name => {
  return new DeleteCommand({
    TableName: SERVICES_TABLE,
    Key: { 'name': name },
  })
}

const getMessage = async (authRequired = false) => {
  const data = await exec(getMessageCommand, authRequired);
  if (data.Count === 0) {
    return ''
  }

  return data.Items[0].text
}

const getServices = async (authRequired = false) => {
  const data = await exec(getServicesCommand, authRequired);
  return data.Items
}

const updateMessage = async (message, username) => {
  const data = await exec(getMessageCommand);
  if (data.Count === 0) {
    return exec(putMessageCommand(message, username))
  }

  const prev_seq = data.Items[0].seq_num;
  return exec(updateMessageCommand(message, username, prev_seq))
}

const updateServiceStatus = async (name, status, username) => {
  return exec(updateServiceStatusCommand(name, status, username))
}

const toggleServiceDisplay = async (name, display, username) => {
  return exec(toggleServiceDisplayCommand(name, display, username))
}

const putService = async (name, status, display, username) => {
  return exec(putServiceCommand(name, status, display, username))
}

const deleteService = async (name) => {
  return exec(deleteServiceCommand(name))
}

export {
  getMessage,
  getServices,
  putService,
  deleteService,
  updateMessage,
  updateServiceStatus,
  toggleServiceDisplay
};
