'use client';
import Image from "next/image";
import logo from "@/public/AurikaLogo.png";

function SignIn() {
  function handleInput(value) {
    return () => {
      const inputField = document.querySelector('input[type="number"]');
      if (inputField) {
        const currentValue = inputField.value;
        if (currentValue.length < 6) {
          inputField.value += value;
        } else {
          inputField.value = currentValue.slice(0, 6);
        }
      }
    }
  }

  function handleClear() {
    const inputField = document.querySelector('input[type="number"]');
    if (inputField) {
      inputField.value = '';
    }
  }

  function handleBackspace() {
    const inputField = document.querySelector('input[type="number"]');
    if (inputField) {
      inputField.value = inputField.value.slice(0, -1);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image src={logo} alt="Aurika Logo" width={250} className="mb-4" />
        <h1 className="text-2xl font-bold mb-4">Welcome back, </h1>

        <div className="bg-white p-8 rounded-lg w-90">
          <form className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Enter your 6-digit PIN to continue</h2>
            <input
              onChange={(e) => {
                const inputField = e.target;
                if (inputField.value.length > 6) {
                  inputField.value = inputField.value.slice(0, 6);
                }
              }}
              type="number"
              placeholder=""
              className="mb-4 p-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between mb-4">
              <label onClick={handleInput(9)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                9
              </label>
              <label onClick={handleInput(8)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                8
              </label>
              <label onClick={handleInput(7)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                7
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label onClick={handleInput(6)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                6
              </label>
              <label onClick={handleInput(5)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                5
              </label>
              <label onClick={handleInput(4)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                4
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label onClick={handleInput(3)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                3
              </label>
              <label onClick={handleInput(2)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                2
              </label>
              <label onClick={handleInput(1)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                1
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label onClick={handleClear} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                C
              </label>
              <label onClick={handleInput(0)} className="bg-gray-200 font-bold text-2xl p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                0
              </label>
              <label onClick={handleBackspace} className="bg-gray-200 font-bold text-md p-2 flex justify-center items-center rounded-full w-18 h-12 hover:bg-gray-300 cursor-pointer">
                DEL
              </label>
            </div>
            <button
              type="submit"
              className="bg-teal-500 text-white py-2 rounded-md hover:bg-teal-400 cursor-pointer  transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
