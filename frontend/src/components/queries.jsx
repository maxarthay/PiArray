import { gql } from '@apollo/client/core';

export const REGISTER_PI = gql`
    mutation RegisterPi($name: String!, $ipAddress: String!, $model: String!, $groupId: ID) {
        registerPi(name: $name, ipAddress: $ipAddress, model: $model, groupId: $groupId) {
            id
            name
            ipAddress
            model
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
      groupName
      positionX
      positionY
    }
  }
`;

export const UPDATE_PI_POSITION = gql`
  mutation UpdatePiPosition($id: ID!, $positionX: Float!, $positionY: Float!) {
    updatePiPosition(id: $id, positionX: $positionX, positionY: $positionY) {
      id
      positionX
      positionY
    }
  }
`;

export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      name
    }
  }
`;