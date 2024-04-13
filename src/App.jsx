import { useCallback, useEffect, useState } from "react";
import "./App.css";
import NestedVertical from "./NestedVertical";
import Options from "./components/Options";

function App() {
  const [list, setList] = useState([]);

  const handleAddElement = useCallback(
    (item) => {
      const data = { ...item };
      data.id = `${item.id}-${Date.now()}`;
      setList([...list, data]);
    },
    [list]
  );

  const handleListUpdate = (newList) => {
    setList(newList);
  };

  // useEffect(() => {
  //   console.log(list);
  // }, [list]);

  return (
    <div className='flex gap-2'>
      <Options addElement={handleAddElement} />
      <NestedVertical items={list} updateList={handleListUpdate} />
    </div>
  );
}

export default App;
