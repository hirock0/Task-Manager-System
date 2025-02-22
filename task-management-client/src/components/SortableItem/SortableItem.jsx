import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
const SortableItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task?._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="">
      <div
        ref={setNodeRef}
        style={style}
        { ...attributes}
        {...listeners}
        className="bg-gray-700 p-3 rounded mb-2 flex justify-between cursor-pointer"
      >
        <div>
          <h4>{task?.title}</h4>
          <p className="text-sm">{task?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
