import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        const selectedEntity = data.find(
          (e) => e.id === parseInt(entityId, 10)
        );
        setEntity(selectedEntity);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, [entityId]);
  const parseProfiles = (data, expectedSessionCount) => {
    const lines = data.trim().split("\n");
    const profilesObject = {};
    let hasErrors = false; // Flag to track if any errors occur

    lines.forEach((line) => {
      const columns = line.split(/\s+/);
      for (let i = 0; i < columns.length; i += 2) {
        const sessionIndex = Math.floor(i / 2);

        const profile = columns[i];
        const tag = columns[i + 1];

        if (profile && tag) {
          if (!profilesObject[sessionIndex]) {
            profilesObject[sessionIndex] = [];
          }
          profilesObject[sessionIndex].push({ profile, tag });
        } else if (profile && !tag) {
          // Profile without tag
          hasErrors = true;
          toast.error(`Profile "${profile}" is missing a tag.`);
        } else if (!profile && tag) {
          // Tag without profile
          hasErrors = true;
          toast.error(`Tag "${tag}" is missing a corresponding profile.`);
        }
      }
    });

    // Clean up empty entries
    for (const key in profilesObject) {
      if (profilesObject[key].length === 0) {
        delete profilesObject[key];
      }
    }

    // Check for any invalid profiles (only integer numbers allowed)
    for (const key in profilesObject) {
      profilesObject[key].forEach(({ profile }) => {
        if (!isValidProfile(profile)) {
          hasErrors = true;
          toast.error(
            `Profile "${profile}" is not valid. It must be an integer.`
          );
        }
      });
    }

    // Validate number of sessions
    const actualSessionCount = Object.keys(profilesObject).length;
    if (actualSessionCount !== expectedSessionCount) {
      hasErrors = true;
      toast.error(
        `Number of sessions in the TXT file (${actualSessionCount}) does not match the expected count (${expectedSessionCount}) from the JSON.`
      );
    }

    console.log(profilesObject);
    return hasErrors ? null : profilesObject; // Return null if there were errors
  };

  // Function to validate profiles (must be an integer)
  const isValidProfile = (profile) => {
    const profileNumber = parseInt(profile, 10);
    return !isNaN(profileNumber) && Number.isInteger(profileNumber);
  };
  const handleFileLoad = (fileName, expectedSessionCount) => {
    fetch(`/profiles/${fileName}`)
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parseProfiles(data, expectedSessionCount);
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
          onClick={() =>
            handleFileLoad(`${entity.name}.txt`, entity.sessionNames.length)
          }
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
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-left"
                    colSpan={2}
                  >
                    {sessionName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Determine the maximum number of profiles for all sessions */}
              {Array.from({
                length: Math.max(
                  ...Object.values(profilesData).map((s) => s.length)
                ),
              }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {entity.sessionNames.map((_, sessionIndex) => {
                    const sessionProfiles = profilesData[sessionIndex] || [];
                    const profileData = sessionProfiles[rowIndex] || {
                      profile: "",
                      tag: "",
                    };

                    return (
                      <React.Fragment key={sessionIndex}>
                        <td className="border border-gray-300 p-2">
                          {profileData.profile || ""}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {profileData.tag || ""}
                        </td>
                      </React.Fragment>
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
      <ToastContainer />
    </div>
  );
}
