export const filterBySearchTerm = (dataArray, searchTerm, fields = [], transformFn = (value) => value) => {
    const term = searchTerm.toLowerCase();
  
    return dataArray.filter((item) => {
      return fields.some((field) => {
        const value = item?.[field];
        return transformFn(value)?.toString().toLowerCase().includes(term);
      });
    });
  };
  