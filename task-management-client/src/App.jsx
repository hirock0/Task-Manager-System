import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { useSecureAxios } from "./utils/AxiosInstance/SecureAxiosInstance";
import SortableItem from "./components/SortableItem/SortableItem";
import swal from "sweetalert";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function App() {
  const axios = useSecureAxios();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const categories = ["To-Do", "In Progress", "Done", "Delete"];
  const [loading, setLoading] = useState(false);
  const AllTasks = async () => {
    try {
      const response = await axios.get("/tasks");
      const task = await response?.data;
      setTasks([
        ...task,
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
        {
          _id: "67b8792a60bbccc9192b4655",
          title: "Drag to Delete",
          description: "Delete your task",
          category: "Delete",
          order: 1,
        },
      ]);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    AllTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return;
    const newTaskData = {
      title: newTask,
      description: newDescription,
      category: "To-Do",
    };
    setTasks([newTaskData, ...tasks]);
    const response = await axios.post("/tasks", newTaskData);
    if (response?.data?.success) {
      swal({
        title: response?.data?.message,
        icon: "success",
      });
      setNewTask("");
      setNewDescription("");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleDragEnd = async (event) => {
    setLoading(true);
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

    const updateresponsive = await axios.put("/tasks/reorder", {
      updatedTasks,
    });
    if (updateresponsive?.data?.success) {
      setLoading(false);
    }

    if (over?.id === "67b8792a60bbccc9192b4655") {
      const response = await axios.delete(`/tasks/${active?.id}`);
      if (response?.data?.success) {
        swal({
          title: response?.data?.message,
          icon: "success",
          buttons: "ok",
        });
        setLoading(false);
        // Update state after successful deletion
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task?._id !== active?.id)
        );
      }
    }
  };

  return (
    <main className="relative">
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
        <div className=" ">
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-3 gap-4 overflow-hidden">
              {categories.map((category) => (
                <SortableContext
                  key={category}
                  items={tasks
                    .filter((task) => task.category === category)
                    .map((task) => task?._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {category !== "Delete" ? (
                    <div
                      className="bg-gray-800 p-4 rounded min-h-[300px]"
                      ref={(el) => el && (el.dataset.category = category)} // Store category
                      data-category={category} // Ensure category recognition
                    >
                      <h2 className="text-xl font-bold mb-2">{category}</h2>
                      {tasks
                        .filter((task) => task.category === category)
                        .map((task, index) => (
                          <SortableItem key={index} task={task} />
                        ))}
                    </div>
                  ) : (
                    <div className=" fixed bottom-0 right-0 col-span-3">
                      <div
                        className="bg-gray-600 hover:bg-slate-400 p-4 rounded "
                        ref={(el) => el && (el.dataset.category = category)} // Store category
                        data-category={category} // Ensure category recognition
                      >
                        {tasks
                          .filter((task) => task.category === category)
                          .map((task, index) => (
                            <SortableItem key={index} task={task} />
                          ))}
                      </div>
                    </div>
                  )}
                </SortableContext>
              ))}
            </div>
          </DndContext>
        </div>
      </div>

      <div
        className={`${
          !loading && "hidden"
        } fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-slate-800/80`}
      >
        <div className=" flex flex-col items-center">
          <h1 className=" text-white">Please Wait...</h1>
          <div className=" mt-5 loading loading-spinner loading-md bg-cyan-600"></div>
        </div>
      </div>
    </main>
  );
}
