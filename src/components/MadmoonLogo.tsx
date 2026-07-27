import React from 'react';

export type MadmoonLogoVariant = 
  | 'colored-light' // Default green checkmark + dark navy bars
  | 'colored-dark'  // White checkmark + green & white accents on dark
  | 'light'         // Monochromatic dark navy
  | 'white'         // Monochromatic white
  | 'layer1'        // Silver / Slate (Tier 1: Personal ID)
  | 'layer2'        // Emerald Green (Tier 2: Commercial Registry)
  | 'layer3'        // Royal Blue (Tier 3: Verified Phone)
  | 'layer4';       // Amber / Gold (Tier 4: Verified Domain)

interface MadmoonLogoProps {
  className?: string;
  variant?: MadmoonLogoVariant;
}

export const MadmoonLogo: React.FC<MadmoonLogoProps> = ({ 
  className = "w-6 h-6", 
  variant = "colored-light" 
}) => {
  // Determine color scheme based on variant
  let primaryFill = "#047857";  // Default Emerald Green
  let secondaryFill = "#1E2337"; // Dark Navy

  switch (variant) {
    case 'colored-light':
      primaryFill = "#047857";
      secondaryFill = "#1E2337";
      break;
    case 'colored-dark':
      primaryFill = "#10B981";
      secondaryFill = "#FFFFFF";
      break;
    case 'light':
      primaryFill = "#1E2337";
      secondaryFill = "#1E2337";
      break;
    case 'white':
      primaryFill = "#FFFFFF";
      secondaryFill = "#FFFFFF";
      break;
    case 'layer1':
      primaryFill = "#64748B"; // Slate / Silver (Layer 1)
      secondaryFill = "#1E2337";
      break;
    case 'layer2':
      primaryFill = "#047857"; // Green (Layer 2)
      secondaryFill = "#1E2337";
      break;
    case 'layer3':
      primaryFill = "#2563EB"; // Royal Blue (Layer 3)
      secondaryFill = "#1E2337";
      break;
    case 'layer4':
      primaryFill = "#D97706"; // Amber / Gold (Layer 4)
      secondaryFill = "#1E2337";
      break;
  }

  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Madmoon Logo"
    >
      {/* Main Checkmark / M-Peak */}
      <path 
        d="M15 38 L40 63 L85 18 L85 34 L40 79 L15 54 Z" 
        fill={primaryFill} 
      />
      
      {/* Bottom Left Accent Triangle */}
      <polygon 
        points="15,66 15,85 34,85" 
        fill={secondaryFill} 
      />
      
      {/* Bottom Right Diagonal Bar 1 */}
      <polygon 
        points="48,85 85,48 85,63 63,85" 
        fill={secondaryFill} 
      />
      
      {/* Bottom Right Corner Triangle 2 */}
      <polygon 
        points="73,85 85,73 85,85" 
        fill={secondaryFill} 
      />
    </svg>
  );
};
