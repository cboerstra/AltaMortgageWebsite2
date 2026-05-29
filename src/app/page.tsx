export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[#003087]">Alta Mortgage Group</h1>
        <p className="mt-4 text-[#6B7280] text-lg">Your Trusted Utah Mortgage Partner</p>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-[#00A86B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#00c77b] transition-colors">Get Pre-Approved</button>
          <button className="border-2 border-[#003087] text-[#003087] px-6 py-3 rounded-lg font-medium hover:bg-[#003087] hover:text-white transition-colors">Calculate Payment</button>
        </div>
      </div>
    </main>
  );
}
