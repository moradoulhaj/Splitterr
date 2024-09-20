import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Spliter() {
  const { entityId } = useParams(); // Get entityId from the route
  const [entity, setEntity] = useState(null);
  const [profilesData, setProfilesData] = useState(null);
  const [showTable, setShowTable] = useState(false);

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
  const parseProfiles = (data) => {
    const lines = data.trim().split('\n');
    const profilesObject = {};
  
    lines.forEach(line => {
      const columns = line.split(/\s+/);
      for (let i = 0; i < columns.length; i += 2) {
        const sessionIndex = Math.floor(i / 2);
  
        // Ensure we have both profile and tag
        if (columns[i] && columns[i + 1]) {
          const profile = columns[i];
          const tag = columns[i + 1];
  
          if (!profilesObject[sessionIndex]) {
            profilesObject[sessionIndex] = [];
          }
          profilesObject[sessionIndex].push({ profile, tag });
        }
      }
    });
  
    // Clean up empty entries
    for (const key in profilesObject) {
      if (profilesObject[key].length === 0) {
        delete profilesObject[key];
      }
    }
  
    console.log(profilesObject);
    return profilesObject;
  };
  

  const handleFileLoad = (fileName) => {
    fetch(`/profiles/${fileName}`)
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parseProfiles(data);
        setProfilesData(parsedData);
        setShowTable(true);
      })
      .catch((error) => console.error("Error loading TXT file:", error));
  };

  if (!entity) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-6 container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-700">{entity.name}</h1>
        <button
          onClick={() => handleFileLoad(`${entity.name}.txt`)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500"
        >
          Import Profiles from TXT File
        </button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
      
      {showTable && profilesData && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {entity.sessionNames.map((sessionName, index) => (
                  <th key={index} className="border border-gray-300 p-2">
                    {sessionName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Determine the maximum number of profiles for all sessions */}
              {Array.from({ length: Math.max(...Object.values(profilesData).map(s => s.length)) }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {entity.sessionNames.map((_, sessionIndex) => {
                    const sessionProfiles = profilesData[sessionIndex] || [];
                    const profileData = sessionProfiles[rowIndex] || { profile: '', tag: '' };
                    return (
                      <td key={sessionIndex} className="border border-gray-300 p-2">
                        {profileData.profile ? `${profileData.profile} ${profileData.tag}` : ''}
                      </td>
                      
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8">
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500">
          Save
        </button>
      </div>
    </div>
  );
}
