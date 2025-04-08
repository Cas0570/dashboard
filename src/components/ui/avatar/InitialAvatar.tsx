import React from 'react';
import Image from 'next/image';

type InitialAvatarProps = {
  name: string;
  size?: number;
  imageUrl?: string | null;
  colors?: string[];
};

const InitialAvatar = ({ name, size = 40, imageUrl = null, colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'] }: InitialAvatarProps) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const nameParts = name.split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return '?';
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  const getColorForName = (name: string) => {
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const initials = getInitials(name);
  const bgColor = getColorForName(name);
  
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size / 2.5}px`,
    lineHeight: `${size}px`,
  };
  
  if (imageUrl) {
    return (
      <div 
        className="rounded-full overflow-hidden" 
        style={avatarStyle}
      >
        <Image 
          src={imageUrl} 
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  
  return (
    <div 
      className={`${bgColor} rounded-full flex items-center justify-center text-white font-medium`}
      style={avatarStyle}
    >
      {initials}
    </div>
  );
};

export default InitialAvatar;