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
      let sectionCount = 0;
      let subsectionCount = 0;
      let subSubsectionCount = 0;
      let tableCount = 0;

      const updateItemNumbers = (items) => {
        return items.map((item) => {
          switch (item.type) {
            case "section":
              sectionCount++;
              subsectionCount = 0;
              subSubsectionCount = 0;
              return {
                ...item,
                number: `${sectionCount}`,
                children: item.children ? updateItemNumbers(item.children) : [],
              };

            case "sub-section":
              subsectionCount++;
              subSubsectionCount = 0;
              return {
                ...item,
                number: `${sectionCount}.${subsectionCount}`,
                children: item.children ? updateItemNumbers(item.children) : [],
              };

            case "sub-sub-section":
              subSubsectionCount++;
              return {
                ...item,
                number: `${sectionCount}.${subsectionCount}.${subSubsectionCount}`,
                children: item.children ? updateItemNumbers(item.children) : [],
              };

            case "table":
              tableCount++;
              return { ...item, number: `${tableCount}` };

            default:
              return item; // For items that do not need special numbering
          }
        });
      };

      const updatedList = updateItemNumbers(newList);
      setList([...updatedList]);
      setUpdated(true); // Assuming you manage a state to track if updates were made
    },
    [list, setUpdated] // `setUpdated` should be included if it's a state setter function used in this context
  );

  const handleAddElement = useCallback(
    (item) => {
      const data = { ...item };
      data.id = `${item.id}-${Date.now()}`;
      data.key = randomId();
      if (data.type === "table") tableCount++;
      if (data.type === "text" || data.type === "table") {
        let index = list.length - 1;
        if (index === -1) list.push(data);
        else {
          while (index >= 0 && !list[index].children) index--;
          list[index].children.push(data);
        }
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

  useEffect(() => {
    console.log(list);
  }, [list]);

  return (
    <div className='flex gap-2 bg-gray-100 min-h-screen'>
      <Options addElement={handleAddElement} />
      <NestedVertical items={list} updateList={handleListUpdate} />
    </div>
  );
}

export default App;
