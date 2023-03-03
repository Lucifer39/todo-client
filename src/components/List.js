import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdDeleteOutline, MdDragIndicator, MdOutlineEdit } from "react-icons/md";

import todo_context from "./context/AppContext";

const List = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState([]);
  const [filter, setFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { setModalVisible, setEdit, setEditNote } = useContext(todo_context);

  useEffect(() => {
    fetch("/get/todoList")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((info) => {
        setData(info);
      });

    fetch("/get/order")
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((orderSet) => {
        console.log(orderSet[0].note_order);
        setOrder(orderSet[0].note_order);
      });
  }, []);

  useEffect(() => {
    const urlData = filter
      ? `/get/todoList?filter=true&startDate=${startDate}&endDate=${endDate}`
      : "/get/todoList";

    const id = setInterval(() => {
      fetch(urlData)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((info) => {
          setData(info);
        });

      fetch("/get/order")
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((orderSet) => {
          console.log(orderSet[0].note_order);
          setOrder(orderSet[0].note_order);
        });
    }, 1000);

    return () => clearInterval(id);
  }, [order, data, startDate, endDate]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(order);
    newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, order[result.source.index]);

    setOrder(newOrder);
    console.log(newOrder);

    let options = {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ note_order: newOrder }),
    };

    console.log(options);

    fetch("/put/note_order", options);
  };

  const handleNew = () => {
    setModalVisible(true);
    setEdit(false);
    setEditNote({
      note_id: "",
      note_content: "",
      created_on: "",
      checked: false,
    });
  };

  const handleCheck = (item) => {
    let options = {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: item.note_id,
        note_content: item.note_content,
        created_on: item.created_on,
        checked: !item.checked,
      }),
    };

    fetch("/put/updateNote", options);
  };

  const handleDelete = (note) => {
    let options = {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    };

    fetch(`/delete/deleteNote?note_id=${note}`, options);
  };

  const handleEdit = (item) => {
    setModalVisible(true);
    setEdit(true);
    setEditNote({
      ...item,
    });
  };

  const handleFilter = () => {
    fetch(`/get/todoList?filter=true&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((info) => {
        setFilter(true);
        setData(info);
      });
  };

  const handleClear = () => {
    setFilter(false);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="list">
      <div className="list-head">
        List
        <button onClick={handleNew}>Add new +</button>
      </div>
      <div className="list-filter">
        Filter:{" "}
        <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} /> -{" "}
        <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />{" "}
        <button className="todo-filter-button" onClick={handleFilter}>
          Submit
        </button>
        <button className="todo-clear-filter" onClick={handleClear}>
          Clear Filter
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="list">
          {(provided, snapshot) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ backgroundColor: snapshot.isDraggingOver ? "#eee" : "transparent" }}
            >
              {!data ? (
                <p>No data found</p>
              ) : (
                data.map((item, index) => (
                  <Draggable key={item.note_id} draggableId={item.note_id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          backgroundColor: snapshot.isDragging ? "#ccc" : "transparent",
                        }}
                      >
                        <div className="todo-list">
                          <div className="todo-list-content">
                            <MdDragIndicator />
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => handleCheck(item)}
                            />
                            <span
                              className={
                                item.checked
                                  ? "todo-list-content-checked"
                                  : "todo-list-content-unchecked"
                              }
                            >
                              {item.note_content}
                            </span>
                          </div>
                          <span className="todo-list-icons">
                            <MdDeleteOutline
                              className="todo-list-delete"
                              onClick={() => handleDelete(item.note_id)}
                            />
                            <MdOutlineEdit
                              className="todo-list-edit"
                              onClick={() => handleEdit(item)}
                            />
                          </span>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default List;
