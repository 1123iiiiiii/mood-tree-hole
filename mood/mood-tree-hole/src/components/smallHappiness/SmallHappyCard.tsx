import { SmallHappy } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { CATEGORY_LABELS, CATEGORY_EMOJIS, FREQUENCY_LABELS } from '@/utils/helpers';

interface SmallHappyCardProps {
  smallHappy: SmallHappy;
  isCompleted: boolean;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SmallHappyCard: React.FC<SmallHappyCardProps> = ({
  smallHappy,
  isCompleted,
  onComplete,
}) => {
  return (
    <Card className="flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{CATEGORY_EMOJIS[smallHappy.category]}</span>
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-text-primary'}`}>
            {smallHappy.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className="text-xs">
              {CATEGORY_LABELS[smallHappy.category]}
            </Badge>
            <Badge variant="default" className="text-xs">
              {FREQUENCY_LABELS[smallHappy.frequency]}
            </Badge>
          </div>
        </div>
      </div>
      <Button
        variant={isCompleted ? 'ghost' : 'primary'}
        size="sm"
        onClick={() => onComplete(smallHappy.id)}
      >
        {isCompleted ? '已完成' : '完成'}
      </Button>
    </Card>
  );
};

interface SmallHappyListProps {
  smallHappies: SmallHappy[];
  completedIds: Set<string>;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SmallHappyList: React.FC<SmallHappyListProps> = ({
  smallHappies,
  completedIds,
  onComplete,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {smallHappies.map((smallHappy) => (
        <SmallHappyCard
          key={smallHappy.id}
          smallHappy={smallHappy}
          isCompleted={completedIds.has(smallHappy.id)}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
