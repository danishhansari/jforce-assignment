import { useState } from "react"
import Input from "../components/Input"
import { registerSchema } from "../validation"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})

    const [register, setRegister] = useState({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
    })
    const handleRegister = async (e) => {
        e.preventDefault()

        console.log(register)
        const result = registerSchema.safeParse(register)
        if (!result.success) {
            const formattedErrors = result.error.format();
            console.log(formattedErrors)
            setErrors(formattedErrors);
        } else {
            axios.post("http://localhost:8000/register", register).then(({ data }) => {
                localStorage.setItem("email", data.email)
                navigate("/")
                toast.success("Register successful")
            }).catch(err => {
                toast.error(err.response.data.message)
            })
        }
    }
    const handleInput = (e) => {
        const value = e.target.value;
        const target = e.target.name;

        setRegister((prev) => {
            const newLogin = { ...prev, [target]: value };

            // Validate the updated login object
            const result = registerSchema.safeParse(newLogin);

            if (!result.success) {
                const formattedErrors = result.error.format();
                setErrors(formattedErrors);
            } else {
                setErrors({});
            }

            return newLogin;
        });
    }


    
    return (
        <div className="max-w-2xl w-full mx-auto flex items-center justify-center mt-24 border shadow-xl rounded-md py-4 px-4">
            <div className="w-full">
                <h2 className="text-5xl text-center font-semibold">Register</h2>
                <form className="mt-8 md:mt-12 max-w-md w-full mx-auto" id="loginForm">
                    <div className="columnFlex gap-y-4 w-full">
                        <div className="w-full flex flex-col">
                            <Input onChange={ handleInput } type="text" name="name" value={ register.name } placeholder="Name" className={ `${errors.name ? "border border-red-500" : ""}` } />
                            { errors.name && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.name._errors[0] }</span> }
                        </div>
                        <div className="w-full flex flex-col">
                            <Input onChange={ handleInput } type="email" name="email" value={ register.email } placeholder="Email" className={ `${errors.email ? "border border-red-500" : ""}` } />
                            { errors.email && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.email._errors[0] }</span> }
                        </div>
                        <div className="w-full flex flex-col">
                            <Input onChange={ handleInput } type="text" name="contact" value={ register.contact } className={ `${errors.contact ? "border  border-red-500" : ""}` } placeholder="Contact" />
                            { errors.contact && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.contact._errors[0] }</span> }
                        </div>
                        <div className="w-full flex flex-col">
                            <Input onChange={ handleInput } type="password" value={ register.password } name="password" placeholder="Password" className={ `${errors.password ? "border border-red-500" : ""}` } />
                            { errors.password && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.password._errors[0] }</span> }
                        </div>
                        <div className="w-full flex flex-col">
                            <Input onChange={ handleInput } type="password" name="confirmPassword" value={ register.confirmPassword } placeholder="Confirm Password" className={ `${errors.confirmPassword ? "border border-red-500" : ""}` } />
                            { errors.confirmPassword && <span className="text-red-500 font-medium ml-2 text-sm">{ errors.confirmPassword._errors[0] }</span> }

                        </div>
                        <button className="formBtn" type="submit" onClick={ handleRegister }>
                            Register
                        </button>
                        <p className="font-medium">
                            Already have an account <button className="underline text-blue-600" onClick={ () => navigate("/login") }>Login</button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register