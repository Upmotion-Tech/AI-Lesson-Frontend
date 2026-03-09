import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Copy, Download, KeyRound, RotateCcw, Save, ShieldCheck, User } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch.js";
import { useAppSelector } from "../hooks/useAppSelector.js";
import { fetchMe } from "../store/authThunks.js";
import apiClient from "../utils/apiClient.js";
import Card from "../components/common/Card.jsx";
import FileInput from "../components/common/FileInput.jsx";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";
import PageTransition from "../components/common/PageTransition.jsx";
import { getUserAvatarUrl } from "../utils/userAvatar.js";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isStartingTwoFactor, setIsStartingTwoFactor] = useState(false);
  const [isVerifyingTwoFactor, setIsVerifyingTwoFactor] = useState(false);
  const [isDisablingTwoFactor, setIsDisablingTwoFactor] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [disableTwoFactorCode, setDisableTwoFactorCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [regenerateCode, setRegenerateCode] = useState("");
  const [isRegeneratingBackupCodes, setIsRegeneratingBackupCodes] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "male",
    dateOfBirth: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      gender: user.gender || "male",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    });
    setAvatarPreview(getUserAvatarUrl(user.profileImage));
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(getUserAvatarUrl(user?.profileImage));
    }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setIsSavingProfile(true);
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("gender", form.gender);
      payload.append("dateOfBirth", form.dateOfBirth || "");
      if (avatarFile) {
        payload.append("profileImage", avatarFile);
      }

      await apiClient.patch("/users/updateProfile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await dispatch(fetchMe()).unwrap();
      setAvatarFile(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill current and new password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsSavingPassword(true);
      await apiClient.patch("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleStartTwoFactorSetup = async () => {
    try {
      setIsStartingTwoFactor(true);
      const response = await apiClient.post("/auth/2fa/setup");
      setTwoFactorSetup({
        qrCodeDataUrl: response.data.qrCodeDataUrl,
        manualEntryKey: response.data.manualEntryKey,
      });
      setTwoFactorCode("");
      toast.success("Scan the QR and enter the 6-digit code");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to initialize 2FA");
    } finally {
      setIsStartingTwoFactor(false);
    }
  };

  const handleVerifyTwoFactorSetup = async (event) => {
    event.preventDefault();

    if (!twoFactorCode || twoFactorCode.length < 6) {
      toast.error("Enter a valid 6-digit authenticator code");
      return;
    }

    try {
      setIsVerifyingTwoFactor(true);
      const verifyResponse = await apiClient.post("/auth/2fa/verify-setup", {
        token: twoFactorCode,
      });
      setTwoFactorSetup(null);
      setTwoFactorCode("");
      setBackupCodes(verifyResponse.data.backupCodes || []);
      await dispatch(fetchMe()).unwrap();
      toast.success("2FA enabled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify 2FA");
    } finally {
      setIsVerifyingTwoFactor(false);
    }
  };

  const handleDisableTwoFactor = async (event) => {
    event.preventDefault();

    if (!disableTwoFactorCode || disableTwoFactorCode.length < 6) {
      toast.error("Enter a valid 6-digit authenticator code");
      return;
    }

    try {
      setIsDisablingTwoFactor(true);
      await apiClient.post("/auth/2fa/disable", {
        token: disableTwoFactorCode,
      });
      setDisableTwoFactorCode("");
      setBackupCodes([]);
      await dispatch(fetchMe()).unwrap();
      toast.success("2FA disabled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setIsDisablingTwoFactor(false);
    }
  };

  const handleRegenerateBackupCodes = async (event) => {
    event.preventDefault();
    if (!regenerateCode || regenerateCode.length < 6) {
      toast.error("Enter authenticator or backup code");
      return;
    }

    try {
      setIsRegeneratingBackupCodes(true);
      const response = await apiClient.post("/auth/2fa/regenerate-backup-codes", {
        token: regenerateCode,
      });
      setBackupCodes(response.data.backupCodes || []);
      setRegenerateCode("");
      toast.success("Backup codes regenerated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to regenerate backup codes");
    } finally {
      setIsRegeneratingBackupCodes(false);
    }
  };

  const copyBackupCodes = async () => {
    if (!backupCodes.length) return;
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      toast.success("Backup codes copied");
    } catch {
      toast.error("Failed to copy backup codes");
    }
  };

  const downloadBackupCodesPdf = async () => {
    if (!backupCodes.length) return;

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const generatedAt = new Date().toLocaleString();

      doc.setFontSize(18);
      doc.text("AI Lesson - 2FA Backup Codes", 14, 20);
      doc.setFontSize(11);
      doc.text(`Generated: ${generatedAt}`, 14, 30);
      doc.text("Each code can be used once. Keep this file secure.", 14, 37);

      let y = 50;
      backupCodes.forEach((code, index) => {
        doc.text(`${index + 1}. ${code}`, 20, y);
        y += 8;
      });

      doc.save("ai-lesson-2fa-backup-codes.pdf");
      toast.success("Backup codes PDF downloaded");
    } catch {
      toast.error("Failed to generate backup codes PDF");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8 md:p-10 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Preferences</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Settings</h1>
          <p className="text-slate-300 mt-3">Manage your profile and security settings.</p>
        </div>

        <Card className="rounded-[1.5rem]">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900">Profile Settings</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Profile Image</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (user?.name?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <FileInput
                    label="Upload image"
                    accept="image/*"
                    onChange={onAvatarChange}
                  />
                </div>
              </div>
            </div>

            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={onInputChange}
              placeholder="Your full name"
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              // onChange={onInputChange}
              placeholder="you@example.com"
              required
              disabled
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={onInputChange}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                loading={isSavingProfile}
                icon={<Save className="h-4 w-4" />}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-[1.5rem]">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900">Two-Factor Authentication</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Protect your account with an authenticator app (Google Authenticator, Authy, Microsoft Authenticator).
            </p>

            {user?.twoFactorEnabled ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-emerald-700">
                  2FA is currently enabled on your account.
                </p>
                <form onSubmit={handleRegenerateBackupCodes} className="space-y-4">
                  <Input
                    label="Authenticator or backup code to regenerate backup codes"
                    name="regenerateCode"
                    value={regenerateCode}
                    onChange={(event) => setRegenerateCode(event.target.value)}
                    placeholder="Enter current code"
                    required
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    loading={isRegeneratingBackupCodes}
                    icon={<RotateCcw className="h-4 w-4" />}
                  >
                    Regenerate Backup Codes
                  </Button>
                </form>
                <form onSubmit={handleDisableTwoFactor} className="space-y-4">
                  <Input
                    label="Authenticator code to disable 2FA"
                    name="disableTwoFactorCode"
                    value={disableTwoFactorCode}
                    onChange={(event) => setDisableTwoFactorCode(event.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                  />
                  <Button type="submit" variant="danger" loading={isDisablingTwoFactor}>
                    Disable 2FA
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {!twoFactorSetup ? (
                  <Button onClick={handleStartTwoFactorSetup} loading={isStartingTwoFactor}>
                    Setup 2FA
                  </Button>
                ) : (
                  <form onSubmit={handleVerifyTwoFactorSetup} className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-2xl bg-white">
                      <img
                        src={twoFactorSetup.qrCodeDataUrl}
                        alt="Scan this QR code in your authenticator app"
                        className="h-48 w-48 object-contain mx-auto"
                      />
                      <p className="mt-3 text-xs text-slate-600 text-center break-all">
                        Manual key: <span className="font-semibold">{twoFactorSetup.manualEntryKey}</span>
                      </p>
                    </div>
                    <Input
                      label="Authenticator 6-digit code"
                      name="twoFactorCode"
                      value={twoFactorCode}
                      onChange={(event) => setTwoFactorCode(event.target.value)}
                      placeholder="Enter 6-digit code"
                      required
                    />
                    <div className="flex items-center gap-3">
                      <Button type="submit" loading={isVerifyingTwoFactor}>
                        Verify and Enable 2FA
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setTwoFactorSetup(null);
                          setTwoFactorCode("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {backupCodes.length > 0 && (
              <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-amber-800">
                    Save these backup codes. Each code can be used once for login.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyBackupCodes}
                      icon={<Copy className="h-4 w-4" />}
                    >
                      Copy
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadBackupCodesPdf}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code) => (
                    <div
                      key={code}
                      className="rounded-lg bg-white border border-amber-200 px-3 py-2 text-xs font-black text-amber-900 tracking-widest"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="rounded-[1.5rem]">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black text-slate-900">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={onPasswordInputChange}
              showPasswordToggle
              required
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={onPasswordInputChange}
              showPasswordToggle
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={onPasswordInputChange}
              showPasswordToggle
              required
            />
            <div className="pt-2">
              <Button type="submit" loading={isSavingPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

      </div>
    </PageTransition>
  );
};

export default SettingsPage;
