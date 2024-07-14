import { useState } from "react"
import Input from "../components/Input"
import { loginSchema } from "../validation"
import axios from 'axios'
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
const Login = () => {
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const [login, setLogin] = useState({
        email: "",
        password: "",
    })

    const handleLogin = async (e) => {
        e.preventDefault()

        const result = loginSchema.safeParse(login)
        if (!result.success) {
            const formattedErrors = result.error.format();
            console.log(formattedErrors)
            setErrors(formattedErrors);
        } else {
            axios.post("http://localhost:8000/login", login).then(({ data }) => {
                localStorage.setItem("email", data.email)
                navigate("/")
                return toast.success("Login successful")
            }).catch((err) => {
                toast.error(err.response.data.message)
            })
        }
    }

    const handleChange = (e) => {
        const target = e.target.name;
        const value = e.target.value;

        // Update login state
        setLogin((prev) => {
            const newLogin = { ...prev, [target]: value };

            // Validate the updated login object
            const result = loginSchema.safeParse(newLogin);

            if (!result.success) {
                const formattedErrors = result.error.format();
                setErrors(formattedErrors);
            } else {
                // Clear errors if validation is successful
                setErrors({});
            }

            return newLogin;
        });
    }
    return (
        <div className="max-w-2xl w-full mx-auto flex items-center justify-center mt-24 px-4">
            <div className="w-full">
                <h2 className="text-5xl text-center font-semibold">Login</h2>

                <form className="mt-8 md:mt-12 max-w-md w-full mx-auto" id="loginForm">
                    <div className="columnFlex gap-y-4 w-full">

                        <div className="w-full">
                            <Input onChange={ handleChange } value={ login.email } type="email" name="email" placeholder="Email" className={ `${errors.email ? "border border-red-400" : ""}` } />
                            { errors.email && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.email._errors[0] }</span> }
                        </div>
                        <div className="w-full">
                            <Input onChange={ handleChange } type="password" value={ login.password } name="password" placeholder="Password" className={ errors.email ? "border border-red-400" : "" } />
                            { errors.password && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.password._errors[0] }</span> }
                        </div>


                        <button className="formBtn" type="submit" onClick={ handleLogin }>
                            Login
                        </button>
                        <p className="font-medium">
                            Don't have an account <button className="underline text-blue-600" onClick={ () => navigate("/register") }>Register</button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login