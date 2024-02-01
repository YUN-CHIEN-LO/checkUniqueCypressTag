/**
 * Displays duplicate information in a table based on the provided duplicates object.
 * @param {{ [key: string]: number }} duplicates - An object containing duplicate values as keys and their counts as values.
 */
function displayDuplicates(duplicates: { [key: string]: number }) {
  const tableContainer = document.getElementById("table-container");

  if (tableContainer === null) {
    return;
  }

  // Clear previous content
  tableContainer.innerHTML = "";

  if (Object.keys(duplicates).length === 0) {
    // If duplicates object is empty, show a message and hide the table container
    const messageElement = document.createElement("p");
    messageElement.textContent = "No duplicates found.";
    tableContainer.appendChild(messageElement);
  } else {
    // Create a table
    const table = document.createElement("table");
    table.border = "1";

    // Create table header
    const headerRow = table.insertRow(0);
    const headerCell1 = headerRow.insertCell(0);
    const headerCell2 = headerRow.insertCell(1);

    headerCell1.innerHTML = "Data-cy Value";
    headerCell2.innerHTML = "Count";

    // Populate the table with duplicate information
    let rowIndex = 1;
    for (const value in duplicates) {
      const row = table.insertRow(rowIndex);
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);

      cell1.innerHTML = value;
      cell2.innerHTML = duplicates[value]?.toString() ?? "-";

      rowIndex++;
    }

    // Append the table to the container
    tableContainer.appendChild(table);

    // Show the table container
    tableContainer.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const findDuplicatesButton = document.getElementById(
    "findDuplicates"
  ) as HTMLButtonElement;

  findDuplicatesButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id ?? -1;
      chrome.tabs.sendMessage(
        tabId,
        { action: "findDuplicates" },
        (response) => {
          displayDuplicates(response?.duplicates ?? {});
        }
      );
    });
  });
});
