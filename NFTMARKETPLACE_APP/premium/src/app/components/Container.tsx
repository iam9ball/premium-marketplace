'use client'

interface ContainerProps {
    children: React.ReactNode
}

export default function Container ({children}: ContainerProps) {
    return (
        <main className="mx-auto">
        <div className="px-8  lg:px-20 py-4">
            {children}
        </div>
        </main>
    )
}

