import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Loader2, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

interface LogoUploadProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

const ACCEPTED_TYPES = {
    'image/jpeg': [],
    'image/png': [],
    'image/webp': []
}

const LogoUpload = ({ value, onChange, className }: LogoUploadProps) => {
    const [preview, setPreview] = useState<string>(value)
    const [isLoading, setIsLoading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        try {
            setIsLoading(true)

            const data = new FormData()
            data.set('file', file)

            const response = await fetch('/api/uploads', {
                method: 'POST',
                body: data
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const imageUrl = await response.json()
            console.log(imageUrl)

            toast.success('Tải ảnh lên thành công!')
            setPreview(imageUrl)
            onChange(imageUrl)
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải ảnh! Vui lòng thử lại.')
            onChange('')
        } finally {
            setIsLoading(false)
        }
    }, [onChange])

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
    }, [onChange])

    return (
        <div className={cn("w-full max-w-md", className)}>
            <div className="p-4">
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative transition-colors cursor-pointer",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} accept={Object.keys(ACCEPTED_TYPES).join(',')} />

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 rounded-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}

                    {preview ? (
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <Image
                                    src={preview}
                                    alt="Logo preview"
                                    fill
                                    className={cn(
                                        "duration-300 object-cover ease-in-out hover:scale-105 rounded-full transition-transform"
                                    )}
                                />
                            </div>
                            <button
                                onClick={handleRemoveImage}
                                className={cn(
                                    "absolute -top-2 -right-2 p-1.5 rounded-full",
                                    "bg-background/100 backdrop-blur-sm",
                                    "hover:bg-background transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-ring",
                                    "shadow-sm"
                                )}
                                aria-label="Remove image"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LogoUpload