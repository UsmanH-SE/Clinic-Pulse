function App() {
  return (
    <main className="min-h-screen px-6 py-16 text-slate-900">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-2xl shadow-sky-100 backdrop-blur md:p-14">
        <span className="mb-4 rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
          React + Tailwind is ready
        </span>
        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
          ClinicPulse client is set up and running with React and Tailwind CSS.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-600 md:text-xl">
          You can now start building your app in the client folder with modern React components and Tailwind styling.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Vite Docs
          </a>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Tailwind Docs
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
