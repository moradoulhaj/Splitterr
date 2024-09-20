import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Spliter() {
  const { entityId } = useParams(); // Get entityId from the route
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    // Fetch the JSON file and find the specific entity by ID
    fetch("/files/test.json")
      .then((response) => response.json())
      .then((data) => {
        const selectedEntity = data.find((e) => e.id === parseInt(entityId, 10));
        setEntity(selectedEntity);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, [entityId]);

  if (!entity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6 container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Entity name and Import button in a flex container */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">{entity.name}</h1>
        {/* Import Profiles Button */}
        <button className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow hover:bg-gray-400">
          Import Profiles from TXT File
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamically render session names */}
        {entity.sessionNames.map((sessionName, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-lg font-semibold text-gray-800">
              {sessionName}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              rows={4}
              placeholder={`Enter profiles for ${sessionName}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500">
          Save
        </button>
      </div>
    </div>
  );
}
