import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Configuration() {
  const [entities, setEntities] = useState([]);
  const navigate = useNavigate();

  // Fetch the JSON file when the component mounts
  useEffect(() => {
    fetch("/files/test.json") // Adjust path based on your project structure
      .then((response) => response.json())
      .then((data) => setEntities(data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []); // Only run once on mount, not on every state update
  const handleOpenSpliter = (entityId) => {
    navigate(`/spliter/${entityId}`); // Navigate to Spliter with the entityId
  };

  // Function to display entities in the table
  const entitiesShow = () => {
    return entities.map((entity, index) => (
      <tr key={index} className="border-b">
        <td className="py-3 px-5">{entity.name}</td>
        <td className="py-3 px-5">{entity.drops.length}</td>
        <td className="py-3 px-5">{entity.sessionNames.length}</td>
        <td className="py-3 px-5">{entity.script}</td>
        <td className="py-3 px-5">{JSON.stringify(entity.config)}</td>
        <td className="py-3 px-5">
          <button className="text-blue-600 hover:underline" onClick={()=>{handleOpenSpliter(entity.id)}}>Open Spliter</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="mt-6">
      <div className="bg-white shadow rounded-md overflow-hidden my-6 container mx-auto">
        <table className="text-left w-full border-collapse">
          <thead className="border-b">
            <tr>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Name
              </th>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Drops Number
              </th>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Sessions
              </th>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Script
              </th>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Config
              </th>
              <th className="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{entitiesShow()}</tbody>
        </table>
      </div>
    </div>
  );
}
