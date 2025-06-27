// Helper function to generate next sequential ID
export const generateNextId = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return "1";
  
  const numericIds = dataArray
    .map(item => parseInt(item.id))
    .filter(id => !isNaN(id));
  
  if (numericIds.length === 0) return "1";
  
  return String(Math.max(...numericIds) + 1);
};

// Helper function to format data with sequential ID
export const formatDataWithId = (data, existingData) => {
  return {
    id: generateNextId(existingData),
    ...data
  };
};