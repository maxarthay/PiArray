import { gql } from '@apollo/client/core';

export const REGISTER_PI = gql`
    mutation RegisterPi($name: String!, $ipAddress: String!, $model: String!, $group: String!) {
        registerPi(name: $name, ipAddress: $ipAddress, model: $model, groupId: $group) {
            id
            name
            ipAddress
            model
            groupId
        }
    }
`;

export const GET_FLEET = gql`
  query GetFleet {
    fleet {
      id
      name
      model
      ipAddress
      isOnline
      cpuUsage
      uptime
      currScript
    }
  }
`;