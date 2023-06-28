"use client";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "@/Styles/userArticles.css";
import { useEffect, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";

function userArticles({ params }) {
  const { data: session } = useSession();
  const [tab, settab] = useState("drafts");
  useEffect(() => {
    if (session?.username !== params?.username) {
      redirect("/");
    }
  }, [session]);

  return (
    <ClientProtectedRoute>
      <div className={`userArticlesContainer ${source_Sans_Pro.className}`}>
        <h1>Your Articles</h1>

        <div className="tabs">
          <span className={`${tab == 'drafts' ? 'active' : ''}`} onClick={() => settab('drafts')}>Drafts</span>
          <span className={`${tab == 'published' ? 'active' : ''}`} onClick={() => settab('published')}>Published</span>
        </div>

        {tab == "drafts" && <div className="draftsTab">Draft</div>}

        {tab == "published" && <div className="publishedTab">Published</div>}
      </div>
    </ClientProtectedRoute>
  );
}

export default userArticles;
