import { useRef, useState, useCallback } from 'react';
import { Upload, X, Link as LinkIcon, Star, Trash2 } from 'lucide-react';

interface ExistingImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface Props {
    files: File[];
    onFilesChange: (files: File[]) => void;
    imageUrls: string[];
    onImageUrlsChange: (urls: string[]) => void;
    existingImages?: ExistingImage[];
    onDeleteExisting?: (id: number) => void;
    onSetPrimary?: (id: number) => void;
    maxImages?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ImageUploaderSection({
    files,
    onFilesChange,
    imageUrls,
    onImageUrlsChange,
    existingImages = [],
    onDeleteExisting,
    onSetPrimary,
    maxImages = 10,
}: Props) {
    const [urlInput, setUrlInput] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [fileError, setFileError] = useState('');
    const [urlError, setUrlError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const totalCount = existingImages.length + files.length + imageUrls.length;
    const remaining = maxImages - totalCount;

    const addFiles = useCallback(
        (incoming: FileList | File[]) => {
            setFileError('');
            const toAdd: File[] = [];
            Array.from(incoming).forEach((file) => {
                if (existingImages.length + files.length + imageUrls.length + toAdd.length >= maxImages) {
                    setFileError(`Maximum ${maxImages} images allowed.`);
                    return;
                }
                if (!ALLOWED_TYPES.includes(file.type)) {
                    setFileError(`"${file.name}" must be JPEG, PNG, or WebP.`);
                    return;
                }
                if (file.size > MAX_FILE_SIZE) {
                    setFileError(`"${file.name}" exceeds the 10 MB limit.`);
                    return;
                }
                toAdd.push(file);
            });
            if (toAdd.length) onFilesChange([...files, ...toAdd]);
        },
        [files, imageUrls, existingImages, maxImages, onFilesChange],
    );

    const removeFile = (index: number) => onFilesChange(files.filter((_, i) => i !== index));

    const addUrl = () => {
        setUrlError('');
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        try { new URL(trimmed); } catch {
            setUrlError('Please enter a valid URL.');
            return;
        }
        if (totalCount >= maxImages) {
            setUrlError(`Maximum ${maxImages} images allowed.`);
            return;
        }
        onImageUrlsChange([...imageUrls, trimmed]);
        setUrlInput('');
    };

    const removeUrl = (index: number) => onImageUrlsChange(imageUrls.filter((_, i) => i !== index));

    const labelClass = 'text-xs font-semibold text-navy-600 uppercase tracking-wide';

    return (
        <div className="space-y-7">

            {/* ── Existing images ─────────────────────────────────────────── */}
            {existingImages.length > 0 && (
                <div>
                    <p className={`${labelClass} mb-3`}>Current Photos</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {existingImages.map((img) => (
                            <div key={img.id} className="relative group">
                                <img
                                    src={img.url}
                                    alt=""
                                    className="w-full aspect-square object-cover rounded-xl border border-gray-200 bg-gray-100"
                                />
                                {img.is_primary && (
                                    <span className="absolute top-1 left-1 bg-gold-500 text-white text-xs px-1.5 py-0.5 rounded-md leading-none pointer-events-none">
                                        Cover
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {!img.is_primary && onSetPrimary && (
                                        <button
                                            type="button"
                                            title="Set as cover"
                                            onClick={() => onSetPrimary(img.id)}
                                            className="w-8 h-8 bg-gold-500 hover:bg-gold-600 rounded-lg flex items-center justify-center text-white"
                                        >
                                            <Star className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onDeleteExisting && (
                                        <button
                                            type="button"
                                            title="Delete image"
                                            onClick={() => onDeleteExisting(img.id)}
                                            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Drop zone ───────────────────────────────────────────────── */}
            {remaining > 0 && (
                <div>
                    <p className={`${labelClass} mb-3`}>
                        Upload Photos{' '}
                        <span className="text-navy-300 font-normal normal-case">
                            ({remaining} slot{remaining !== 1 ? 's' : ''} remaining · max 10 MB each)
                        </span>
                    </p>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all select-none ${
                            dragOver
                                ? 'border-gold-400 bg-gold-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) addFiles(e.target.files);
                                e.target.value = '';
                            }}
                        />
                        <Upload className="w-8 h-8 text-navy-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-navy-600">
                            Drag &amp; drop photos here, or{' '}
                            <span className="text-gold-600 underline underline-offset-2">browse</span>
                        </p>
                        <p className="text-xs text-navy-400 mt-1">JPEG, PNG, WebP</p>
                    </div>
                    {fileError && <p className="mt-2 text-xs text-red-500">{fileError}</p>}
                </div>
            )}

            {/* ── New file previews ────────────────────────────────────────── */}
            {files.length > 0 && (
                <div>
                    <p className={`${labelClass} mb-3`}>New Uploads ({files.length})</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {files.map((file, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full aspect-square object-cover rounded-xl border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <span className="absolute bottom-0 inset-x-0 text-white text-xs bg-black/60 rounded-b-xl px-2 py-1 truncate">
                                    {file.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── URL input ────────────────────────────────────────────────── */}
            {remaining > 0 && (
                <div>
                    <p className={`${labelClass} mb-3`}>
                        Or Add by URL{' '}
                        <span className="text-navy-300 font-normal normal-case">(publicly accessible images)</span>
                    </p>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-1 focus-within:border-gold-400 transition-colors">
                            <LinkIcon className="w-4 h-4 text-navy-400 shrink-0" />
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                                placeholder="https://example.com/photo.jpg"
                                className="flex-1 text-sm text-navy-800 placeholder-navy-300 outline-none bg-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addUrl}
                            disabled={!urlInput.trim()}
                            className="px-5 py-3 bg-navy-900 hover:bg-navy-800 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl text-sm font-medium transition-all"
                        >
                            Add
                        </button>
                    </div>
                    {urlError && <p className="mt-2 text-xs text-red-500">{urlError}</p>}
                </div>
            )}

            {/* ── URL previews ─────────────────────────────────────────────── */}
            {imageUrls.length > 0 && (
                <div>
                    <p className={`${labelClass} mb-3`}>Added URLs ({imageUrls.length})</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imageUrls.map((url, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={url}
                                    alt=""
                                    className="w-full aspect-square object-cover rounded-xl border border-gray-200 bg-gray-100"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeUrl(i)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Empty state ──────────────────────────────────────────────── */}
            {totalCount === 0 && (
                <div className="p-5 bg-navy-50 border border-navy-100 rounded-xl text-xs text-navy-400 text-center">
                    No images added yet. Upload files or add URLs above to showcase your property.
                </div>
            )}

            {/* ── Limit warning ────────────────────────────────────────────── */}
            {totalCount >= maxImages && remaining === 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 text-center">
                    Maximum {maxImages} images reached.
                </div>
            )}
        </div>
    );
}
