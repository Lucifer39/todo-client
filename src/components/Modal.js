import React, { useContext } from "react";
import todo_context from "./context/AppContext";

const Modal = () => {
  const { setModalVisible, edit, setEdit, editNote, setEditNote } = useContext(todo_context);

  const handleCancel = () => {
    setModalVisible(false);
    setEdit(false);
    setEditNote({
      note_id: "",
      note_content: "",
      created_on: "",
      checked: false,
    });
  };

  const handleSave = () => {
    if (edit) {
      let options = {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_id: editNote.note_id,
          note_content: editNote.note_content,
          created_on: editNote.created_on,
          checked: editNote.checked,
        }),
      };

      fetch("/put/updateNote", options);
    } else {
      let d = new Date();
      let dFormat =
        d.getFullYear().toString() +
        "-" +
        (d.getMonth() + 1).toString() +
        "-" +
        d.getDate().toString();
      let options = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          note_id: editNote.note_id,
          note_content: editNote.note_content,
          created_on: dFormat,
          checked: false,
        }),
      };

      fetch("/post/uploadNotes", options);
    }

    handleCancel();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <input
          type="text"
          value={editNote.note_content}
          placeholder="Enter todo task"
          onChange={(e) =>
            setEditNote({
              note_id: editNote.note_id,
              note_content: e.target.value,
              created_on: editNote.created_on,
              checked: editNote.checked,
            })
          }
        />

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
