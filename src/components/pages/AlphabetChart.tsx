import { useOutletContext } from 'react-router';

interface ContextType {
  onNavigate: (page: string) => void;
}

export function AlphabetChart() {
  const { onNavigate } = useOutletContext<ContextType>();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button className="text-sm text-foreground underline mb-4" onClick={() => onNavigate('home')}>
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-2">ISL (Indian Sign Language) Alphabet Chart</h1>
          <p className="text-muted-foreground mb-4">Reference chart for ISL alphabets and numbers.</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="w-full flex justify-center">
            <img
              src="/isl-alphabet-chart.png"
              alt="ISL (Indian Sign Language) Alphabet Chart"
              className="max-w-full h-auto object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">If the image does not appear, please place the chart image at <code>/isl-alphabet-chart.png</code> in the project root (public folder).</p>
        </div>
      </div>
    </div>
  );
}
