import React, { useState } from "react";
import { Settings, Pause, Camera, Download, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLog } from "@/api/entities";
import { useAuth } from "@/contexts/AuthProvider";

export default function CommandModal({ userRole, open, onOpenChange }) {
  const { user } = useAuth();
  const isControlled = typeof open !== "undefined";
  const [internalOpen, setInternalOpen] = useState(false);
  const [executing, setExecuting] = useState(false);

  const effectiveOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (value) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const commands = [
    {
      id: "pause_all",
      label: "Pause All Contracts",
      description: "Emergency pause all smart contract operations",
      icon: Pause,
      danger: true,
      requiresRole: "admin"
    },
    {
      id: "snapshot",
      label: "Trigger System Snapshot",
      description: "Create backup of current system state",
      icon: Camera,
      requiresRole: "admin"
    },
    {
      id: "compliance_export",
      label: "Force Compliance Export",
      description: "Generate full compliance report (ISO 27001/42001)",
      icon: Download,
      requiresRole: "admin"
    },
    {
      id: "alert_test",
      label: "Test Alert System",
      description: "Send test alerts to all monitoring channels",
      icon: AlertTriangle,
      requiresRole: "admin"
    }
  ];

  const executeCommand = async (commandId) => {
    setExecuting(true);

    try {
      const command = commands.find((entry) => entry.id === commandId);

      await AdminLog.create({
        action: `Command: ${command?.label ?? commandId}`,
        endpoint: "/command-center",
        status: "success",
        user_role: user?.role || userRole || "unknown",
        details: `User ${user?.email ?? "unknown"} executed command: ${commandId}`
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Command executed successfully: ${command?.label ?? commandId}`);
      handleOpenChange(false);
    } catch (error) {
      console.error("Command execution failed:", error);

      try {
        await AdminLog.create({
          action: `Command Failed: ${commands.find((c) => c.id === commandId)?.label ?? commandId}`,
          endpoint: "/command-center",
          status: "failure",
          user_role: user?.role || userRole || "unknown",
          details: error.message || "Unknown error"
        });
      } catch (logError) {
        console.error("Failed to log error:", logError);
      }

      alert("Command execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const canExecute = (command) => {
    if (!command.requiresRole) return true;
    const role = userRole || user?.role;
    return role === command.requiresRole;
  };

  return (
    <Dialog open={effectiveOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-[#3B82F6]/30 hover:shadow-xl hover:shadow-[#3B82F6]/40 transition-all z-50"
          size="icon"
        >
          <Settings className="h-6 w-6 text-white animate-spin-slow" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0F1117] border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">⚙️ Command Center</DialogTitle>
          <DialogDescription className="text-white/60">
            Execute critical system operations with full audit logging
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {commands.map((command) => {
            const hasAccess = canExecute(command);
            return (
              <div
                key={command.id}
                className={`p-4 rounded-lg border transition-all ${
                  hasAccess
                    ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    : "bg-white/5 border-white/5 opacity-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        command.danger ? "bg-red-500/20" : "bg-[#3B82F6]/20"
                      }`}
                    >
                      <command.icon
                        className={`w-5 h-5 ${
                          command.danger ? "text-red-400" : "text-[#3B82F6]"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{command.label}</h4>
                        {command.danger && (
                          <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                            Dangerous
                          </Badge>
                        )}
                        {!hasAccess && (
                          <Badge variant="outline" className="bg-white/10 border-white/20 text-white/60 text-xs">
                            Admin Only
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">{command.description}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    disabled={executing || !hasAccess}
                    onClick={() => executeCommand(command.id)}
                    className={`${
                      hasAccess
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {executing ? "Processing..." : "Execute"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-sm text-white/50 gap-2">
            <span>All actions are logged to the Admin Ledger</span>
            <span>ISO 27001 • SOC 2 Type II • AI Governance 42001</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
