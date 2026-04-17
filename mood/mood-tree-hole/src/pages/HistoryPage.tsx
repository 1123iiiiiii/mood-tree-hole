import React from 'react';
import { useMood } from '@/context/MoodContext';
import { Card, Badge, Button } from '@/components/ui';
import { MoodIcon } from '@/components/mood/MoodSelector';
import { formatRelativeTime } from '@/utils/dateUtils';

export const HistoryPage: React.FC = () => {
  const { state, deleteRecord } = useMood();
  const { records } = state;

  return (
    <div className="space-y-4">
      {records.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-medium text-text-primary mb-2">还没有心情记录</h3>
          <p className="text-text-secondary">去记录页面开始记录你的心情吧！</p>
        </Card>
      ) : (
        records.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex items-start gap-3">
              <MoodIcon
                mood={record.mood}
                selected={false}
                onClick={() => {}}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" className="text-xs">
                    {record.intensity > 5 ? '强烈' : '轻微'}
                  </Badge>
                  <span className="text-xs text-text-secondary">
                    {formatRelativeTime(record.createdAt)}
                  </span>
                </div>
                <p className="text-text-primary mb-3 line-clamp-3">
                  {record.event}
                </p>
                {record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {record.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag === 'work' ? '工作' :
                         tag === 'family' ? '家庭' :
                         tag === 'health' ? '健康' :
                         tag === 'relationship' ? '人际关系' :
                         tag === 'finance' ? '财务' :
                         tag === 'study' ? '学习' : '其他'}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRecord(record.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  删除
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
