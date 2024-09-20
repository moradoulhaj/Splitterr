import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Spliter() {
  const { entityId } = useParams(); // Get entityId from the route
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    // Fetch the JSON file and find the specific entity by ID
    fetch("./src/assets/files/test.json")
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
    <div className="mt-6 container mx-auto">
      <h1 className="text-xl font-bold">{entity.name}</h1>
      <div className="mt-4">
        {Array.from({ length: entity.sessions }).map((_, index) => (
          <div key={index} className="my-2">
            <label className="block text-sm font-medium text-gray-700">
              Session {index + 1}
            </label>
            <textarea
              className="mt-1 block w-full border rounded-md shadow-sm"
              rows={4}
              placeholder={`Enter profiles for Session ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
