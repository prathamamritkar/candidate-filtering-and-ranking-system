import { cn } from "@/lib/utils"

interface EmptyProps {
  title?: string
  description?: string
  className?: string
}

export function Empty({ title, description, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", className)}>
      <svg
        className="h-16 w-16 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-500 max-w-md">{description}</p>}
    </div>
  )
}
