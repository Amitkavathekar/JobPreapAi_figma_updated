import React, { useState } from "react";
import { ActivityLogItem } from "../../types";

interface ActivityLogScreenProps {
  logs: ActivityLogItem[];
}

export default function ActivityLogScreen({ logs }: ActivityLogScreenProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const uniqueTypes = ["All", "Pricing", "User Action", "Coupon", "Settings", "Content"];

  const filteredLogs = logs.filter((log) => {
    const matchesType = selectedTypeFilter === "All" || log.type === selectedTypeFilter;
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>
          📜 System & Admin Activity Audit Log
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
          Comprehensive real-time history of configuration changes, pricing updates, user suspensions, and coupon operations
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: "16px 20px", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="glass-input"
            style={{ padding: "8px 12px", fontSize: 13 }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, color: "#94a3b8" }}>Category:</label>
          <select
            value={selectedTypeFilter}
            onChange={handleFilterChange}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Table */}
      <div className="glass-card" style={{ padding: 22 }}>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 16 }}>No activity logs found</div>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>Try clearing your search query or filter selection</div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                    <th style={{ padding: 12 }}>Admin User</th>
                    <th style={{ padding: 12 }}>Action Description</th>
                    <th style={{ padding: 12 }}>Target Object</th>
                    <th style={{ padding: 12 }}>Category</th>
                    <th style={{ padding: 12 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700, color: "white" }}>{log.adminName}</div>
                      </td>
                      <td style={{ padding: 12, color: "#e2e8f0", fontWeight: 600 }}>{log.action}</td>
                      <td style={{ padding: 12, fontFamily: "JetBrains Mono", color: "#06b6d4", fontSize: 12 }}>
                        {log.target}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            background:
                              log.type === "Pricing"
                                ? "rgba(245, 158, 11, 0.15)"
                                : log.type === "User Action"
                                ? "rgba(239, 68, 68, 0.15)"
                                : log.type === "Coupon"
                                ? "rgba(236, 72, 153, 0.15)"
                                : "rgba(6, 182, 212, 0.15)",
                            color:
                              log.type === "Pricing"
                                ? "#fbbf24"
                                : log.type === "User Action"
                                ? "#f87171"
                                : log.type === "Coupon"
                                ? "#f472b6"
                                : "#67e8f9",
                          }}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td style={{ padding: 12, color: "#64748b", fontSize: 12, fontFamily: "JetBrains Mono" }}>
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Showing Page {currentPage} of {totalPages} ({filteredLogs.length} total logs)
              </span>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="btn-ghost"
                  style={{ padding: "4px 12px", fontSize: 12, opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-ghost"
                  style={{ padding: "4px 12px", fontSize: 12, opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
