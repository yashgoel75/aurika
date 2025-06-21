"use client";
import { useAccount } from "wagmi";

import Image from "next/image";
import logo from "@/public/AurikaLogo.png";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./page.css";

function SignIn() {
  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!account.isConnected) {
        router.push("/");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [account.isConnected, router]);

  function handleInput(value) {
    return () => {
      const inputField = document.querySelector('input[type="password"]');
      if (inputField) {
        const currentValue = inputField.value;
        if (currentValue.length < 6) {
          inputField.value += value;
        } else {
          inputField.value = currentValue.slice(0, 6);
        }
      }
      console.log(inputField.value);
    };
  }

  function handleClear() {
    const inputField = document.querySelector('input[type="password"]');
    if (inputField) {
      inputField.value = "";
    }
    console.log(inputField.value);
  }

  function handleBackspace() {
    const inputField = document.querySelector('input[type="password"]');
    if (inputField) {
      inputField.value = inputField.value.slice(0, -1);
    }
    console.log(inputField.value);
  }

  function handlePinSubmit(e) {
    e.preventDefault();
    router.push("/Dashboard");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
        <Image
          src={logo}
          alt="Aurika Logo"
          width={250}
          className="mb-4"
          priority
        />
        <h1 className="text-2xl font-bold mb-4">Welcome back, </h1>

        <div className="bg-white p-8 rounded-lg w-90 opacity-90 shadow-lg">
          <form className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2 flex justify-center items-center">
              Enter your PIN to continue
            </h2>
            <input
              onChange={(e) => {
                const inputField = e.target;
                if (inputField.value.length > 6) {
                  inputField.value = inputField.value.slice(0, 6);
                }
              }}
              type="password"
              placeholder="◯ ◯ ◯ ◯ ◯ ◯"
              className="text-center mb-4 p-1 text-xl rounded-md focus:outline-none"
              autoFocus
            />
            <div className="text-red-600 flex justify-center mb-4 hover:cursor-pointer w-fit m-auto">
              Forgot PIN?
            </div>
            <div className="flex justify-between mb-4">
              <label
                onClick={handleInput(1)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                1
              </label>
              <label
                onClick={handleInput(2)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                2
              </label>
              <label
                onClick={handleInput(3)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                3
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label
                onClick={handleInput(4)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                4
              </label>
              <label
                onClick={handleInput(5)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                5
              </label>
              <label
                onClick={handleInput(6)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                6
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label
                onClick={handleInput(7)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                7
              </label>
              <label
                onClick={handleInput(8)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                8
              </label>
              <label
                onClick={handleInput(9)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                9
              </label>
            </div>
            <div className="flex justify-between mb-4">
              <label
                onClick={handleClear}
                className="font-bold text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="#000000"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </label>
              <label
                onClick={handleInput(0)}
                className="prevent-select bg-zinc-100 text-2xl p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                0
              </label>
              <label
                onClick={handleBackspace}
                className="font-bold text-md p-2 flex justify-center items-center rounded-full w-16 h-16 hover:bg-zinc-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="28px"
                  viewBox="0 -960 960 960"
                  width="28px"
                  fill="#000000"
                >
                  <path d="m456-320 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm400 0Z" />
                </svg>
              </label>
            </div>
            <button
              onClick={handlePinSubmit}
              type="submit"
              className="prevent-select mt-3 bg-teal-500 text-lg py-2 rounded-md hover:bg-teal-400 cursor-pointer transition duration-200"
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
