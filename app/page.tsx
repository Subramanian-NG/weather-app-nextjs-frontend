"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => handleRedirect('/weather')}
        className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300"
      >
        Continue without Login
      </button>

      <button
        onClick={() => handleRedirect('/login')}
        className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md transition-colors duration-300"
      >
        Login
      </button>
    </div>
  );
}
