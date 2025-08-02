// app/(dashboard)/layout.tsx
'use client'

import { ReactNode, useEffect, useRef } from "react";
import Topbar from "@/components/Topbar";
import ProfileModal from "@/components/ProfileModal";
import Sidebar from "@/components/Sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";
import {
  toggleSidebar,
  toggleProfile,
  setOldPassword,
  setNewPassword,
  resetPasswordFields,
  setActiveTab,
  setWalletAddress,
  setWalletSaved,
  setProfile,
} from "@/reduxElement/Slices/layout";
import { logout } from "@/reduxElement/Slices/auth";

import { useVerifyAuthQuery, useLogoutMutation } from '@/reduxElement/RTK_Queries/auth'; 
import { useSaveWalletAddressMutation } from "@/reduxElement/RTK_Queries/walletAddress";

import { useRouter, usePathname } from 'next/navigation';


export default function DashboardLayout({ children }: { children: ReactNode }) {
const { adminEmail, isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
    const { toast: showToast, dismiss } = useToast();
    const { toast } = useToast();

  const {
    isSidebarOpen,
    isProfileOpen,
    walletAddress,
    oldPassword,
    newPassword,
    activeTab,
    walletSaved,
  } = useAppSelector((state) => state.layout);

  const [saveWalletAddress] = useSaveWalletAddressMutation();
  const firstToastId = useRef<string | null>(null);

  const { data, isLoading, isError } = useVerifyAuthQuery();
  const [LogOut] = useLogoutMutation();

  const router = useRouter();
  
  // useEffect(() => {
  //   if (!isLoading && data && !data.isAuthenticated) {
  //     router.replace('/login');
  //   }
  // }, [isLoading, data, router]);
    
  useEffect(() => {
    // On page load: if wallet empty and not saved
    if (!walletAddress && !walletSaved) {
      if(!isProfileOpen){
        dispatch(toggleProfile());  //open ProfileModel
      }

      dispatch(setProfile(true)); 

      const toastObj = showToast({
        title: "Wallet Address Required",
        description: "Please enter your wallet address to continue.",
        duration: Infinity, // persistent
        className: "bg-yellow-300 text-black",
      });
      firstToastId.current = toastObj.id;
    }
  }, []);

  const handleInputFocus = () => {
    if (firstToastId.current && walletAddress.trim()) {
      dismiss(firstToastId.current);
      firstToastId.current = null;
    }
  };

  const handleBlur = () => {
    if (!walletAddress.trim() || walletSaved) return;

    let remainingTime = 10;

    const confirmToast = toast({
      title: "Confirm Wallet Address?",
      description: `This can't be changed later once saved. Wallet: ${walletAddress}`,
      duration: 10000,
      className: "bg-red-500 text-white confirm-wallet-toast",
      action: (
        <div className="flex items-center gap-3">
          <span className="text-sm">{remainingTime}s</span>
          <button
            onClick={() => {
              dismiss(confirmToast.id);
              dispatch(setWalletAddress(""));
            }}
            className="ml-4 text-white hover:underline"
          >
            ✕
          </button>
        </div>
      ),
    });

    const intervalId = setInterval(() => {
      remainingTime -= 1;
      if (remainingTime >= 0) {
        confirmToast.update?.({
          id: confirmToast.id,
          action: (
            <div className="flex items-center gap-3">
              <span className="text-sm">{remainingTime}s</span>
              <button
                onClick={() => {
                  dismiss(confirmToast.id);
                  dispatch(setWalletAddress(""));
                  clearInterval(intervalId);
                }}
                className="ml-4 text-white hover:underline"
              >
                ✕
              </button>
            </div>
          ),
        });
      }
    }, 1000);

    setTimeout(async () => {
      clearInterval(intervalId);
      if (walletAddress.trim()) {
        try {
          const response = await saveWalletAddress({
            email: adminEmail || "guest@email.com",
            walletAddress,
          }).unwrap();

          dispatch(setWalletSaved(true));

          toast({
            title: "Wallet Saved",
            description: response.message,
            duration: 3000,
          });
        } catch (error: any) {
          const err = error?.data;

          const toastMap: Record<string, { title: string; description: string }> = {
            MISSING_FIELDS: {
              title: "Missing Fields",
              description: "Email and wallet address are required.",
            },
            USER_NOT_FOUND: {
              title: "User Not Found",
              description: "No account found for this email.",
            },
            SERVER_ERROR: {
              title: "Server Error",
              description: "Something went wrong while saving wallet address.",
            },
          };

          const toastContent = toastMap[err?.type] ?? {
            title: "Unknown Error",
            description: "An error occurred. Please try again.",
          };

          toast({
            variant: "destructive",
            title: toastContent.title,
            description: toastContent.description,
            duration: 3000,
          });
        }
      }
    }, 10000);
  };

const handleLogout = async () => {
  try {
    const response = await LogOut().unwrap();
    console.log(response.message);

    dispatch(logout());

    router.push('/login');

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
  } catch (err) {

    console.error('Logout failed:', err);

    // Optional: toast for failure
    toast({
      variant: 'destructive',
      title: 'Logout Failed',
      description: 'Something went wrong. Please try again.',
      duration: 3000,
    });
  }
};


  const handleProfileUpdate = async () => {
    if (oldPassword && newPassword.length >= 8) {
      toast({
        title: "Password Updated",
        description: "Your password has been updated.",
        duration: 3000,
      });
    }
    dispatch(resetPasswordFields());
    dispatch(toggleProfile());
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => dispatch(setActiveTab(tab))}
        handleLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => dispatch(toggleSidebar())}
      />

      <div className="flex-1">
        <Topbar
          activeTab={activeTab}
          toggleSidebar={() => dispatch(toggleSidebar())}
          adminEmail={adminEmail || "guest@email.com"}
          onProfileClick={() => dispatch(toggleProfile())}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => dispatch(toggleProfile())}
          adminEmail={adminEmail || "guest@email.com"}
          walletAddress={walletAddress || "Not connected"}
          oldPassword={oldPassword}
          newPassword={newPassword}
          setOldPassword={(value) => dispatch(setOldPassword(value))}
          setNewPassword={(value) => dispatch(setNewPassword(value))}
          handleProfileUpdate={handleProfileUpdate}
          walletInputProps={{
            onFocus: handleInputFocus,
            onBlur: handleBlur,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              dispatch(setWalletAddress(e.target.value)),
            value: walletAddress,
          }}
        />

        {children}
      </div>
    </div>
  );
}
