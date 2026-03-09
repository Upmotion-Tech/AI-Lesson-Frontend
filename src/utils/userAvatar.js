export const getUserAvatarUrl = (profileImage) => {
  if (!profileImage) return null;

  if (/^(https?:|data:|blob:)/i.test(profileImage)) {
    return profileImage;
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const origin = apiBase.replace(/\/api\/?$/i, "");

  if (!origin) return profileImage;

  if (profileImage.startsWith("/")) {
    return `${origin}${profileImage}`;
  }

  return `${origin}/${profileImage}`;
};
