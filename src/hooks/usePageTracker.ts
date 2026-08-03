import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = (): string => {
  const key = "dn_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const usePageTracker = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const visitorId = getVisitorId();
    supabase
      .from("page_views")
      .insert({ page: pathname, visitor_id: visitorId })
      .then(() => {});
  }, [pathname]);
};
