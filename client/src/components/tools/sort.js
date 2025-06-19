export function sortArray(array, sortField, sortOrder = "asc") {
  if (!sortField) return array;

  return [...array].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // נסה להמיר למספר
    const aNumber = parseFloat(aValue);
    const bNumber = parseFloat(bValue);

    if (!isNaN(aNumber) && !isNaN(bNumber)) {
      return sortOrder === "asc" ? aNumber - bNumber : bNumber - aNumber;
    }

    // נסה להשוות כתאריכים
    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    if (!isNaN(aDate) && !isNaN(bDate)) {
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    // אם מחרוזות
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
}
