// drag and drop
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

export default function TestRoute() {
  const onDragEnd = (result: DropResult) => {
    console.log(result);
  };

  const items = [
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
    { id: "4", content: "Item 4" },
    { id: "5", content: "Item 5" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="fields">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div className="max-w-5xl grid grid-cols-1 gap-4">
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white shadow overflow-hidden sm:rounded-md"
                    >
                      <h3>{item.content}</h3>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
