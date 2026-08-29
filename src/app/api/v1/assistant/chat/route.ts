import { NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { processAssistantQuery, type AssistantProcessInput } from "@/lib/assistant-engine";

export const dynamic = "force-dynamic";

interface AssistantChatPayload extends AssistantProcessInput {}

/**
 * Runs prediction through Python assistant bridge if FastAPI is offline
 */
async function runPythonAssistantBridge(payload: AssistantChatPayload): Promise<any> {
  return new Promise((resolve) => {
    const projectRoot = process.cwd();
    const isWindows = process.platform === "win32";
    const pythonExe = isWindows
      ? path.join(projectRoot, "Crop_Recom_Model", ".venv", "Scripts", "python.exe")
      : path.join(projectRoot, "Crop_Recom_Model", ".venv", "bin", "python");

    const scriptPath = path.join(
      projectRoot,
      "Crop_Recom_Model",
      "assistant_bridge.py",
    );

    if (!fs.existsSync(pythonExe) || !fs.existsSync(scriptPath)) {
      return resolve(null);
    }

    const child = execFile(
      pythonExe,
      [scriptPath, JSON.stringify(payload)],
      { timeout: 9000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("[Assistant Python Bridge Error]", error, stderr);
          return resolve(null);
        }
        try {
          const trimmed = stdout.trim();
          const jsonStart = trimmed.indexOf("{");
          const jsonEnd = trimmed.lastIndexOf("}");
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const parsed = JSON.parse(trimmed.substring(jsonStart, jsonEnd + 1));
            return resolve(parsed);
          }
          return resolve(null);
        } catch (e) {
          console.error("[Assistant JSON Parse Error]", e);
          return resolve(null);
        }
      },
    );

    child.stdin?.end();
  });
}

/**
 * POST /api/v1/assistant/chat
 */
export async function POST(req: Request) {
  try {
    const body: AssistantChatPayload = await req.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty." },
        { status: 400 },
      );
    }

    const mlApiUrl =
      process.env.ML_API_URL ||
      process.env.NEXT_PUBLIC_ML_API_URL ||
      "http://localhost:8000";

    // 1. Try FastAPI unified assistant endpoint
    try {
      const fastApiRes = await fetch(
        `${mlApiUrl.replace(/\/+$/, "")}/api/v1/assistant/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(3000),
        },
      );

      if (fastApiRes.ok) {
        const json = await fastApiRes.json();
        if (json && json.data) {
          return NextResponse.json(json);
        }
      }
    } catch {
      // Proceed to python bridge
    }

    // 2. Try direct Python CLI bridge
    try {
      const bridgeResult = await runPythonAssistantBridge(body);
      if (bridgeResult && bridgeResult.reply) {
        return NextResponse.json({ success: true, data: bridgeResult });
      }
    } catch {
      // Proceed to TS engine
    }

    // 3. Complete TypeScript Assistant Engine (RAG + Tools + OpenRouter/InsForge AI Gateway)
    const result = await processAssistantQuery(body);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("[Assistant API Error]", err);
    return NextResponse.json(
      {
        success: false,
        error: "AI Assistant is temporarily unavailable. Please try again.",
      },
      { status: 500 },
    );
  }
}
