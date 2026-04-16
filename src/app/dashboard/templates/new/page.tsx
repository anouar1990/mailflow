"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import grapesjsNewsletter from "grapesjs-preset-newsletter";
import "grapesjs/dist/css/grapes.min.css";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewTemplatePage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("New Template");
  const router = useRouter();

  useEffect(() => {
    if (!editorRef.current) return;

    const gjsEditor = grapesjs.init({
      container: editorRef.current,
      plugins: [grapesjsNewsletter],
      pluginsOpts: {
        [grapesjsNewsletter as any]: {
          // options for the newsletter plugin
        },
      },
      storageManager: false, // We'll handle saving manually
      panels: {
        defaults: [
          {
            id: "panel-devices",
            el: ".panel__devices",
            buttons: [
              {
                id: "device-desktop",
                label: "D",
                command: "set-device-desktop",
                active: true,
                togglable: false,
              },
              {
                id: "device-mobile",
                label: "M",
                command: "set-device-mobile",
                togglable: false,
              },
            ],
          },
        ],
      },
    });

    setEditor(gjsEditor);

    return () => {
      if (gjsEditor) {
        gjsEditor.destroy();
      }
    };
  }, []);

  const handleSave = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    const html = editor.getHtml();
    const css = editor.getCss();
    
    const inlineHtml = `<style>${css}</style>${html}`;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in to save templates.");
        setIsSaving(false);
        return;
    }

    const { error } = await supabase.from("templates").insert({
        name: templateName,
        subject: templateName, // Fallback subject
        html_content: inlineHtml,
        text_content: "Please view in HTML format.", // Basic fallback
        user_id: user.id
    });
    
    setIsSaving(false);
    
    if (error) {
        alert("Failed to save template. Please try again.");
    } else {
        alert("Template saved successfully!");
        router.push("/dashboard/templates");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/templates"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="text-lg font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-64"
            placeholder="Template Name"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="panel__devices flex gap-1 rounded-md border border-gray-200 p-1"></div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Template
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden relative" id="gjs-container">
        <div ref={editorRef} className="h-full w-full">
          {/* Default Content */}
          <table className="w-full h-full bg-gray-50 p-8">
            <tbody>
              <tr>
                <td align="center" valign="top">
                  <h1>Welcome to your new Email Template</h1>
                  <p>Drag and drop elements from the right block panel.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
