import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSecureAxios } from "../../utils/AxiosInstance/SecureAxiosInstance";
import swal from "sweetalert";
const Task_Update = () => {
  const axios = useSecureAxios();
  const [tasks, setTasks] = useState([]);
  const { id } = useParams();
  const allTasks = async () => {
    const response = await axios.get("/tasks");
    const task = await response?.data;
    setTasks(task);
  };

  const filterTask = tasks.filter((item) => item?._id === id);
  const updateableTask = filterTask[0];

  useEffect(() => {
    allTasks();
  }, []);
  const formHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const description = formData.get("description");
      const category = formData.get("category");
      const response = await axios.put(`/tasks/update/${id}`, {
        title,
        description,
        category,
      });
      if (response?.data?.success) {
        swal({
          title: response?.data?.message,
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Update Task</h2>
        <form onSubmit={formHandler} className="space-y-4">
          {/* Title */}
          <div>
            <div className=" flex items-center justify-between">
              <label className="block text-sm">Title :</label>
              <h1>{updateableTask?.title}</h1>
            </div>

            <input
              type="text"
              name="title"
              required
              placeholder="Write new title"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <div className=" flex items-center justify-between">
              <label className="block text-sm">Description :</label>
              <h1>{updateableTask?.description}</h1>
            </div>
            <textarea
              name="description"
              placeholder="Write a new description"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          {/* Category */}
          <div>
            <div className=" flex items-center justify-between">
              <label className="block text-sm">Category :</label>
              <h1>{updateableTask?.category}</h1>
            </div>
            <select
              name="category"
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
          >
            Update Task
          </button>
        </form>
      </div>
    </main>
  );
};

export default Task_Update;
