"use client";

export default function DashboardFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-100 border-t mt-4 py-4 px-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
      <p className="text-center md:text-left">
        © {year} Sendexa LLC. All rights reserved.
      </p>
      <p className="text-center md:text-right mt-2 md:mt-0">
        Built with <span className="text-red-500">💚</span> by{" "}
        <a
          href="https://xtottel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          Xtottel Ltd
        </a>
      </p>
    </footer>
  );
}

