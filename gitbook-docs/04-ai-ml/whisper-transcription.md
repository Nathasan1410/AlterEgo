# Whisper Transcription

## Overview

AlterEgo integrates OpenAI's Whisper model for voice transcription, enabling hands-free content creation. This allows users to dictate their post ideas, which are then transcribed and used for generation.

## What is Whisper?

Whisper is an automatic speech recognition (ASR) system trained on 680,000 hours of multilingual and multitask supervised data. It provides:

- **High Accuracy**: 95%+ accuracy rate on clear speech
- **Multi-Language Support**: Supports 99 languages including Indonesian and English
- **Fast Transcription**: 2-5 second transcription time for short clips
- **Robust**: Handles accents, background noise, and technical terms

## Integration Architecture

```
┌─────────────────────────────────────────┐
│         Frontend                 │
│  ┌───────────────────────────────┐ │
│  │  VoiceInput Component       │ │
│  │  src/components/features/   │ │
│  │  voice-input/              │ │
│  │                           │ │
│  │  [Microphone Button]      │ │
│  │  [Record/Stop]          │ │
│  │  [Audio Visualizer]      │ │
│  └───────────────────────────────┘ │
└───────────────┬───────────────────┘
                │
                ↓ Audio Blob
                │
┌─────────────────────┴───────────────┐
│         API Route                  │
│  app/api/transcribe/route.ts      │
└───────────────┬───────────────────┘
                │
                ↓ POST with audio
                │
┌─────────────────────┴───────────────┐
│         OpenAI Whisper             │
│  https://api.openai.com/v1/audio │
└───────────────┬───────────────────┘
                │
                ↓ JSON response
                │
┌─────────────────────┴───────────────┐
│         Transcription             │
│  {                            │
│    text: "transcribed text",  │
│    language: "en",           │
│    duration: 5.2            │
│  }                            │
└───────────────┬───────────────────┘
                │
                ↓
┌─────────────────────┴───────────────┐
│         Frontend Update           │
│  Display transcribed text        │
└───────────────────────────────────┘
```

## Implementation

### API Route

Location: `app/api/transcribe/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get audio from request
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call OpenAI Whisper API
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Whisper API error");
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        text: result.text,
        language: result.language,
        duration: result.duration,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TRANSCRIPTION_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
```

### Frontend Component

Location: `src/components/features/voice-input/VoiceInput.tsx`

```typescript
import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

export function VoiceInput({ onTranscribe }: { onTranscribe: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setTranscribing(true);

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onTranscribe(result.data.text);
      } else {
        alert("Transcription failed");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Transcription failed");
    } finally {
      setTranscribing(false);
    }
  };

  return (
    <div className="voice-input">
      {!recording && !transcribing && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Mic size={20} />
          <span>Start Recording</span>
        </button>
      )}

      {recording && (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Square size={20} />
          <span>Stop Recording</span>
        </button>
      )}

      {transcribing && (
        <div className="flex items-center gap-2 px-4 py-2 text-gray-600">
          <div className="animate-spin">
            <Square size={20} />
          </div>
          <span>Transcribing...</span>
        </div>
      )}
    </div>
  );
}
```

## Configuration

### OpenAI API Setup

#### Get API Key

1. Visit [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or login
3. Navigate to API Keys
4. Generate new API key
5. Add to `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Whisper Model Options

| Model | Speed | Accuracy | Use Case |
|-------|--------|-----------|-----------|
| `whisper-1` | Fast | Good | Quick transcription |
| `whisper-large-v3` | Slower | Best | High accuracy needed |

**Recommended**: `whisper-1` for general use (faster, good accuracy)

## Performance Considerations

### Optimize Audio Quality

**Tips for Best Results**:
1. **Use Good Microphone**: Quality hardware matters
2. **Minimize Background Noise**: Quiet environment
3. **Speak Clearly**: Clear pronunciation
4. **Limit Duration**: Short clips (30-60 seconds) transcribe faster
5. **Check Permissions**: Ensure microphone access granted

### Reduce Latency

```typescript
// Use streaming transcription (if available)
const response = await fetch(
  "https://api.openai.com/v1/audio/transcriptions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "whisper-1",
      file: audioBlob,
      response_format: "json",
      timestamp_granularities: ["word"],
    }),
  }
);
```

### Handle Large Audio

```typescript
// Split large audio into chunks
const CHUNK_SIZE = 60; // 60 seconds

