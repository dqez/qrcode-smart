"use client";

// Mock Data (Extended for history view)
const historyData = [
  { id: 1, name: 'Portfolio Website', type: 'URL', date: '2023-12-18', scans: 45, status: 'Active' },
  { id: 2, name: 'WiFi Guest Access', type: 'WiFi', date: '2023-12-15', scans: 12, status: 'Active' },
  { id: 3, name: 'Contact Card', type: 'vCard', date: '2023-12-10', scans: 89, status: 'Active' },
  { id: 4, name: 'Product Launch Flyer', type: 'URL', date: '2023-11-28', scans: 230, status: 'Archived' },
  { id: 5, name: 'Instagram Profile', type: 'Social', date: '2023-11-15', scans: 56, status: 'Active' },
  { id: 6, name: 'Feedback Form', type: 'URL', date: '2023-11-01', scans: 12, status: 'Inactive' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">QR Code History</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Date Created</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Scans</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : item.status === 'Archived'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">{item.scans}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
