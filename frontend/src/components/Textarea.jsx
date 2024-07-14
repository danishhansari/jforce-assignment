import { useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { toast } from "react-hot-toast"
import { IoMdClose } from "react-icons/io";

function Textarea({ setActivePortal, selectedDate, setTodo }) {
    const [value, setValue] = useState("")
    const email = localStorage.getItem("email")
    const [error, setError] = useState(false)
    const postTodo = async (e) => {
        e.preventDefault()
        if (!value.length) {
            setError(true)
            return
        }
        const response = await axios.post("http://localhost:8000/todo", { todo: value, email, date: selectedDate })
        if (response.statusText !== "OK") {
            return toast.error("Error while Posting Todo")
        }
        setValue("")
        const data = response.data
        console.log(data)
        setTodo((prev) => ([data, ...prev]))
        return toast.success("Todo posted")
    }
    return createPortal(
        <>
            <div className='absolute z-10 right-1/2 -translate-x-[-50%] md:right-0 md:-translate-x-0 md:bottom-48 w-full max-w-xl bg-indigo-200 px-4 py-12 rounded-md'>
                <form>
                    <textarea name="todo" id="todo" placeholder="Enter a Todo" className={ `w-full h-36 p-2 outline-none border rounded-md resize-none ${error ? "border-red-500 border-2" : ""}` } value={ value } onChange={ (e) => setValue(e.target.value) }></textarea>
                    { error && <p className='text-red-500'>Please add something</p> }
                    <button className="btnPrimary text-sm px-2 py-2 rounded-md" onClick={ postTodo }>Post Todo</button>
                </form>
                <button onClick={ () => setActivePortal(prev => !prev) } className='absolute right-0 top-0'>
                    <IoMdClose size={ 25 } />
                </button>
            </div>
        </>, document.getElementById("root")
    )
}

export default Textarea