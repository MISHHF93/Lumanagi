<<<<<<< HEAD

import React, { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)
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
<<<<<<< HEAD
import { useAppStore } from "@/store/useAppStore";
=======
import { useAuth } from "@/contexts/AuthProvider";
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)

export default function CommandModal({ userRole, open, onOpenChange }) {
  const { user } = useAuth();
  const isControlled = typeof open !== "undefined";
  const [internalOpen, setInternalOpen] = useState(false);
  const [executing, setExecuting] = useState(false);
<<<<<<< HEAD
  const { user, fetchUser } = useAppStore((state) => ({
    user: state.user,
    fetchUser: state.fetchUser
  }));

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [fetchUser, user]);
=======
  const effectiveOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (value) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)

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
<<<<<<< HEAD
      const currentUser = user ?? (await fetchUser());
      if (!currentUser) {
        throw new Error('User context unavailable');
      }

      // Log the command execution
      await AdminLog.create({
        action: `Command: ${commands.find(c => c.id === commandId)?.label}`,
        endpoint: "/command-center",
        status: "success",
        user_role: currentUser.role,
        details: `User ${currentUser.email} executed command: ${commandId}`
      });
=======
      const currentUser = user;
      
      // Log the command execution
        await AdminLog.create({
          action: `Command: ${commands.find(c => c.id === commandId)?.label}`,
          endpoint: "/command-center",
          status: "success",
          user_role: currentUser?.role || userRole,
          details: `User ${currentUser?.email || 'unknown'} executed command: ${commandId}`
        });
>>>>>>> 5b50ce5 (feat: finalize project and complete migration)

      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Command executed successfully: ${commands.find(c => c.id === commandId)?.label}`);
      handleOpenChange(false);
    } catch (error) {
      console.error("Command execution failed:", error);
      
      try {
        await AdminLog.create({
          action: `Command Failed: ${commands.find(c => c.id === commandId)?.label}`,
          endpoint: "/command-center",
          status: "failure",
          details: error.message || "Unknown error"
        });
      } catch (logError) {
        console.error("Failed to log error:", logError);
      }
      
      alert('Command execution failed');
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
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                    : 'bg-white/5 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      command.danger 
                        ? 'bg-red-500/20' 
                        : 'bg-[#3B82F6]/20'
                    }`}>
                      <command.icon className={`w-5 h-5 ${
                        command.danger ? 'text-red-400' : 'text-[#3B82F6]'
                      }`} />
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
                      <p className="text-sm text-white/60">{command.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={!hasAccess || executing}
                    onClick={() => executeCommand(command.id)}
                    className={
                      command.danger
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                        : 'bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30'
                    }
                  >
                    {executing ? 'Executing...' : 'Execute'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="border-t border-white/10 pt-4">
          <p className="text-xs text-white/50">
            All commands are logged in Audit Logs with ISO 27001 compliance tracking
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
