import React, { useState } from "react";
import { AdminMember } from "../../types";

interface RolesPermissionsScreenProps {
  members: AdminMember[];
  onUpdatePermissions: (memberId: string, updatedMember: AdminMember) => void;
  onAddMember: (newMember: AdminMember) => void;
}

export default function RolesPermissionsScreen({
  members,
  onUpdatePermissions,
  onAddMember,
}: RolesPermissionsScreenProps) {
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding new admin member
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"Super Admin" | "Support" | "Content Manager">("Support");

  const handleTogglePermission = (
    module: keyof AdminMember["permissions"],
    access: "view" | "edit"
  ) => {
    if (!selectedMember) return;
    const currentModule = selectedMember.permissions[module];
    const updatedMember: AdminMember = {
      ...selectedMember,
      permissions: {
        ...selectedMember.permissions,
        [module]: {
          ...currentModule,
          [access]: !currentModule[access],
        },
      },
    };
    setSelectedMember(updatedMember);
    onUpdatePermissions(selectedMember.id, updatedMember);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const member: AdminMember = {
      id: `adm_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      lastActive: "Just now",
      permissions: {
        plans: { view: true, edit: newRole === "Super Admin" },
        users: { view: true, edit: newRole !== "Content Manager" },
        content: { view: true, edit: true },
        settings: { view: newRole === "Super Admin", edit: newRole === "Super Admin" },
        financials: { view: newRole === "Super Admin", edit: newRole === "Super Admin" },
      },
    };
    onAddMember(member);
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>
            🛡️ Admin Roles & RBAC Permissions
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
            Manage access control permissions for Super Admins, Support, and Content Managers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
        >
          + Add Admin Team Member
        </button>
      </div>

      {/* Admin Members Table */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                <th style={{ padding: 12 }}>Admin Member</th>
                <th style={{ padding: 12 }}>Role Badge</th>
                <th style={{ padding: 12 }}>Last Active</th>
                <th style={{ padding: 12 }}>Key Permissions</th>
                <th style={{ padding: 12 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 12,
                          color: "white",
                        }}
                      >
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "white" }}>{member.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        background:
                          member.role === "Super Admin"
                            ? "rgba(236,72,153,0.2)"
                            : member.role === "Support"
                            ? "rgba(6,182,212,0.2)"
                            : "rgba(124,58,237,0.2)",
                        color:
                          member.role === "Super Admin"
                            ? "#f472b6"
                            : member.role === "Support"
                            ? "#67e8f9"
                            : "#a78bfa",
                        border:
                          member.role === "Super Admin"
                            ? "1px solid rgba(236,72,153,0.4)"
                            : member.role === "Support"
                            ? "1px solid rgba(6,182,212,0.4)"
                            : "1px solid rgba(124,58,237,0.4)",
                      }}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td style={{ padding: 12, color: "#cbd5e1", fontSize: 12, fontFamily: "JetBrains Mono" }}>
                    {member.lastActive}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(member.permissions).map(([modKey, perm]) => (
                        <span
                          key={modKey}
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: perm.edit
                              ? "rgba(16, 185, 129, 0.15)"
                              : perm.view
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.02)",
                            color: perm.edit ? "#34d399" : perm.view ? "#cbd5e1" : "#64748b",
                            textTransform: "capitalize",
                          }}
                        >
                          {modKey}: {perm.edit ? "Edit" : perm.view ? "View" : "None"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <button
                      onClick={() => setSelectedMember(member)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(236, 72, 153, 0.15)",
                        border: "1px solid rgba(236, 72, 153, 0.3)",
                        color: "#f472b6",
                        cursor: "pointer",
                      }}
                    >
                      ⚙ Edit Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Permissions Panel / Modal */}
      {selectedMember && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,5,16,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ width: 540, padding: 24, borderRadius: 16, background: "rgba(13,13,35,0.95)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, color: "white", fontSize: 18 }}>Edit Permissions: {selectedMember.name}</h3>
                <span style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>{selectedMember.role} • {selectedMember.email}</span>
              </div>
              <button onClick={() => setSelectedMember(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(["plans", "users", "content", "settings", "financials"] as const).map((module) => {
                const perm = selectedMember.permissions[module];
                return (
                  <div key={module} style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 13, textTransform: "capitalize" }}>{module} Module</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Control view & modification rights for {module}</div>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={perm.view}
                          onChange={() => handleTogglePermission(module, "view")}
                        />
                        View
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#ec4899", fontWeight: 600, cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={perm.edit}
                          onChange={() => handleTogglePermission(module, "edit")}
                        />
                        Edit / Delete
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button
                onClick={() => setSelectedMember(null)}
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: 13, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Member Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,5,16,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ width: 440, padding: 24, borderRadius: 16, background: "rgba(13,13,35,0.95)" }}>
            <h3 style={{ margin: "0 0 14px", color: "white" }}>Add Admin Team Member</h3>
            <form onSubmit={handleCreateMember} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="glass-input"
                  style={{ marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="vikram@jobprep.ai"
                  className="glass-input"
                  style={{ marginTop: 4 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Admin Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  style={{ width: "100%", padding: 10, marginTop: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", borderRadius: 8 }}
                >
                  <option value="Support">Support Admin</option>
                  <option value="Content Manager">Content Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ padding: "6px 14px" }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: "6px 18px", background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}>Add Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
