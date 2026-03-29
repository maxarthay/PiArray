import Sidebar from "../components/Sidebar";
import Registration from "../components/dashboard/Registration.jsx";
import DashboardGrid from "../components/dashboard/Dashboard-grid.jsx";
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client/core';

const GET_FLEET = gql`
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

export default function DashboardPage() {
    const { loading, error, data } = useQuery(GET_FLEET);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <DashboardGrid pis={data.fleet} />
            {/* <Registration /> */}
        </>
    )
}