import React from "react";
import { Bot, Sparkles, Loader2, FileUp, CheckCircle2, ExternalLink } from "lucide-react";
import "./AiNotificationBanner.css";

const AiNotificationBanner = ({
  isParsing,
  parseStep,
  autoFillResult,
  autoFillInputRef,
  onFileSelect,
}) => {
  return (
    <div className="ajp__ai-banner">
      <div className="ajp__ai-banner-content">
        <div className="ajp__ai-banner-icon-wrap">
          <span className="ajp__ai-banner-icon">
            {isParsing ? (
              <Loader2 size={24} className="ajp__ai-spin-icon" />
            ) : parseStep === "done" ? (
              <Sparkles size={24} color="#34d399" />
            ) : (
              <Bot size={24} color="#c084fc" />
            )}
          </span>
        </div>
        <div className="ajp__ai-banner-text">
          <div className="ajp__ai-banner-title">
            <span className="ajp__ai-badge">AI Auto-Fill</span>
            {parseStep === "done" ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#34d399" }}>
                <CheckCircle2 size={16} /> Form auto-filled! {autoFillResult?.fieldsCount || ""} fields extracted
              </span>
            ) : isParsing ? (
              parseStep === "uploading"
                ? "Uploading notification PDF to Cloudinary…"
                : parseStep === "extracting"
                ? "Reading PDF text…"
                : "PDF is stored on Cloudinary · AI is extracting vacancies, dates, exam pattern & eligibility…"
            ) : (
              "Auto-Fill Form from Official Notification PDF"
            )}
          </div>
          <p className="ajp__ai-banner-desc">
            {parseStep === "done"
              ? "All fields below were populated from your official notification PDF. You can edit any field before submitting."
              : isParsing
              ? "Gemini AI is parsing the document. This usually takes 5-15 seconds depending on document length."
              : "Upload a recruitment notification PDF (UPSC, RRB, SSC, etc.) · AI extracts all fields and vacancy tables automatically"}
          </p>
        </div>
      </div>

      {isParsing ? (
        <div className="ajp__ai-spinner-wrap">
          <div className="ajp__ai-spinner" />
          <span className="ajp__ai-spinner-text">
            {parseStep === "uploading"
              ? "Uploading…"
              : parseStep === "extracting"
              ? "Reading PDF…"
              : "AI Extracting…"}
          </span>
        </div>
      ) : (
        <div className="ajp__ai-actions-wrap">
          <input
            type="file"
            ref={autoFillInputRef}
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={onFileSelect}
          />
          <button
            type="button"
            className="ajp__ai-upload-btn"
            style={{
              background:
                parseStep === "done"
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #6366f1, #a855f7)",
            }}
            onClick={() => autoFillInputRef.current?.click()}
          >
            <FileUp size={16} />
            <span>{parseStep === "done" ? "Re-upload PDF" : "Upload Notification PDF"}</span>
          </button>
          {parseStep === "done" && autoFillResult?.pdfUrl && (
            <a
              href={autoFillResult.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ajp__ai-view-link"
            >
              <ExternalLink size={14} style={{ marginRight: 6 }} />
              View PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default AiNotificationBanner;
