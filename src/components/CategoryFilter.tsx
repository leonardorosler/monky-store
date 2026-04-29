import { Category } from '../types'

interface CategoryFilterProps {
  categories: Category[]
  selected: string | undefined
  onChange: (id: string | undefined) => void
}

export function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange(undefined)}
        className={`font-body text-sm px-4 py-1.5 border transition-colors duration-200 ${
          !selected
            ? 'bg-charcoal text-ivory border-charcoal'
            : 'bg-transparent text-charcoal border-border hover:border-charcoal'
        }`}
      >
        Todos
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`font-body text-sm px-4 py-1.5 border transition-colors duration-200 ${
            selected === cat.id
              ? 'bg-charcoal text-ivory border-charcoal'
              : 'bg-transparent text-charcoal border-border hover:border-charcoal'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
