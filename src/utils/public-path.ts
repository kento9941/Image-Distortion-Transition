export const publicPath = (path: string): string => {
    if (!path) return "";
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const baseUrl = import.meta.env.BASE_URL;
    return baseUrl.endsWith('/') ? baseUrl + cleanPath : `${baseUrl}/${cleanPath}`;
};