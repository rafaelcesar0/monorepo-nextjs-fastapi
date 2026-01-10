"use client";

import { useEffect, useState } from "react";

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_STATUS_URL = `${API_BASE_URL}/`;

type ApiStatus = Record<string, unknown>;

export default function Home() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [payload, setPayload] = useState<ApiStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setErrorMessage(null);

    fetch(API_STATUS_URL, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json()) as ApiStatus;
      })
      .then((data) => {
        setPayload(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Request failed");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-medium">API Status</h2>
            <span className="text-xs text-muted-foreground">
              Base: {API_BASE_URL}
            </span>
          </div>
          <pre className="mt-3 rounded-md bg-muted px-3 py-2 text-xs">
            {status === "loading" && "Connecting..."}
            {status === "error" &&
              `Failed: ${errorMessage ?? "Unknown error"}`}
            {status === "ready" && JSON.stringify(payload, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
