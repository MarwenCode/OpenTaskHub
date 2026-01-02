import React from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }){
  // minimal: allow access (auth gating removed)
  return <>{children}</>
}
