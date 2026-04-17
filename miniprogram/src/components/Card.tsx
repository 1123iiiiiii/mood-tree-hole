import { View } from '@tarojs/components';
import './index.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`card ${className}`}>
      {children}
    </View>
  );
}
