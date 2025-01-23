'use client'

interface ContainerProps {
    children: React.ReactNode
}

export default function Container ({children}: ContainerProps) {
    return (
        <main>
        <div className="px-2 py-2">
            {children}
        </div>
        </main>
    )
}

