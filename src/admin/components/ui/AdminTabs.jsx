import { createContext, useContext, useState } from 'react'

const TabsContext = createContext()

function AdminTabs({ children, defaultValue, value, onValueChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue
  const handleChange = onValueChange ?? setInternalValue

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      {children}
    </TabsContext.Provider>
  )
}

function AdminTabsList({ children, className = '' }) {
  return (
    <div className={`flex gap-1 p-1 bg-admin-card-hover rounded-lg ${className}`}>
      {children}
    </div>
  )
}

function AdminTabsTrigger({ children, value, className = '' }) {
  const { value: currentValue, onChange } = useContext(TabsContext)
  const isActive = currentValue === value

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`
        px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${isActive
          ? 'bg-admin-border text-white'
          : 'text-neutral-400 hover:text-white hover:bg-admin-border/50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

function AdminTabsContent({ children, value, className = '' }) {
  const { value: currentValue } = useContext(TabsContext)

  if (currentValue !== value) return null

  return <div className={className}>{children}</div>
}

export { AdminTabs, AdminTabsList, AdminTabsTrigger, AdminTabsContent }
