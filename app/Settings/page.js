'use client';

import Header from "../Header/page";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme, setTheme } = useTheme(); // make sure setTheme is exposed in context

  const handleThemeChange = (e) => {
    const selected = e.target.value;
    if (selected !== theme) {
      setTheme(selected);
      localStorage.setItem("theme", selected);
    }
  };

  return (
    <>
      <Header />
      <div
        className={`settings-container p-8 ${
          theme === "light"
            ? "bg-gray-50 text-gray-700"
            : "bg-gray-800 text-gray-300"
        } min-h-screen`}
      >
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="flex items-center mb-4">
          <p className="text-lg font-semibold mr-4">Theme:</p>

          <label className="mr-2">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={handleThemeChange}
              className="mr-1"
            />
            Light
          </label>

          <label className="ml-4">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={handleThemeChange}
              className="mr-1"
            />
            Dark
          </label>
        </div>
      </div>
    </>
  );
}

export default Settings;
