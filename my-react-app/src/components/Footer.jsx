const Footer = () => {
  return (
    <footer id="main-footer" className="py-8 px-6 text-center border-t border-slate-200">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-lg">🍯</span>
        <span className="font-bold text-gradient font-['Outfit']">HoneyChain</span>
      </div>
      <p className="text-slate-500 text-sm">
        Blockchain-powered honey traceability © {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
