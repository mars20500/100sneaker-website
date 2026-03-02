import { useEffect, useState } from "react";
import { getSiteContent, defaultSiteContent, type SiteContent } from "@/lib/siteContentService";

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent()
      .then(setContent)
      .catch(() => setContent(defaultSiteContent))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
