import React from 'react'
import { NavLink } from 'react-router-dom'

function LinkComponent({ label, link, icon}) {
  return (
    <NavLink to={link} className="w-full">
      {({ isActive }) => (
        <div className={`flex border w-full gap-4 justify-start items-center py-2 px-4 rounded-lg transition-all ${isActive ? 'bg-emerald-400 text-white ' : 'text-slate-600 '}}`}>
          {icon} {label}
        </div>
      )}
    </NavLink>
  )
}

export default LinkComponent