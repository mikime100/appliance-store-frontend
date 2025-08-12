import React, { useState } from "react";
import AdminCommentManager from "../CommentSystem/AdminCommentManager";
import AdminCommentInterface from "./AdminCommentInterface";

function AdminComments() {
  const [activeTab, setActiveTab] = useState("manage"); // "manage" or "comment"

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center space-x-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "manage"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Manage Comments
        </button>
        <button
          onClick={() => setActiveTab("comment")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "comment"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          Add Comments
        </button>
      </div>

      {/* Content */}
      {activeTab === "manage" ? (
        <AdminCommentManager />
      ) : (
        <AdminCommentInterface />
      )}
    </div>
  );
}

export default AdminComments;
