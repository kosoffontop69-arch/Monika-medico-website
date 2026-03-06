export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="text-center">
        <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto mb-6">
          <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
          <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
          <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
        </svg>
        <h1 className="font-display text-4xl font-bold text-white mb-3">Under Maintenance</h1>
        <p className="text-forest-300 font-body text-lg mb-2">
          We're updating our systems. Be back shortly!
        </p>
        <p className="text-forest-500 font-body text-sm">Monika Medico Pvt. Ltd.</p>
      </div>
    </div>
  )
}
