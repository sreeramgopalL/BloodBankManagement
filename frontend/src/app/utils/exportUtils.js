/**
 * Exports JSON data to a CSV file and triggers a browser download.
 * @param {Array} data - The array of objects to export.
 * @param {string} fileName - The desired name of the CSV file.
 */
export const exportToCSV = (data, fileName) => {
    if (!data || !data.length) {
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // header row
        ...data.map(row =>
            headers.map(fieldName => {
                const value = row[fieldName] !== undefined && row[fieldName] !== null ? row[fieldName] : '';
                // Escape quotes and wrap in quotes if it contains commas
                const escaped = ('' + value).replace(/"/g, '""');
                return escaped.includes(',') ? `"${escaped}"` : escaped;
            }).join(',')
        )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
