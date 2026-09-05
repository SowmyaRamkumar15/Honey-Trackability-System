import React from 'react'
import LabLayout from '../../../layouts/LabLayout'
import Card from '../../../components/ui/Card'
import { useAuth } from '../../auth/hooks/useAuth'

export const LabDashboard = () => {
  const { phoneNumber } = useAuth()

  return (
    <LabLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-['Outfit']">
            Lab <span className="text-blue-600">Testing Portal</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Logged in as: <span className="text-amber-800 font-bold font-mono">{phoneNumber}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🔬', label: 'Samples Pending', value: '—', color: 'bg-blue-50 border-blue-200' },
            { icon: '📋', label: 'Tests Completed', value: '—', color: 'bg-white border-slate-200' },
            { icon: '🏅', label: 'Certs Issued', value: '—', color: 'bg-amber-50 border-amber-200' },
          ].map(({ icon, label, value, color }) => (
            <Card key={label} className={`flex items-center gap-4 border ${color} shadow-sm`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-100 border border-slate-200">
                {icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-slate-900 text-2xl font-bold font-['Outfit']">{value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-slate-300 shadow-sm">
          <div className="text-5xl mb-4">🔬</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 font-['Outfit']">Sample Quality Testing</h2>
          <p className="text-slate-500 text-sm">Chemical composition tests, purity certifications, and on-chain report anchoring.</p>
        </div>
      </div>
    </LabLayout>
  )
}

export default LabDashboard
