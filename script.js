// 1. Initialize Supabase client
const supabaseUrl = 'https://hassuqjrnxrqngxagwru.supabase.co'; // <-- Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc3N1cWpybnhycW5neGFnd3J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTU2NTMsImV4cCI6MjA2MjE3MTY1M30.IEb3atj9bDb4GbiMtoC-OBn0D0P5jXSfsRbQ741bBeo'; // <-- Replace with your anon/public key
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let links = {};

function getFileIcon(url) {
  // Simple icon logic based on url/file type
  if (url.includes('drive.google.com')) return '📁';
  if (url.match(/\.(pdf)$/i)) return '📄';
  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return '🖼️';
  if (url.match(/\.(mp4|avi|mov)$/i)) return '🎬';
  return '📄';
}

function renderFileManager() {
  const fileManager = document.getElementById('fileManager');
  fileManager.innerHTML = '';
  Object.entries(links).forEach(([code, url]) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.onclick = () => {
      window.location.href = url;
    };
    const icon = document.createElement('div');
    icon.className = 'file-icon';
    icon.textContent = getFileIcon(url);
    const label = document.createElement('div');
    label.className = 'file-label';
    label.textContent = code;
    item.appendChild(icon);
    item.appendChild(label);
    fileManager.appendChild(item);
  });
}

async function loadLinks() {
  try {
    // 2. Fetch all links from Supabase
    const { data, error } = await supabaseClient
      .from('links')
      .select('code, url');
    if (error) throw error;
    links = {};
    data.forEach(row => {
      links[row.code.trim().toLowerCase()] = row.url;
    });
    renderFileManager();
  } catch (error) {
    console.error("Error loading link data:", error);
    alert("Unable to load redirect data. Try again later.");
  }
}

// 3. Function to convert Google Drive link to direct download link

function convertToDirectDownload(link) {
  const match = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return link;
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadLinks();
});
