import { useCallback, useEffect, useState } from "react";
import "./App.css";
import NestedVertical from "./NestedVertical";
import Options from "./components/Options";
import { randomId } from "./utils/math";

function App() {
  const [list, setList] = useState([]);
  const [updated, setUpdated] = useState(false);
  let sectionCount = 0;
  let subsectionCount = 0;
  let subSubsectionCount = 0;
  let tableCount = 0;

  const updateNumbering = useCallback(
    (newList = list) => {
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
        } else if (item.type === "table") {
          tableCount++;
          return {
            ...item,
            number: `${tableCount}`,
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
      data.key = randomId();
      if (data.type === "text" || data.type === "table") {
        if (list.length > 0 && list[list.length - 1].children)
          list[list.length - 1].children.push(data);
        else list.push(data);
        setList([...list]);
      } else {
        setList([...list, data]);
      }
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

  // useEffect(() => {
  //   console.log(list);
  // }, [list]);

  return (
    <div className='flex gap-2 bg-gray-100 min-h-screen'>
      <Options addElement={handleAddElement} />
      <NestedVertical items={list} updateList={handleListUpdate} />
    </div>
  );
}

export default App;
