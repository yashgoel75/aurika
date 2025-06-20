'use client';
import Header from "../Header/page";

function Settings() {
  return (
    <>
      <Header />
      <div className="settings-container p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="flex items-center mb-4">
          <p className="text-lg">Theme:</p>
          <label className="mr-2">&nbsp; Light</label>
          <input type="radio" name="theme" value="light" defaultChecked />
          <label className="ml-4 mr-2">Dark</label>
          <input type="radio" name="theme" value="dark" />
          </div>
      </div>
    </>
  );
}

export default Settings;
