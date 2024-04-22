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
  let figureCount = 0;
  let equationCount = 0;

  const updateNumbering = useCallback(
    (newList = list) => {
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

            case "figure":
              figureCount++;
              return { ...item, number: `${figureCount}` };
            case "equation":
              equationCount++;
              return { ...item, number: `${equationCount}` };

            default:
              return item;
          }
        });
      };

      const updatedList = updateItemNumbers(newList);
      setList([...updatedList]);
      setUpdated(true);
    },
    [list, setUpdated]
  );

  const handleAddElement = useCallback(
    (item) => {
      const data = { ...item };
      data.id = `${item.id}-${Date.now()}`;
      data.key = randomId();
      if (data.type === "table") tableCount++;
      if (
        data.type === "text" ||
        data.type === "table" ||
        data.type === "figure" ||
        data.type === "equation"
      ) {
        let index = list.length - 1;
        if (index === -1) list.push(data);
        else {
          while (index > 0 && !list[index].children) index--;
          if (list[index].children) list[index].children.push(data);
          else list.splice(list.length - 1, 0, data);
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
    setUpdated(false);
    setList(newList);
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
