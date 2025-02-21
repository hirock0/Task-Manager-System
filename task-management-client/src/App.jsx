import { useEffect, useState } from "react";
import io from "socket.io-client";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { useSecureAxios } from "./utils/AxiosInstance/SecureAxiosInstance";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const socket = io("http://localhost:8000");

export default function App() {
  const axios = useSecureAxios();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const categories = ["To-Do", "In Progress", "Done"];

  useEffect(() => {
    axios.get("/tasks").then((res) =>
      setTasks([
        ...res.data,
        {
          _id: "67b8792a60bbccc9192b4653",
          title: "Default",
          description: "This is a default task",
          category: "To-Do",
          order: 1,
        },
        {
          _id: "67b8792a60bbccc9192b4652",
          title: "Default",
          description: "This is a default task",
          category: "In Progress",
          order: 1,
        },
        {
          _id: "67b8792a60bbccc9192b4651",
          title: "Default",
          description: "This is a default task",
          category: "Done",
          order: 1,
        },
      ])
    );
    socket.on("updateTasks", (updatedTasks) => setTasks(updatedTasks));
    return () => socket.off("updateTasks");
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    const newTaskData = {
      title: newTask,
      description: newDescription,
      category: "To-Do",
    };
    await axios.post("/tasks", newTaskData);
    setNewTask("");
    setNewDescription("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`/tasks/${id}`);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const updatedTasks = [...tasks];
    const oldIndex = updatedTasks.findIndex((t) => t._id === active.id);
    const newIndex = updatedTasks.findIndex((t) => t._id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const movedTask = updatedTasks[oldIndex];
      movedTask.category = updatedTasks[newIndex].category;
      updatedTasks.splice(oldIndex, 1);
      updatedTasks.splice(newIndex, 0, movedTask);
    }

    setTasks(updatedTasks);
    await axios.put("/tasks/reorder", { updatedTasks });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Task Manager</h1>
      <div className="flex justify-center space-x-2 mb-4">
        <input
          type="text"
          className="p-2 rounded bg-gray-800"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="text"
          className="p-2 rounded bg-gray-800"
          placeholder="Description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <SortableContext
              key={category}
              items={tasks
                .filter((task) => task.category === category)
                .map((task) => task._id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="bg-gray-800 p-4 rounded min-h-[300px]"
                ref={(el) => el && (el.dataset.category = category)} // Store category
                data-category={category} // Ensure category recognition
              >
                <h2 className="text-xl font-bold mb-2">{category}</h2>
                {tasks
                  .filter((task) => task.category === category)
                  .map((task) => (
                    <SortableItem
                      key={task._id}
                      task={task}
                      deleteTask={deleteTask}
                    />
                  ))}
              </div>
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function SortableItem({ task, deleteTask }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-gray-700 p-3 rounded mb-2 flex justify-between cursor-pointer"
      >
        <div>
          <h4>{task.title}</h4>
          <p className="text-sm">{task.description}</p>
        </div>
        <button
          onClick={() => deleteTask(task._id)}
          className="text-red-400 hover:text-red-600"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
