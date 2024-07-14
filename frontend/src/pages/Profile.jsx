import { useState, useEffect } from "react"
import Input from "../components/Input"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { updatePasswordSchema, updateProfileSchema } from "../validation"

const Profile = () => {
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordErrors, setPasswordErrors] = useState({})
  console.log(user)
  const email = localStorage.getItem("email")
  const [checkBox, setCheckBox] = useState(false)
  const isUserLogging = async () => {
    const response = await axios.post("http://localhost:8000/get-user", { email })
    if (response.statusText !== 'OK') {
      return toast.error("User not found")
    }
    setUser(response.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!checkBox) {
      const result = updateProfileSchema.safeParse(user);
      if (!result.success) {
        const formattedErrors = result.error.format();
        setErrors(formattedErrors);
      } else {
        setErrors({});
        axios.post("http://localhost:8000/update-profile", { email, name: user.name, contact: user.contact }).then(() => {
          toast.success("Profile updated successfully")
        }).catch((err) =>
          toast.error(err.message)
        )
      }
    }
    else {
      const result = updatePasswordSchema.safeParse({ password, confirmPassword });

      if (!result.success) {
        const formattedErrors = result.error.format();
        setPasswordErrors(formattedErrors);
        return
      } else {
        setPasswordErrors({});
      }
      axios.patch("http://localhost:8000/change-password", { email, password, confirmPassword }).then(() => {
        toast.success("Password updated")
        setPassword("")
        setConfirmPassword("")
      }).catch(err => toast.error(err.message))
    }
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    const newUser = { ...user, [name]: value };
    setUser(newUser);
    const result = updateProfileSchema.safeParse(newUser);
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
    } else {
      setErrors({});
    }
  }

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }

    const passwordData = { password, confirmPassword, [name]: value };
    const result = updatePasswordSchema.safeParse(passwordData);

    if (!result.success) {
      const formattedErrors = result.error.format();
      setPasswordErrors(formattedErrors);
    } else {
      setPasswordErrors({});
    }
  }

  useEffect(() => {
    if (!email) {
      toast.error("Please login first")
      navigate("/login")
    }
    isUserLogging()
  }, [])

  return (
    <div className="max-w-2xl w-full mx-auto flex items-center justify-center mt-24 px-2 border shadow-xl py-8 rounded-md">
      <div className="w-full">
        <h2 className="text-5xl text-center font-semibold">Register</h2>
        <form className="mt-12 md:mt-16 max-w-sm w-full mx-auto" id="loginForm">
          <div className="columnFlex gap-y-2 w-full items-start">
            <Input type="email" value={ user.email } className={ "text-gray-600" } disabled={ true } name="email" placeholder="Email" />
            <Input type="text" value={ user.name } onChange={ handleInput } className={ errors.name ? "border-red-500" : "" } name="name" placeholder="Name" />
            { errors.name && <span className="text-red-500 font-medium text-sm">{ errors.name._errors[0] }</span> }
            <Input type="text" value={ user.contact } onChange={ handleInput } name="contact" className={ errors.contact ? "border-red-500" : "" } placeholder="Contact" />
            { errors.contact && <span className="text-red-500 font-medium text-sm">{ errors.contact._errors[0] }</span> }

            <div className="flex flex-col gap-y-2 w-full">
              <div className="flex gap-2 ml-4">
                <input checked={ checkBox } onChange={ () => setCheckBox(prev => !prev) } type="checkbox" className="w-4" id="check" />
                <label htmlFor="check" className="font-medium select-none cursor-pointer">
                  Do you want to Change Password</label>
              </div>


              <Input type="password" value={ password } onChange={ handlePasswordInput } name="password" placeholder="Password" className={ passwordErrors.password ? "border-red-400" : "" } disabled={ !checkBox } />
              { passwordErrors.password && <span className="text-red-500 font-medium text-sm">{ passwordErrors.password._errors[0] }</span> }
              <Input type="password" value={ confirmPassword } onChange={ handlePasswordInput } name="confirmPassword" placeholder="Confirm Password" className={ passwordErrors.password ? "border-red-400" : "" } disabled={ !checkBox } />
              { passwordErrors.confirmPassword && <span className="text-red-500 font-medium text-sm">{ passwordErrors.confirmPassword._errors[0] }</span> }
            </div>

            <button className="formBtn" type="submit" onClick={ handleSubmit }>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>)
}

export default Profile