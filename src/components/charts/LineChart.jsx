import React from 'react';

function LineChart({
  data,
  title
}) {
  const maxCount = Math.max(...data.map(d => d.count));
  const height = 200;
  const width = 100;
  return <div>
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="relative" style={{
      height: `${height}px`
    }}>
        <svg className="w-full h-full">
          <polyline fill="none" stroke="#0ea5e9" strokeWidth="2" points={data.map((point, index) => {
          const x = index / (data.length - 1) * width;
          const y = height - point.count / maxCount * (height - 20);
          return `${x}%,${y}`;
        }).join(' ')} />
          {data.map((point, index) => {
          const x = index / (data.length - 1) * width;
          const y = height - point.count / maxCount * (height - 20);
          return <circle key={index} cx={`${x}%`} cy={y} r="4" fill="#0ea5e9" />;
        })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((point, index) => <span key={index}>{new Date(point.date).getDate()}</span>)}
        </div>
      </div>
    </div>;
}

export default LineChart