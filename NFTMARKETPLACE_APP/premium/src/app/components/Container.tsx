'use client'

interface ContainerProps {
    children: React.ReactNode
}

export default function Container ({children}: ContainerProps) {
    return (
        <main className="mx-auto">
        <div className="px-2 sm:px-4 lg:px-6 py-4">
            {children}
        </div>
        </main>
    )
}

