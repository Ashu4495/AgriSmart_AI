"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { ArrowLeft, CheckCircle2, FileText, Globe, Play, ExternalLink, Calendar, BookOpen } from "lucide-react";
import type { KnowledgeResource } from "@/lib/knowledge";
import { insforge } from "@/lib/insforge";

export default function KnowledgeResourcePage() {
  const params = useParams();
  const router = useRouter();
  const [resource, setResource] = useState<KnowledgeResource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResource() {
      if (!params.id) return;
      try {
        const { data, error } = await insforge.database
          .from("knowledge_resources")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error || !data) {
          console.error("Resource not found");
          return;
        }

        setResource(data as KnowledgeResource);
      } catch (err) {
        console.error("Failed to fetch resource", err);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [params.id]);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#168447] border-t-transparent" />
        </div>
      </DashboardShell>
    );
  }

  if (!resource) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-foreground">Resource Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The knowledge resource you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#168447] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#168447]/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </DashboardShell>
    );
  }

  const handleAction = () => {
    const url = resource.document_url || resource.source_url;
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getActionText = () => {
    switch(resource.resource_type) {
      case 'PDF': return "Open PDF";
      case 'WEBSITE': return "Visit Official Website";
      case 'VIDEO': return "Watch Video";
      case 'ARTICLE': return "Read Article";
      case 'GOVERNMENT_DOCUMENT': return "View Official Document";
      default: return "Access Resource";
    }
  };

  const getActionIcon = () => {
    switch(resource.resource_type) {
      case 'PDF': return <FileText className="h-4 w-4" />;
      case 'WEBSITE': return <Globe className="h-4 w-4" />;
      case 'VIDEO': return <Play className="h-4 w-4 fill-current" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </button>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          {/* Header Banner */}
          <div className="h-32 w-full bg-gradient-to-r from-[#168447] to-emerald-600 sm:h-48" />
          
          <div className="relative px-6 pb-8 sm:px-10">
            {/* Icon / Avatar Overlap */}
            <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-white shadow-md">
              <BookOpen className="h-10 w-10 text-[#168447]" />
            </div>

            <div className="mt-16 sm:mt-14">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {resource.category}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {resource.resource_type}
                </span>
              </div>

              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {resource.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span>Source: {resource.source_name}</span>
                  {resource.is_verified && (
                    <span className="flex items-center gap-1 text-[#168447] ml-2 bg-[#eaf7ee] px-2 py-0.5 rounded-full text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                
                {resource.published_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {new Date(resource.published_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base font-bold text-foreground border-b border-border/60 pb-2 mb-4">
                About this Resource
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/30 rounded-xl p-4">
              <div>
                <span className="block text-xs font-medium text-muted-foreground">State / Region</span>
                <span className="block mt-1 text-sm font-semibold text-foreground">{resource.state}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-muted-foreground">Crop Focus</span>
                <span className="block mt-1 text-sm font-semibold text-foreground">{resource.crop || 'General'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-muted-foreground">Language</span>
                <span className="block mt-1 text-sm font-semibold text-foreground">{resource.language || 'English'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-muted-foreground">Length</span>
                <span className="block mt-1 text-sm font-semibold text-foreground">
                  {resource.page_count ? `${resource.page_count} Pages` : resource.duration ? resource.duration : 'N/A'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleAction}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#168447] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#168447]/90 hover:scale-[1.02]"
              >
                {getActionIcon()}
                {getActionText()}
              </button>
              
              {resource.source_url && (
                <a
                  href={resource.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-8 py-3.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  View Original Source
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
