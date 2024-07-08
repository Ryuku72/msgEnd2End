import { useState } from 'react';

import LOCALES from '~/locales/language_en.json';

export type PasswordInputProps = {
  title: string;
  id: string;
  value: string;
  labelColor?: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export default function PasswordInput({
  title,
  id,
  value,
  placeholder,
  required = true,
  labelColor = 'text-gray-600',
  onChange
}: PasswordInputProps) {
  const LocalStrings = LOCALES.password_input;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex flex-col gap-2 font-mono">
      <label htmlFor={id} className={`w-full text-sm font-medium ${labelColor}`}>
        {title}
      </label>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        autoComplete={id}
        aria-label={title}
        minLength={6}
        maxLength={32}
        name={id}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 font-normal border text-base border-gray-300 rounded-lg py-2 px-3 text-gray-500 pr-11"
      />
      <div className={`flex gap-3 items-center w-full px-2 text-sm ${labelColor}`}>
        <input
          type="checkbox"
          aria-label={title + '_checkbox'}
          onClick={() => setShowPassword(!showPassword)}
          value={showPassword ? 1 : 0}
          className="w-4 h-4 text-blue-600 text-base bg-gray-100 border-emerald-800 rounded focus:ring-blue-500 focus:ring-1 cursor-pointer"
        />
        {LocalStrings.show_password}
      </div>
    </div>
  );
}
