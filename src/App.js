import React, { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import VisualData from "./components/VisualData";
import List from "./components/List";
import Modal from "./components/Modal";

import todo_context from "./components/context/AppContext";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [edit, setEdit] = useState(false);
  const [editNote, setEditNote] = useState({
    note_id: "",
    note_content: "",
    created_on: "",
    checked: false,
  });

  return (
    <todo_context.Provider
      value={{
        modalVisible,
        setModalVisible,
        modalContent,
        setModalContent,
        edit,
        setEdit,
        editNote,
        setEditNote,
      }}
    >
      {modalVisible && <Modal />}

      <Navbar />
      <VisualData />
      <List />
    </todo_context.Provider>
  );
}

export default App;
