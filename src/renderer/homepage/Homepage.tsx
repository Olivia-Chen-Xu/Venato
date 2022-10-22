import React from 'react';

export default function Homepage() {
  return (
    <div>
      <input type="text" placeholder="Search" />
      <h1 className="text-center">Welcome Back _____</h1>
      <div className="flex flex-col space-y-4 border border-30 border-red-800">
        <button className="m-auto border border-blue-500">View Board 1</button>
        <button className="m-auto border border-blue-500">View Board 2</button>
        <button className="m-auto border border-blue-500">
          Create A Board
        </button>
      </div>
    </div>
  );
}
