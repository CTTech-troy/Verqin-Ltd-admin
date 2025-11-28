import React from 'react';

function BarChart({data,title}) {
  const maxCount = Math.max(...data.map(d => d.count));
  return <div>
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">{item.role}</span>
              <span className="font-medium text-gray-900">{item.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full transition-all duration-500" style={{
            width: `${item.count / maxCount * 100}%`
          }} />
            </div>
          </div>)}
      </div>
    </div>;
}
export default BarChart