import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { format } from "date-fns"
import Textarea from "../components/Textarea"

const Home = () => {
  const navigate = useNavigate()
  const email = localStorage.getItem("email")
  const [todo, setTodo] = useState([])
  const [doneTodo, setDoneTodo] = useState([])
  const [active, setActive] = useState(true)
  const formatedDate = format(new Date(), "dd/MM/yyyy")
  const [selectedDate, setSelectedDate] = useState(formatedDate)
  const [activePortal, setActivePortal] = useState(false)
  console.log(selectedDate)
  const userTodos = async () => {
    const response = await axios.post("http://localhost:8000/get-todo", { email })
    const finishTodo = response.data.filter((item) => item.isFinish === true)
    const notFinishTodo = response.data.filter((item) => item.isFinish !== true)
    setTodo([...notFinishTodo])
    setDoneTodo([...finishTodo])
    console.log(doneTodo)
  }

  const handleDataChange = (e) => {
    setSelectedDate(format(e.target.value, "dd/MM/yyyy"))
    console.log(selectedDate)
  }

  const finishTodo = async (id) => {
    console.log(id)
    const response = await axios.post("http://localhost:8000/todo-finish", { id })
    if (response.statusText !== "OK") {
      return toast.error("Error occuered")
    }
    userTodos()
    toast.success("Todo finished")
  }

  useEffect(() => {
    if (!email) {
      toast.error("Please login first")
      navigate("/login")
    }
    userTodos()
  }, [])

  return (
    <div className="max-w-7xl w-full mx-auto px-4">
      <div className="fixed right-0 bottom-0 flex w-full text-xl bg-indigo-500 items-center py-4">
        <div className="w-full flex items-center justify-center">
          <button onClick={ () => setActive(prev => !prev) } className={ `${active ? "font-semibold text-white" : ""}` }>Todos</button>
        </div>
        <div className="w-full flex items-center justify-center">
          <button onClick={ () => setActive(prev => !prev) } className={ `${!active ? "font-semibold text-white" : ""}` }>Finish Todos</button>
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <div className="absolute right-8 top-20 md:top-32">
          <input id="date" onChange={ handleDataChange } value={ selectedDate } className="outline-none text-3xl" placeholder="" type="date" />
        </div>
      </div>

      <button className="fixed bottom-28 right-8 bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 font-medium" onClick={ () => setActivePortal(prev => !prev) }>Add todo</button>

      {
        activePortal && <Textarea setActivePortal={ setActivePortal } selectedDate={ selectedDate } setTodo={ setTodo } />
      }

      <div className="todos mt-2">
        <div className={ `${active ? "grid" : "hidden"} grid-cols-2 md:grid-cols-4 gap-4` }>
          {
            todo.map((item, index) => {
              return <div className="w-full bg-gray-200 px-4 rounded-sm py-2" key={ item._id }>
                <p className="text-right mt-[-6px]">{ item.date }</p>
                <p>{ item.todo }</p>
                {
                  !item.isFinish &&
                  <button onClick={ () => finishTodo(item._id) } className="btnPrimary py-1 px-2 text-sm rounded-md mt-2">Finished</button>
                }
                { item.isFinish && <button className="btnPrimary py-1 px-2 text-sm rounded-md mt-2 bg-black/80" disabled>Done</button> }
              </div>
            }
            )
          }
        </div>


        <div className={ `${!active ? "grid" : "hidden"} grid-cols-2  md:grid-cols-4 gap-4` }>
          {
            doneTodo.map((item, index) => {
              return <div className="w-full bg-gray-200 px-4 rounded-sm py-2" key={ item._id }>
                <p className="text-right mt-[-6px]">{ item.date }</p>
                <p>{ item.todo }</p>
                {
                  !item.isFinish &&
                  <button onClick={ () => finishTodo(item._id) } className="btnPrimary py-1 px-2 text-sm rounded-md mt-2">Finished</button>
                }
                { item.isFinish && <button className="btnPrimary py-1 px-2 text-sm rounded-md mt-2 bg-black/80" disabled>Done</button> }
              </div>
            }
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Home
