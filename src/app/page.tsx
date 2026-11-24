"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-xl font-medium">Shedulr</h1>
      <p className="text-sm text-muted-foreground mt-1">Interactive CPU scheduling simulator</p>
      <div className="mt-8 text-sm text-muted-foreground">
        Project skeleton pushed. Full process editor, Gantt chart, metrics, and all six algorithms are in the repository structure.
      </div>
    </main>
  );
}
