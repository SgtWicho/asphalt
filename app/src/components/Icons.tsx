import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type IconProps = { size?: number; color?: string; fill?: string };

export function HomeIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="home-outline" size={size} color={color} />;
}

export function MapIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="map-outline" size={size} color={color} />;
}

export function RouteIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="trail-sign-outline" size={size} color={color} />;
}

export function SearchIcon({ size = 18, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="search-outline" size={size} color={color} />;
}

export function BellIcon({ size = 18, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="notifications-outline" size={size} color={color} />;
}

export function DotsIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="ellipsis-horizontal" size={size} color={color} />;
}

export function HeartIcon({ size = 23, color = '#9a99a2', fill = 'none' }: IconProps) {
  const filled = fill !== 'none';
  return <Ionicons name={filled ? 'heart' : 'heart-outline'} size={size} color={filled ? fill : color} />;
}

export function CommentIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="chatbubble-outline" size={size} color={color} />;
}

export function ShareIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="paper-plane-outline" size={size} color={color} />;
}

export function BookmarkIcon({ size = 22, color = '#9a99a2', fill = 'none' }: IconProps) {
  const filled = fill !== 'none';
  return <Ionicons name={filled ? 'bookmark' : 'bookmark-outline'} size={size} color={filled ? fill : color} />;
}

export function ArrowRightIcon({ size = 17, color = '#fff' }: IconProps) {
  return <Ionicons name="arrow-forward" size={size} color={color} />;
}

export function CameraIcon({ size = 13, color = 'rgba(245,245,245,.62)' }: IconProps) {
  return <Ionicons name="camera-outline" size={size} color={color} />;
}

export function RouteOutlineIcon({ size = 13, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="trail-sign-outline" size={size} color={color} />;
}

export function PinFillIcon({ size = 13, color = '#f9a825' }: IconProps) {
  return <Ionicons name="location" size={size} color={color} />;
}

export function ExpandIcon({ size = 13, color = '#f9a825' }: IconProps) {
  return <Ionicons name="arrow-forward" size={size} color={color} />;
}

export function GpsBarsIcon({ size = 19, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="cellular-outline" size={size} color={color} />;
}

export function CrosshairIcon({ size = 18, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="locate-outline" size={size} color={color} />;
}

export function PlayIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="play" size={size} color={color} />;
}

export function PauseIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="pause" size={size} color={color} />;
}

export function AddPoiIcon({ size = 26, color = '#f9a825' }: IconProps) {
  return <Ionicons name="add-circle-outline" size={size} color={color} />;
}

export function MotoIcon({ size = 30, color = '#f9a825' }: IconProps) {
  return <MaterialCommunityIcons name="motorbike" size={size} color={color} />;
}

export function ClockIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="time-outline" size={size} color={color} />;
}

export function EyeIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="eye-outline" size={size} color={color} />;
}

export function ParkIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="leaf-outline" size={size} color={color} />;
}

export function CoffeeIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="cafe-outline" size={size} color={color} />;
}

export function FuelIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <MaterialCommunityIcons name="gas-station-outline" size={size} color={color} />;
}

export function FoodIcon({ size = 20, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="restaurant-outline" size={size} color={color} />;
}

export function StarIcon({ size = 16, color = '#f9a825', fill = '#f9a825' }: IconProps) {
  return <Ionicons name="star" size={size} color={fill || color} />;
}

export function TrophyIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="trophy-outline" size={size} color={color} />;
}

export function SunriseIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="sunny-outline" size={size} color={color} />;
}

export function MountainIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <MaterialCommunityIcons name="terrain" size={size} color={color} />;
}

export function WaveIcon({ size = 22, color = '#9a99a2' }: IconProps) {
  return <MaterialCommunityIcons name="waves" size={size} color={color} />;
}

export function ArrowUpIcon({ size = 24, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="arrow-up" size={size} color={color} />;
}

export function FlagIcon({ size = 22, color = '#f5f5f5' }: IconProps) {
  return <Ionicons name="flag-outline" size={size} color={color} />;
}

export function UserIcon({ size = 24, color = '#9a99a2' }: IconProps) {
  return <Ionicons name="person-outline" size={size} color={color} />;
}
