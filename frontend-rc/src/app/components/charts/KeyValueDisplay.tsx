import React from 'react';

interface KeyValueDisplayProps {
  title: string;
  value: number | string;
  className?: string;
  icon?: React.ReactNode;
}

const KeyValueDisplay: React.FC<KeyValueDisplayProps> = ({
  title,
  value,
  className,
  icon,
}) => (
  <div
    className={`bg-RCColors-800 p-6 rounded-lg shadow text-center flex flex-col justify-center items-center ${className}`}
  >
    {icon && <div className="text-primary mb-2 text-3xl">{icon}</div>}
    <h3 className="text-xl font-medium text-RCColors-400 mb-1">{title}</h3>
    <p className="text-4xl font-semibold text-primary">{value}</p>
  </div>
);

export default KeyValueDisplay;
