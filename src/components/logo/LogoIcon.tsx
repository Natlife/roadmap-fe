interface LogoIconProps {
  width?: number | string;
  height?: number | string;
}

export default function LogoIcon({ width = 42, height = 42 }: LogoIconProps) {
  return (
    <img
      src="/logo.png"
      alt="Học Mẹo"
      style={{
        width,
        height,
        objectFit: 'contain',
        borderRadius: 12,
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
}
