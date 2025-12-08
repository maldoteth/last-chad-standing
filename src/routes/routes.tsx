import { isAdminAuthenticated } from "@/lib/adminAuth"
import AdminRoutes from "./adminRoutes"
import UserRoutes from "./UserRoutes"

const MainRoutes = () => {
    const isAdmin = isAdminAuthenticated()
    return (
        <>
            {isAdmin ? <AdminRoutes isAdmin={isAdmin} /> : <UserRoutes />}
        </>
    )
}

export default MainRoutes