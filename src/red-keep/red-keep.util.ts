import { GraphQLClient } from 'graphql-request';
import { gql } from './gql';
import { ShowDefinitionType } from './types/show-definition.type';
import { config } from '../config';

const client = new GraphQLClient(config.ehRedKeepUrl, {
  headers: { 'api-key': config.redKeepApiKey }
});

function handleError(error: Error) {
  return Promise.reject(error);
}

export function updateShowRequest(showDef: ShowDefinitionType, awsRequestId: string) {
  const query = gql`
    mutation UpdateShow($showInput: ShowInput!) {
      showUpdate(show: $showInput) {
        id
      }
    }
  `;
  client.setHeader('request-id', awsRequestId);
  return client
    .request<{ showUpdate: ShowDefinitionType }>(query, { showInput: showDef })
    .then(result => result.showUpdate)
    .catch(handleError);
}

export function addShowRequest(showDef: ShowDefinitionType, awsRequestId: string) {
  const query = gql`
    mutation AddShow($showInput: ShowInput!) {
      showAdd(show: $showInput) {
        id
      }
    }
  `;
  client.setHeader('request-id', awsRequestId);
  return client
    .request<{ showAdd: { id: number } }>(query, { showInput: showDef })
    .then(result => result.showAdd.id)
    .catch(handleError);
}
