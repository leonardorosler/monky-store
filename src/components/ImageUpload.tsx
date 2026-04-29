import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setUploading(true)
    const uploaded: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('products')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) {
        console.error('Erro upload:', error.message)
        continue
      }

      const { data } = supabase.storage.from('products').getPublicUrl(fileName)
      uploaded.push(data.publicUrl)
    }

    onChange([...images, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  function removeImage(url: string) {
    onChange(images.filter(img => img !== url))
  }

  return (
    <div className="space-y-3">
      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map(url => (
            <div key={url} className="relative w-24 h-24 border border-border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-charcoal text-ivory flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input de upload */}
      <label className={`flex items-center gap-3 border border-dashed border-border px-4 py-3 cursor-pointer hover:border-charcoal transition-colors duration-200 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <span className="font-body text-sm text-muted">
          {uploading ? 'Enviando...' : 'Clique para adicionar imagens'}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  )
}
