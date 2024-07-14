import { useEffect, useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import axios from "axios";

const Navigation = () => {
    const email = localStorage.getItem("email")
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const signOut = () => {
        localStorage.clear()
        navigate("/login")
    }
    const isUserLogging = async () => {
        const response = await axios.post("http://localhost:8000/get-user", { email })
        if (response.statusText !== 'OK') {
            return toast.error("User not found")
        }
        setUser(response.data)
    }

    useEffect(() => {
        isUserLogging()
    }, [])
    return (
        <div>
            <nav className="w-full flex items-center justify-between py-4 px-6 border-b bg-indigo-200">
                <Link to={ "/" }>
                    <h3 className="font-cursive text-2xl md:text-4xl">
                        Todo App
                    </h3>
                </Link>
                <ul className="flex gap-4 text-md md:text-xl font-medium">
                    <li className="font-bold">Hello, { user.name }</li>
                    <li>
                        <Link to={ "/profile" }>Profile</Link>
                    </li>
                    <li>
                        <button className="hover:text-red-400" onClick={ signOut }>
                            Signout
                        </button>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    )
}

export default Navigation