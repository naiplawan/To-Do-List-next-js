"use client"
import { useState,useEffect} from "react"
import { Checkbox } from 'antd';


export default function Page() {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [{ text: "", completed: false }];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (event, index) => {
    const newTodos = [...todos];
    newTodos[index].text = event.target.value;
    setTodos(newTodos);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTodos([...todos, { text: event.target.value, completed: false }]);
      event.target.value = "";
    }
  };

  const handleDeleteToDo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleCheckboxChange = (event, index) => {
    const newTodos = [...todos];
    newTodos[index].completed = event.target.checked;
    setTodos(newTodos);
  };


  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-5xl text-center font-sans m-5">To-do-list</h1>
        <input
          className="text-center border-2 border-black rounded-md h-10 w-100 text-black"
          type="text"
          placeholder="Enter your task"
          onKeyDown={handleKeyDown}
        />
        <br />
        <p>Here is a list of things to do:</p>
        <br />
        <ul className="flex flex-col justify-center item-between">
          {Array.isArray(todos) &&
            todos.map((todo, index) => (
              <li key={index} className=" flex flex-row h-10 justify-between items-center text-red-800 text-center  m-2 px-3 bottom-3 border-2 border-black rounded-md bg-white">
                 <Checkbox
                 className="mr-2"
                  checked={todo.completed}
                  onChange={(event) => handleCheckboxChange(event, index)}
                />
                {todo.text}
                <button className="text-red-500 px-3" onClick={() => handleDeleteToDo(index)}>
                  x
                </button>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}