import { MoodType } from '@/types';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/utils/helpers';

interface MoodIconProps {
  mood: MoodType;
  selected: boolean;
  onClick: (mood: MoodType) => void;
}

export const MoodIcon: React.FC<MoodIconProps> = ({ mood, selected, onClick }) => {
  return (
    <button
      onClick={() => onClick(mood)}
      className={`
        flex flex-col items-center p-3 rounded-lg transition-colors
        ${selected ? 'bg-primary/10' : 'hover:bg-gray-100'}
      `}
    >
      <span className="text-3xl mb-1">{MOOD_EMOJIS[mood]}</span>
      <span className="text-xs text-text-secondary">{MOOD_LABELS[mood]}</span>
    </button>
  );
};

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect }) => {
  const moods: MoodType[] = ['happy', 'calm', 'anxious', 'sad', 'angry', 'fearful', 'surprised'];

  return (
    <div className="grid grid-cols-4 gap-2">
      {moods.map((mood) => (
        <MoodIcon
          key={mood}
          mood={mood}
          selected={selectedMood === mood}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};
