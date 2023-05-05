import React from "react";

type TableData = {
  name: string;
  age: number;
  email: string;
};

type Props = {
  data: TableData[];
};

const ResponsiveTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="text-sm font-medium text-gray-500 uppercase border-b-2 border-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 text-sm text-gray-700"
            >
              <td className="p-2 whitespace-no-wrap">{item.name}</td>
              <td className="p-2">{item.age}</td>
              <td className="p-2">{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsiveTable;
