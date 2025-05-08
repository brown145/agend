"use client";

export default function HomeError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <div>something went wrong</div>
      <button
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
        onClick={handleRetry}
      >
        retry
      </button>
    </div>
  );
}
