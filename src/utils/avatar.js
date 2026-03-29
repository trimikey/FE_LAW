export const getBackendOrigin = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
  if (typeof baseUrl === "string" && baseUrl.startsWith("http")) {
    return baseUrl.replace(/\/api\/?$/, "");
  }
  return "http://localhost:3001";
};

export const resolveAvatarUrl = (avatarPath) => {
  if (!avatarPath) return "";

  const backendOrigin = getBackendOrigin();
  const normalized = String(avatarPath).replace(/\\/g, "/");

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const lower = normalized.toLowerCase();
  const slashUploadsIndex = lower.lastIndexOf("/uploads/");
  if (slashUploadsIndex >= 0) {
    return `${backendOrigin}${normalized.slice(slashUploadsIndex)}`;
  }

  const uploadsIndex = lower.indexOf("uploads/");
  if (uploadsIndex >= 0) {
    return `${backendOrigin}/${normalized.slice(uploadsIndex)}`;
  }

  return `${backendOrigin}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
};
