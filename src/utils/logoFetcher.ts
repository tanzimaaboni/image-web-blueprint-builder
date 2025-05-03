
import { toast } from "sonner";

// API keys for various logo services could go here in a real app

/**
 * Fetch a company logo based on company name
 * This uses various free services to attempt to find a logo
 */
export async function fetchCompanyLogo(companyName: string): Promise<string | null> {
  try {
    // Attempt to fetch from Clearbit (doesn't require API key for basic usage)
    const clearbitUrl = `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    
    // Check if the image exists
    const response = await fetch(clearbitUrl, { method: 'HEAD' });
    
    if (response.ok) {
      return clearbitUrl;
    }
    
    // Fallback: attempt to fetch from alternative sources or use a default logo
    // This is where you might implement additional logo APIs with proper API keys

    // For demo purposes, generate a colorful letter logo
    return generateLetterLogo(companyName);
  } catch (error) {
    console.error('Error fetching logo:', error);
    return generateLetterLogo(companyName);
  }
}

/**
 * Generate a data URL for a letter-based logo
 */
export function generateLetterLogo(companyName: string): string {
  const letter = companyName.charAt(0).toUpperCase();
  const colors = [
    '#4f46e5', '#0891b2', '#16a34a', '#ca8a04', '#dc2626', 
    '#9333ea', '#db2777', '#f97316', '#14b8a6', '#8b5cf6'
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/png');
  }
  
  return '';
}

/**
 * Download an image from a URL
 */
export async function downloadImage(url: string, companyName: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = blobUrl;
    link.download = `${companyName.replace(/\s+/g, '-').toLowerCase()}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    toast(`Downloaded ${companyName} logo successfully!`);
  } catch (error) {
    console.error('Error downloading image:', error);
    toast.error(`Failed to download ${companyName} logo`);
  }
}
