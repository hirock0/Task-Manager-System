import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSecureAxios } from "../../utils/AxiosInstance/SecureAxiosInstance";

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
  console.log(updateableTask);
  useEffect(() => {
    allTasks();
  }, []);
  return (
    <main className="min-h-screen">
      <div className="">dsfs</div>
    </main>
  );
};

export default Task_Update;
