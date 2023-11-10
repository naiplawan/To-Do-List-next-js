"use client";
import { useState, useEffect } from "react";
import { Switch, Button } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export default function Page() {



  const [todos, setTodos] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTodos = localStorage.getItem("todos");
      return storedTodos ? JSON.parse(storedTodos) : [{ text: "", completed: false }];
    }
    return [{ text: "", completed: false }];
  });



useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
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

  const handleCheckboxChange = (checked, index) => {
    if (checked === undefined || checked === null) {
      return;
    }

    const newTodos = [...todos];
    newTodos[index].completed = checked;
    setTodos(newTodos);
  };

  console.log("todos array:", todos);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-orange-200 via-amber-100 to-yellow-300">
        <div className="flex flex-col justify-center items-center bg-orange-300 rounded-md p-10 ">
          <h1 className="text-5xl text-white text-center font-sans m-5 ">
            To-do-list 📝
          </h1>
          <input
            className="text-center rounded-lg h-10 w-100 text-slate-800 w-3/4 "
            type="text"
            placeholder="Enter your task"
            onKeyDown={handleKeyDown}
          />
          <br />
          <p>Here is a list of things to do:</p>
          <br />
          <ul className="flex flex-col justify-center item-between ">
            {Array.isArray(todos) &&
              todos.map((todo, index) => (
                <li
                  key={index}
                  className={`flex flex-row h-10 justify-between items-center text-red-800 text-center m-2 px-2 bottom-3  border-black rounded-md bg-white ${
                    todo.completed ? "bg-green-200" : ""
                  }`}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  <Switch
                    className="mr-2 ml-2"
                    size="medium"
                    checked={todo.completed}
                    onChange={(checked) => handleCheckboxChange(checked, index)}
                    checkedChildren={
                      <CheckOutlined style={{ color: "white" }} />
                    }
                    unCheckedChildren={
                      <CloseOutlined style={{ color: "white" }} />
                    }
                    defaultChecked
                    style={{
                      backgroundColor: todo.completed ? "green" : "red",
                    }}
                  />
                  <div className="mr-2">{todo.text}</div>
                  <Button
                    className="text-orange-700 px-3"
                    type="dash"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteToDo(index)}
                  ></Button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
