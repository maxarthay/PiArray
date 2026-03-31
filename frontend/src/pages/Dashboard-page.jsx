import Registration from "../components/dashboard/Registration.jsx";
import DashboardGrid from "../components/dashboard/Dashboard-grid.jsx";
import { useQuery } from '@apollo/client/react';
import { GET_FLEET, GET_GROUPS } from '../components/queries';

export default function DashboardPage() {
    const { loading, error, data } = useQuery(GET_FLEET);
    const { data: groupsData } = useQuery(GET_GROUPS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <DashboardGrid pis={data.fleet} groups={groupsData?.groups || []} />
        </>
    )
}