import * as XLSX from "xlsx"; // Import the xlsx library for Excel export

export const splitPerDrops = (profilesData, numberOfDrops) => {
  // Create an array to store data for each drop
  const dropsData = Array.from({ length: numberOfDrops }, () => []);

  // Distribute profiles across drops
  for (let sessionIndex in profilesData) {
    const sessionProfiles = profilesData[sessionIndex];

    sessionProfiles.forEach((profileObj, profileIndex) => {
      const dropIndex = profileIndex % numberOfDrops;
      dropsData[dropIndex].push({
        session: `Session ${parseInt(sessionIndex, 10) + 1}`,
        profile: profileObj.profile,
        tag: profileObj.tag,
      });
    });
  }

  // Generate the Excel file with the split data
  generateExcel(dropsData);
};

const generateExcel = (dropsData) => {
    const worksheet = XLSX.utils.json_to_sheet([]);
  
    // Create headers for each drop
    const headers = [];
    dropsData.forEach((_, dropIndex) => {
      headers.push(`Drop ${dropIndex + 1} Profiles`);
      headers.push(`Drop ${dropIndex + 1} Tags`);
    });
    
    // Add headers to the worksheet
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
  
    // Find the maximum number of profiles for proper row construction
    const maxProfiles = Math.max(...dropsData.map(drop => drop.length));
  
    for (let rowIndex = 0; rowIndex < maxProfiles; rowIndex++) {
      const row = [];
      dropsData.forEach(drop => {
        const profileData = drop[rowIndex] || { profile: '', tag: '' };
        row.push(profileData.profile, profileData.tag); // Push both profile and tag
      });
      XLSX.utils.sheet_add_aoa(worksheet, [row], { origin: -1 });
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profiles');
  
    // Save the Excel file
    XLSX.writeFile(workbook, 'profiles.xlsx');
  };
