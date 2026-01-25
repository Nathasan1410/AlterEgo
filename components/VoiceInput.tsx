'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Send, Trash2, Pause, Play } from 'lucide-react';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  onRecordingStart?: () => void;
  onRecordingEnd?: () => void;
  disabled?: boolean;
}

export default function VoiceInput({ 
  onTranscription, 
  onRecordingStart,
  onRecordingEnd,
  disabled = false 
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      onRecordingStart?.();

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Microphone access denied');
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setIsPaused(!isPaused);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setIsPaused(false);
      onRecordingEnd?.();
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
    chunksRef.current = [];
  };

  // Send audio for transcription
  const sendAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', 'id'); // Indonesian default

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.text) {
        onTranscription(data.text);
        setAudioBlob(null);
        setDuration(0);
      } else {
        setError(data.error || 'Transcription failed');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Idle state - show mic button
  if (!isRecording && !audioBlob) {
    return (
      <motion.button
        onClick={startRecording}
        disabled={disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Record voice note"
      >
        <Mic className="w-5 h-5" />
      </motion.button>
    );
  }

  // Recording state - WhatsApp style bar
  if (isRecording) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-full border border-orange-200 dark:border-orange-800"
      >
        {/* Cancel button */}
        <button
          onClick={cancelRecording}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          title="Cancel"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Recording indicator */}
        <div className="flex items-center gap-2 flex-1">
          <motion.div
            animate={{ opacity: isPaused ? 0.5 : [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: isPaused ? 0 : Infinity }}
            className="w-3 h-3 rounded-full bg-red-500"
          />
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300 min-w-[50px]">
            {formatDuration(duration)}
          </span>
          
          {/* Waveform visualization */}
          <div className="flex items-center gap-0.5 h-6">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPaused ? { height: 4 } : { 
                  height: [4, 12 + Math.random() * 12, 4] 
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: isPaused ? 0 : Infinity, 
                  delay: i * 0.05 
                }}
                className="w-1 bg-orange-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Pause/Resume button */}
        <button
          onClick={pauseRecording}
          className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-full transition-colors"
          title={isPaused ? "Resume" : "Pause"}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Stop button */}
        <button
          onClick={stopRecording}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Stop"
        >
          <Square className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  // Review state - audio recorded, ready to send
  if (audioBlob) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800"
      >
        {/* Delete button */}
        <button
          onClick={cancelRecording}
          disabled={isTranscribing}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Duration display */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {formatDuration(duration)}
          </span>
          <span className="text-xs text-gray-500">Ready to send</span>
        </div>

        {/* Error display */}
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}

        {/* Send button */}
        <motion.button
          onClick={sendAudio}
          disabled={isTranscribing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-1"
          title="Send for transcription"
        >
          {isTranscribing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </motion.div>
    );
  }

  return null;
}
