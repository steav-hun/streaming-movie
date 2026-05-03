// Replace content with real ad code (Google AdSense, etc.) later
export default function BannerAd({ size = 'leaderboard', className = '' }) {
  const config = {
    leaderboard: { label: '728x90',  cls: 'w-full h-24' },
    rectangle:   { label: '300x250', cls: 'w-72 h-64' },
    infeed:      { label: '970x90',  cls: 'w-full h-20' },
    mobile:      { label: '320x50',  cls: 'w-full h-14' },
  };

  const { label, cls } = config[size] || config.leaderboard;

  return (
    <div className={`${cls} bg-zinc-900 border border-dashed border-zinc-700 
      rounded flex items-center justify-center ${className}`}>
      <span className="text-xs text-zinc-600">
        Ad Space — {label}
      </span>
    </div>
  );
}