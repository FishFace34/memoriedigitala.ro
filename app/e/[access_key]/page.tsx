'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';
import toast from 'react-hot-toast';

export default function GuestUploadPage() {
  const params = useParams();
  const accessKey = params.access_key as string;
  const search = useSearchParams();
  const { t } = useLanguage();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [voiceMessageEnabled, setVoiceMessageEnabled] = useState(false);
  const [eventName, setEventName] = useState<string>('');
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const theme = (search.get('theme') as 'classic'|'dark'|'pink'|'blue'|'gray'|'green') || 'classic';

  useEffect(() => {
    // Check if voice messages are enabled for this event
    const checkVoiceMessages = async () => {
      try {
        const response = await fetch(`/api/check-event?accessKey=${accessKey}`);
        const data = await response.json();
        if (data.event) {
          setVoiceMessageEnabled(data.event.voice_message_enabled || false);
          setEventName(data.event.event_name || '');
        }
      } catch (error) {
        console.error('Error checking event:', error);
      }
    };
    checkVoiceMessages();
  }, [accessKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview for images
      if (uploadType === 'photo' && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    toast.loading(t('Uploading...', 'Se încarcă...'), { id: 'upload' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('accessKey', accessKey);
      formData.append('type', uploadType);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      const response = await new Promise<{ success: boolean; error?: string }>((resolve, reject) => {
        xhr.addEventListener('loadend', () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve({ success: true });
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ success: false, error: data.error });
              } catch {
                resolve({ success: false, error: 'Upload failed' });
              }
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));

        xhr.open('POST', '/api/upload-media');
        xhr.send(formData);
      });

      if (response.success) {
        toast.success(t('Upload successful!', 'Încărcare reușită!'), { id: 'upload' });
        setUploaded(true);
        setFile(null);
        setPreview(null);
        // Auto-refresh after 2 seconds
        setTimeout(() => {
          setUploaded(false);
        }, 3000);
      } else {
        toast.error(response.error || t('Upload failed', 'Încărcare eșuată'), { id: 'upload' });
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error(t('Error uploading file. Please try again.', 'Eroare la încărcarea fișierului. Vă rugăm să încercați din nou.'), { id: 'upload' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (uploadType === 'photo' || uploadType === 'video')) {
      if (uploadType === 'photo' && !droppedFile.type.startsWith('image/')) {
        toast.error(t('Please select an image file', 'Te rugăm să selectezi o imagine'));
        return;
      }
      if (uploadType === 'video' && !droppedFile.type.startsWith('video/')) {
        toast.error(t('Please select a video file', 'Te rugăm să selectezi un videoclip'));
        return;
      }
      
      setFile(droppedFile);
      
      // Create preview for images
      if (uploadType === 'photo' && droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setAudioChunks(chunks);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert(t('Could not access microphone. Please allow microphone access.', 'Nu s-a putut accesa microfonul. Te rugăm să permiți accesul la microfon.'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setRecording(false);
    }
  };

  const handleVoiceUpload = async () => {
    if (!audioBlob) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-message.webm');
      formData.append('accessKey', accessKey);
      formData.append('type', 'audio');

      const response = await fetch('/api/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploaded(true);
        setAudioBlob(null);
        setTimeout(() => {
          setUploaded(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Upload failed'}`);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert(t('Error uploading audio', 'Eroare la încărcarea audio'));
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-4 text-green-600">{t('Thank you!', 'Mulțumim!')}</h1>
              <p className="text-gray-900 font-bold mb-6">
            {t('Your memory has been uploaded successfully. The host will be able to see it in a few moments.', 'Amintirea ta a fost încărcată cu succes. Gazda o va putea vedea în câteva momente.')}
          </p>
          <button
            onClick={() => setUploaded(false)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {t('Upload Another Memory', 'Încarcă Altă Amintire')}
          </button>
        </div>
      </div>
    );
  }

  const themeClasses: Record<string, {wrapper: string; card: string; accentText: string; dashed: string; button: string; icon: string;}> = {
    classic: { wrapper: 'from-blue-50 to-white', card: 'bg-white', accentText: 'text-gray-900', dashed: 'border-blue-300', button: 'from-blue-600 to-purple-600', icon: 'text-blue-600' },
    dark:    { wrapper: 'from-neutral-900 to-neutral-800', card: 'bg-neutral-900 text-neutral-100', accentText: 'text-neutral-100', dashed: 'border-neutral-600', button: 'from-amber-600 to-amber-700', icon: 'text-amber-400' },
    pink:    { wrapper: 'from-pink-50 to-white', card: 'bg-white', accentText: 'text-pink-900', dashed: 'border-pink-300', button: 'from-pink-600 to-rose-600', icon: 'text-pink-600' },
    blue:    { wrapper: 'from-slate-100 to-white', card: 'bg-white', accentText: 'text-blue-900', dashed: 'border-blue-300', button: 'from-blue-600 to-indigo-600', icon: 'text-blue-600' },
    gray:    { wrapper: 'from-gray-50 to-white', card: 'bg-white', accentText: 'text-gray-900', dashed: 'border-gray-300', button: 'from-gray-700 to-gray-800', icon: 'text-gray-600' },
    green:   { wrapper: 'from-emerald-50 to-white', card: 'bg-white', accentText: 'text-emerald-900', dashed: 'border-emerald-300', button: 'from-emerald-600 to-teal-600', icon: 'text-emerald-600' },
  };
  const tCls = themeClasses[theme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${tCls.wrapper} flex items-center justify-center p-4`}>
      <div className={`${tCls.card} rounded-2xl shadow-xl p-4 sm:p-6 md:p-12 max-w-lg w-full relative`}>
        {/* Language Toggle */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <LanguageToggle />
        </div>
        
        <h1 className={`text-3xl md:text-4xl font-serif mb-6 text-center ${tCls.accentText}`}>{eventName || t('Event Name','Nume Eveniment')}</h1>

        {/* Upload Type Selector */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => setUploadType('photo')}
            className={`p-2 sm:p-4 rounded-xl border-2 transition min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center text-xs sm:text-sm ${
              uploadType === 'photo' ? 'border-black bg-white' : 'border-gray-200 bg-white/70'
            }`}
          >
            <span className="text-lg sm:text-xl mb-1">📸</span>
            <span>{t('Photo', 'Foto')}</span>
          </button>
          <button
            onClick={() => setUploadType('video')}
            className={`p-2 sm:p-4 rounded-xl border-2 transition min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center text-xs sm:text-sm ${
              uploadType === 'video' ? 'border-black bg-white' : 'border-gray-200 bg-white/70'
            }`}
          >
            <span className="text-lg sm:text-xl mb-1">🎥</span>
            <span>{t('Video', 'Video')}</span>
          </button>
          {voiceMessageEnabled && (
            <button
              onClick={() => setUploadType('audio')}
              className={`p-2 sm:p-4 rounded-xl border-2 transition min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center text-xs sm:text-sm ${
                uploadType === 'audio' ? 'border-black bg-white' : 'border-gray-200 bg-white/70'
              }`}
            >
              <span className="text-lg sm:text-xl mb-1">🎤</span>
              <span>{t('Voice Note', 'Notă Vocală')}</span>
            </button>
          )}
        </div>

        {/* Photo/Video Upload */}
        {(uploadType === 'photo' || uploadType === 'video') && (
          <div className="space-y-4">
            <label className="block">
              <input
                type="file"
                accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 sm:p-12 text-center cursor-pointer transition-all min-h-[120px] sm:min-h-[180px] flex flex-col items-center justify-center ${
                  isDragging 
                    ? `${tCls.dashed} bg-white/40 scale-105` 
                    : `${tCls.dashed} hover:bg-white/50`
                }`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className={`text-3xl sm:text-4xl mb-2 sm:mb-4 ${tCls.icon}`}>
                  {uploadType === 'photo' ? '📸' : '🎥'}
                </div>
                <p className="text-sm sm:text-base text-gray-900 font-bold mb-1 sm:mb-2 px-2">
                  {file ? file.name : isDragging 
                    ? t('📁 Drop here', '📁 Bırak buraya') 
                    : t('Click or drag to upload', 'Tıkla veya sürükle')}
                </p>
                {!file && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    {uploadType === 'photo' ? t('JPG, PNG, WebP', 'JPG, PNG, WebP') : t('MP4, WebM, MOV', 'MP4, WebM, MOV')}
                  </p>
                )}
              </div>
            </label>

            {/* Image Preview */}
            {preview && uploadType === 'photo' && (
              <div className="relative w-full">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg border-2 border-blue-200"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold hover:bg-red-700 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {file && (
              <div className="space-y-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`w-full bg-gradient-to-r ${tCls.button} text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {uploading 
                    ? `${Math.round(uploadProgress)}% - ${t('Uploading...', 'Se încarcă...')}` 
                    : t('📤 Send', '📤 Trimite')}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  disabled={uploading}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {t('Cancel', 'İptal')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Audio Recording */}
        {uploadType === 'audio' && voiceMessageEnabled && (
          <div className="space-y-6">
            <div className={`rounded-2xl border-2 border-dashed ${tCls.dashed} bg-white/70 p-6 text-center`}>
              <h2 className={`text-2xl font-semibold mb-2 ${tCls.accentText}`}>{t('Leave a voice note', 'Lasă o notă vocală')}</h2>
              <p className="text-amber-800/80 italic mb-6">{t('Save your voice memo by clicking the button below.', 'Salvează-ți mesajul vocal apăsând butonul de mai jos.')}</p>
              {!recording ? (
                <button onClick={startRecording} className="mx-auto w-[140px] h-[140px] rounded-full bg-gradient-to-b from-amber-600 to-amber-700 shadow-xl text-white text-4xl flex items-center justify-center">
                  🎤
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-3xl animate-pulse text-red-600">●</div>
                  <p className={`${tCls.accentText} font-semibold`}>{t('Recording...', 'Se înregistrează...')}</p>
                  <button onClick={stopRecording} className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold">{t('Stop Recording', 'Oprește Înregistrarea')}</button>
                </div>
              )}
            </div>
            {audioBlob && (
              <button onClick={handleVoiceUpload} disabled={uploading} className={`w-full bg-gradient-to-r ${tCls.button} text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50`}>
                {uploading ? t('Uploading...', 'Se încarcă...') : t('Send Voice Note', 'Trimite Nota Vocală')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

