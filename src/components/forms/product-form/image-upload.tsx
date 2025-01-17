'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  onError: (error: string) => void
  className?: string
  quality?: number
  maxSizeMB?: number
}


const ACCEPTED_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': []
}
const OPTIMAL_WIDTH = 1200
const OPTIMAL_HEIGHT = 720

const ImageUpload = ({ 
  value, 
  onChange, 
  onError,
  className,
  quality = 85,
  maxSizeMB = 10,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(value)
  const [isLoading, setIsLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)


  // Optimize image before upload
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let newWidth = img.width
        let newHeight = img.height
        
        if (img.width > OPTIMAL_WIDTH) {
          newWidth = OPTIMAL_WIDTH
          newHeight = (OPTIMAL_WIDTH * img.height) / img.width
        }
        
        // Create canvas for resizing
        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(file)

        // Draw and compress image
        ctx.drawImage(img, 0, 0, newWidth, newHeight)
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file)
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality / 100
        )
      }
      img.src = URL.createObjectURL(file)
    })
  }


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setIsLoading(true)
      setIsImageLoaded(false)

      // Optimize image
      const optimizedFile = await optimizeImage(file)

      const data = new FormData()
      data.set('file', optimizedFile)

      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: data
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const imageUrl = await response.json()
      toast.success('Tải ảnh lên thành công!')
      setPreview(imageUrl)
      onChange(imageUrl)
    } catch (error) {
      onError('Có lỗi xảy ra khi tải ảnh! Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }, [onChange, onError, maxSizeMB, quality])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isLoading,
    multiple: false
  })

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview('')
    onChange('')
    setIsImageLoaded(false)
  }, [onChange])

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragActive ? 'border-primary bg-primary/10' : 'border-muted',
          preview ? 'border-none p-0' : 'p-8',
          isLoading && 'opacity-50 cursor-not-allowed',
          'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed'
        )}
        role="button"
        aria-label="Upload image"
        tabIndex={0}
      >
        <input {...getInputProps()} accept={Object.keys(ACCEPTED_TYPES).join(',')} />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50 rounded-xl">
            <div className="relative">
              <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin" />
            </div>
          </div>
        )}

        {preview ? (
          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            <div className={cn(
              "relative w-full",
              "sm:aspect-[7/2] aspect-[3/2]",
              "overflow-hidden rounded-xl",
              !isImageLoaded && "animate-pulse"
            )}>
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                className={cn(
                  "object-cover duration-700 ease-in-out",
                  !isImageLoaded ? 'scale-110 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0',
                  "hover:scale-105 transition-transform"
                )}
                quality={quality}
                onLoadingComplete={() => setIsImageLoaded(true)}
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className={cn(
                "absolute top-2 right-2 p-1.5 rounded-full",
                "bg-white/80 backdrop-blur-sm",
                "hover:bg-white transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "shadow-sm"
              )}
              aria-label="Remove image"
            >
              <X className="size-5 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {isDragActive ? 'Thả hình ảnh vào đây' : 'Kéo thả hoặc nhấn để tải ảnh lên'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Hỗ trợ định dạng: PNG, JPG, WebP (tối đa {maxSizeMB}MB)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Khuyến nghị kích thước: {OPTIMAL_WIDTH}x{OPTIMAL_HEIGHT} pixels
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUpload