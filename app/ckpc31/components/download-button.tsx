'use client';

type DownloadButtonProps = {
  text: string;
  className: string;
  itemId: string;
}

export default function DownloadButton({ text, className, itemId }: DownloadButtonProps) {
  const handleClick = async () => {
    const response = await fetch(`/api/ckpc31/item-dl?id=${itemId}`);
    if (response.status !== 200) {
      console.error('Failed to download image:', response.status, response.statusText);
      return;
    }
    const filename = response.headers.get('Content-Disposition')?.split('"')[1];
    if (!filename) {
      console.error('Invalid filename');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className={className}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
