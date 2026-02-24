import React from 'react';

const Table = ({ headers, data, renderRow, emptyMessage = "No data available." }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
            <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
                <thead>
                    <tr className="text-left">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="bg-farm-50 sticky top-0 border-b border-farm-200 px-6 py-3 text-farm-800 font-bold tracking-wider uppercase text-xs"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => renderRow(item, index))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
