export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
  
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              CodeSage
            </h1>
  
            <p className="text-slate-400 mt-2">
              AI-Powered Code Reviews
            </p>
          </div>
  
          {children}
  
        </div>
      </div>
    );
  }