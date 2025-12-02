import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 w-full space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-1">Welcome Librarian_123!</h1>
        <p className="text-gray-500 text-xl">
          Welcome to the library management system!
        </p>
      </header>

      <section className="grid grid-cols-1 pl-10 pr-10 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-xl p-7 flex flex-col justify-between">
          <p className="text-3xl font-bold mb-12">Total Books</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl mb-10 font-extrabold">150</span>
          </div>
        </div>

        <div className="border rounded-xl p-7 flex flex-col justify-between">
          <p className="text-3xl font-bold mb-12">Available</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl mb-10 font-extrabold">140</span>
          </div>
        </div>

        <div className="border rounded-xl p-7 flex flex-col justify-between">
          <p className="text-3xl font-bold mb-12">Check Out</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl mb-10 font-extrabold">60</span>
          </div>
        </div>

        <div className="border rounded-xl p-8 flex flex-col justify-between">
          <p className="text-3xl font-bold mb-12">Borrowers</p>
          <div className="flex items-end justify-between">
            <span className="text-5xl mb-10 font-extrabold">50</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-1">Book Status Overview</h2>
        <p className="text-lg text-gray-500 mb-3">Current inventory status</p>

        <div className="border rounded-xl p-4">
          <ol className="space-y-2 text-lg mb-6 list-decimal list-inside">
            <li className="flex items-center justify-between">
              <span>Harry Potter and the Sorcerer&apos;s Stone</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Available</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-green-500" />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Lord of the Rings</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Checked Out</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-yellow-400" />
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>The Fault in Our Stars</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Overdue</span>
                <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
              </span>
            </li>
          </ol>

          <div className="flex mt-10 flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-green-500" />
              <span>Available</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-yellow-400" />
              <span>Checked Out</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
              <span>Overdue</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
