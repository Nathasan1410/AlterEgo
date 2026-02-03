// Voice Transcription API - Groq Whisper
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createResponse } from "@/src/utils/apiResponse";
import { validateFormData } from "@/src/utils/validation";
import { TranscriptionInputSchema } from "@/src/schemas/generation";
import { handleError } from "@/src/utils/errorHandler";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await request.formData();

    const validated = validateFormData(TranscriptionInputSchema, formData);
    if (!validated.success) {
      return NextResponse.json(
        createResponse(null, { code: "VALIDATION_ERROR", message: validated.error! }, 0),
        { status: 400 }
      );
    }

    const { audio, language } = validated.data;
    const file = audio as File;

    // Convert File to Buffer for Groq
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File-like object for Groq
    const groqFile = new File([buffer], file.name, { type: file.type });

    // Transcribe using Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: groqFile,
      model: "whisper-large-v3",
      language: language,
      response_format: "json",
      temperature: 0.0,
    });

    const duration = (Date.now() - startTime) / 1000;

    return NextResponse.json(
      createResponse(
        { text: transcription.text, language, duration },
        undefined,
        Date.now() - startTime
      )
    );
  } catch (error) {
    return handleError(error);
  }
}