async function transcribeLongAudio(audioBlob: Blob) {
  const duration = await getAudioDuration(audioBlob);
  const chunks = Math.ceil(duration / CHUNK_SIZE);

  const transcriptions = [];

  for (let i = 0; i < chunks; i++) {
    const chunk = await extractAudioChunk(audioBlob, i * CHUNK_SIZE, CHUNK_SIZE);
    const text = await transcribeAudio(chunk);
    transcriptions.push(text);
  }

  return transcriptions.join(" ");
}
```

## Error Handling

### Common Errors

#### No Microphone Access

**Error**: "Could not access microphone"

**Solution**:
```typescript
// Check permissions first
try {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // Permission granted
} catch (error) {
  if (error.name === "NotAllowedError") {
    alert("Microphone permission denied. Please allow microphone access.");
  } else if (error.name === "NotFoundError") {
    alert("No microphone found. Please connect a microphone.");
  } else {
    alert("Could not access microphone: " + error.message);
  }
}
```

#### Transcription Failed

**Error**: Whisper API returns error

**Solution**:
```typescript
try {
  const result = await transcribeAudio(audioBlob);
} catch (error) {
  // Fallback: Ask user to type manually
  alert("Transcription failed. Please type your input instead.");

  // Log error for debugging
  console.error("Transcription error:", error);
}
```

#### Audio Format Issues

**Error**: Unsupported audio format

**Solution**:
```typescript
// Convert to supported format
async function convertToSupportedFormat(audioBlob: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Re-encode as WAV
  const wavBlob = await encodeWAV(audioBuffer);
  return wavBlob;
}
```

## Testing

### Unit Tests

```typescript
// __tests__/transcribe.test.ts
describe("Transcribe API", () => {
  it("should transcribe audio", async () => {
    const mockAudio = new Blob(["mock audio data"], { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", mockAudio);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    expect(result.success).toBe(true);
    expect(result.data.text).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe("Voice Input Component", () => {
  it("should start recording on button click", () => {
    // Render component
    // Click record button
    // Verify recording state
  });

  it("should transcribe audio on stop", async () => {
    // Render component
    // Start recording
    // Stop recording
    // Verify transcription called
  });
});
```

## Cost Considerations

### Whisper Pricing

OpenAI charges for transcription:

| Model | Cost per Minute | Free Tier |
|-------|-----------------|------------|
| Whisper-1 | $0.006 | $5 in credits |
| Whisper-Large-v3 | $0.036 | $5 in credits |

**Example**:
- 1-minute clip with Whisper-1: $0.006
- 10-minute clip with Whisper-1: $0.06

### Optimize Costs

1. **Use Shorter Clips**: Shorter clips cost less
2. **Use Faster Model**: Whisper-1 is 6x cheaper
3. **Pre-qualify Audio**: Check audio before sending
4. **Cache Transcriptions**: Don't transcribe same content twice

## Alternatives

If OpenAI Whisper is not available, consider:

### 1. Browser Speech Recognition

```typescript
const recognition = new (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  onTranscribe(transcript);
};
```

**Pros**: Free, no API key needed
**Cons**: Lower accuracy, browser-dependent

### 2. Other Transcription Services

- **Google Speech-to-Text**: High accuracy, supports many languages
- **AWS Transcribe**: Good for long audio
- **Azure Speech**: Real-time transcription

## Best Practices

### User Experience

1. **Show Recording Status**: Visual indicator when recording
2. **Audio Visualization**: Show audio waves during recording
3. **Error Handling**: Clear error messages
4. **Fallback**: Allow manual typing if transcription fails
5. **Language Detection**: Auto-detect language if possible

### Performance

1. **Debounce**: Debounce recording start/stop
2. **Optimize Audio**: Use compression for faster upload
3. **Cancel on Unmount**: Clean up resources
4. **Stream Processing**: Use streaming for large audio

### Security

1. **Validate Input**: Validate audio file type and size
2. **Limit Size**: Prevent large file uploads
3. **Rate Limit**: Limit transcription requests
4. **Secure Storage**: Don't store audio permanently

## OPIK Integration

### Trace Transcription

```typescript
import { getOpikClient } from "@/lib/opik-client";

const opik = getOpikClient();

const trace = opik.trace({
  name: "Transcribe_Audio",
  input: { duration: audioDuration, format: audioFormat },
  tags: ["transcription", "whisper"],
});

try {
  const result = await transcribeAudio(audioBlob);
  trace.end({ output: result.text });
} catch (error) {
  trace.end({ error });
}
```

### Monitor Metrics

- **Transcription Duration**: Time to transcribe
- **Accuracy Rate**: Compare with manual input
- **Error Rate**: Failed transcriptions
- **Cost Tracking**: Track API usage

## Troubleshooting

### Issue: Transcription is Empty

**Problem**: Whisper returns empty text

**Solution**:
- Check audio quality (too quiet, too much noise)
- Verify audio format (must be supported)
- Check API key is valid
- Verify internet connection

### Issue: Wrong Language Detected

**Problem**: Whisper detects wrong language

**Solution**:
```typescript
// Specify language in request
const formData = new FormData();
formData.append("audio", audioBlob);
formData.append("language", "en"); // or "id" for Indonesian
```

### Issue: Slow Transcription

**Problem**: Transcription takes too long

**Solution**:
- Use Whisper-1 instead of Whisper-Large-v3
- Reduce audio duration
- Check internet connection
- Consider browser-based transcription as fallback

## Summary

Whisper transcription provides:

- ✅ **Hands-Free Input**: Voice-based content creation
- ✅ **High Accuracy**: 95%+ accuracy on clear speech
- ✅ **Multi-Language**: Supports Indonesian and English
- ✅ **Fast**: 2-5 second transcription
- ✅ **Observable**: OPIK integration for monitoring

This feature enhances user experience by providing an alternative to typing, making content creation more accessible.

---

**Built with ❤️ for Commit To Change 2026 Hackathon**

🚀 **Powered by OPIK AI**
