export function getDisplayImageUrl(url?: string): string {
    if (!url) return "";
    // If the image points to backend /uploads/, route it via local CDN /uploads/
    if (url.includes("/uploads/")) {
        const filename = url.split("/uploads/").pop();
        if (filename) {
            return `/uploads/${filename}`;
        }
    }
    return url;
}

