import Sidebar from "../components/Sidebar";
import Registration from "../components/Registration.jsx";

export default function DashboardPage() {
    return (
        <>
            <Sidebar />
            <div>
                <h1>Dashboard</h1>
            </div>
            <Registration />
        </>
    )
}