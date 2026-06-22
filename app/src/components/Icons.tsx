import Svg, { Path, Circle, Rect } from 'react-native-svg';

type IconProps = { size?: number; color?: string; fill?: string };

export function HomeIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 10v10h14V10" strokeLinejoin="round" />
    </Svg>
  );
}

export function MapIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" strokeLinejoin="round" />
      <Path d="M9 4v14M15 6v14" />
    </Svg>
  );
}

export function RouteIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="6" cy="19" r="2.5" />
      <Circle cx="18" cy="5" r="2.5" />
      <Path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5" strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 18, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M21 21l-3.5-3.5" strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ size = 18, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" />
    </Svg>
  );
}

export function DotsIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="5" cy="12" r="2" />
      <Circle cx="12" cy="12" r="2" />
      <Circle cx="19" cy="12" r="2" />
    </Svg>
  );
}

export function HeartIcon({ size = 23, color = '#9a99a2', fill = 'none' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2}>
      <Path
        d="M12 21s-7-4.7-9.5-9.2C1 8.5 2.5 5 6 5c2.1 0 3.4 1.2 4 2.3C10.6 6.2 11.9 5 14 5c3.5 0 5 3.5 3.5 6.8C19 16.3 12 21 12 21z"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CommentIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShareIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 12l16-8-6 16-3-7-7-1z" strokeLinejoin="round" />
    </Svg>
  );
}

export function BookmarkIcon({ size = 22, color = '#9a99a2', fill = 'none' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2}>
      <Path d="M6 3h12v18l-6-4.2L6 21z" strokeLinejoin="round" />
    </Svg>
  );
}

export function ArrowRightIcon({ size = 17, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4}>
      <Path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CameraIcon({ size = 13, color = 'rgba(245,245,245,.62)' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="6" width="18" height="14" rx="2" />
      <Circle cx="12" cy="13" r="3.5" />
      <Path d="M8 6l1.5-2.5h5L16 6" />
    </Svg>
  );
}

export function RouteOutlineIcon({ size = 13, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="6" cy="19" r="2.5" />
      <Circle cx="18" cy="5" r="2.5" />
      <Path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5" strokeLinecap="round" />
    </Svg>
  );
}

export function PinFillIcon({ size = 13, color = '#f9a825' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
      <Circle cx="12" cy="9" r="2.4" fill="#232229" />
    </Svg>
  );
}

export function ExpandIcon({ size = 13, color = '#f9a825' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4}>
      <Path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GpsBarsIcon({ size = 19, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={Math.round((size * 12) / 19)} viewBox="0 0 19 12">
      <Rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={color} />
      <Rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={color} />
      <Rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={color} />
      <Rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={color} />
    </Svg>
  );
}

export function CrosshairIcon({ size = 18, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="6" />
      <Circle cx="12" cy="12" r="1.6" fill={color} />
    </Svg>
  );
}

export function PlayIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M7 5l13 7-13 7z" />
    </Svg>
  );
}

export function PauseIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="4" width="4.5" height="16" rx="1.5" fill={color} />
      <Rect x="13.5" y="4" width="4.5" height="16" rx="1.5" fill={color} />
    </Svg>
  );
}

export function AddPoiIcon({ size = 26, color = '#f9a825' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 21s7-7.6 7-12a7 7 0 0 0-14 0c0 4.4 7 12 7 12z" strokeLinejoin="round" />
      <Path d="M12 7v5M9.5 9.5h5" strokeLinecap="round" />
    </Svg>
  );
}

export function MotoIcon({ size = 26, color = '#f9a825' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="5.5" cy="17.5" r="3" />
      <Circle cx="18.5" cy="17.5" r="3" />
      <Path d="M5.5 17.5h6l2.5-6h4.5M8 17.5l3-7 3 1" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 6.5h2.5l1 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ClockIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function EyeIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinejoin="round" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function ParkIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 3l6 9h-4l5 7H5l5-7H6z" strokeLinejoin="round" />
      <Path d="M12 19v3" strokeLinecap="round" />
    </Svg>
  );
}

export function CoffeeIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" strokeLinejoin="round" />
      <Path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" strokeLinecap="round" />
      <Path d="M7 5.5c0-1 1-1 1-2M11 5.5c0-1 1-1 1-2" strokeLinecap="round" />
    </Svg>
  );
}

export function FuelIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="4" y="3" width="10" height="18" rx="1.5" />
      <Path d="M8 8h2" strokeLinecap="round" />
      <Path d="M14 9l3 2v6a1.5 1.5 0 0 0 3 0v-5l-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function FoodIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M5 3v8a3 3 0 0 0 6 0V3M8 3v8" strokeLinecap="round" />
      <Path d="M17 3c-2 1-3 3-3 6 0 2 1 3 2 3v9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function StarIcon({ size = 16, color = '#f9a825', fill = '#f9a825' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={1}>
      <Path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" strokeLinejoin="round" />
    </Svg>
  );
}

export function TrophyIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M7 4h10v5a5 5 0 0 1-10 0z" strokeLinejoin="round" />
      <Path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" />
      <Path d="M12 14v3M9 21h6M9 21c0-2 1.5-3 3-3s3 1 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SunriseIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 4v4" strokeLinecap="round" />
      <Circle cx="12" cy="13" r="4" />
      <Path d="M3 21h18M5 18l1.5-1.5M19 18l-1.5-1.5M4 13h2M18 13h2" strokeLinecap="round" />
    </Svg>
  );
}

export function MountainIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 20l6.5-11L13 15l2.5-4L21 20z" strokeLinejoin="round" />
    </Svg>
  );
}

export function WaveIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 11c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" />
    </Svg>
  );
}

export function ArrowUpIcon({ size = 24, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
      <Path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function FlagIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M6 21V4M6 4h12l-3 4 3 4H6" strokeLinejoin="round" />
    </Svg>
  );
}
