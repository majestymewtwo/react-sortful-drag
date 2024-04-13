import { useCallback, useEffect, useState } from "react";
import "./App.css";
import NestedVertical from "./NestedVertical";
import Options from "./components/Options";

function App() {
  const [list, setList] = useState([]);
  const [updated, setUpdated] = useState(false);

  const updateNumbering = useCallback(
    (newList = list) => {
      let sectionCount = 0;
      let subsectionCount = 0;
      let subSubsectionCount = 0;

      const updatedList = newList.map((item) => {
        if (item.type === "section") {
          sectionCount++;
          subsectionCount = 0;
          subSubsectionCount = 0;
          return { ...item, number: `${sectionCount}` };
        } else if (item.type === "sub-section") {
          subsectionCount++;
          subSubsectionCount = 0;
          return { ...item, number: `${sectionCount}.${subsectionCount}` };
        } else if (item.type === "sub-sub-section") {
          subSubsectionCount++;
          return {
            ...item,
            number: `${sectionCount}.${subsectionCount}.${subSubsectionCount}`,
          };
        } else {
          return { ...item, number: "" };
        }
      });
      setList([...updatedList]);
      setUpdated(true);
    },
    [list, updated]
  );

  const handleAddElement = useCallback(
    (item) => {
      const data = { ...item };
      data.id = `${item.id}-${Date.now()}`;
      setList([...list, data]);
      setUpdated(false);
    },
    [list, updated]
  );

  const handleListUpdate = (newList) => {
    updateNumbering(newList);
  };

  useEffect(() => {
    if (!updated) {
      updateNumbering();
    }
  }, [list, updated]);

  return (
    <div className='flex gap-2'>
      <Options addElement={handleAddElement} />
      <NestedVertical items={list} updateList={handleListUpdate} />
    </div>
  );
}

export default App;
