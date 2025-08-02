import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import React from "react";
import {  useAppSelector } from "@/store/hooks";


interface ProfileModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  adminEmail: string;
  walletAddress: string;
  oldPassword: string;
  newPassword: string;
  setOldPassword: (val: string) => void;
  setNewPassword: (val: string) => void;
  handleProfileUpdate: () => void;
  walletInputProps: React.InputHTMLAttributes<HTMLInputElement>; // NEW
  walletSaved?: boolean; // NEW - to disable input if wallet is saved
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
  walletAddress,
  oldPassword,
  newPassword,
  setOldPassword,
  setNewPassword,
  handleProfileUpdate,
  walletInputProps,
}) => {

    const {walletSaved} = useAppSelector((state) => state.layout);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-lg text-foreground">Profile Settings</DialogTitle>
          <CardDescription className="text-sm text-muted-foreground">
            View your account information and update your password
          </CardDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input
              type="email"
              value={adminEmail}
              readOnly
              className="text-sm text-foreground bg-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Wallet Address</label>
            <Input
              {...walletInputProps}
              type="text"
              disabled={walletSaved}
              placeholder={walletAddress}
              className={`text-sm text-foreground font-mono ${
                walletSaved ? "bg-muted cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Old Password</label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-sm text-foreground"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleProfileUpdate} className="w-full btn-crypto shadow-glow">
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
