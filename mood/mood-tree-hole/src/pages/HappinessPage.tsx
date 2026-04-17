import React, { useState } from 'react';
import { useSmallHappy } from '@/context/SmallHappyContext';
import { SmallHappyList } from '@/components/smallHappiness/SmallHappyCard';
import { Card, Button, Modal, Input } from '@/components/ui';
import { CATEGORY_LABELS, CATEGORY_EMOJIS, FREQUENCY_LABELS } from '@/utils/helpers';
import { SmallHappyCategory, Frequency } from '@/types';

export const HappinessPage: React.FC = () => {
  const { state, addSmallHappy, submitRecord, getTodayCompleted, getRecommendations } = useSmallHappy();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'relaxation' as SmallHappyCategory,
    frequency: 'daily' as Frequency,
    isCustom: true,
  });

  const todayCompleted = getTodayCompleted();
  const completedIds = new Set(todayCompleted.map((r) => r.smallHappyId));
  const recommendations = getRecommendations(3);

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      addSmallHappy(newItem);
      setNewItem({ title: '', category: 'relaxation', frequency: 'daily', isCustom: true });
      setShowAddModal(false);
    }
  };

  const handleCompleteItem = (id: string) => {
    submitRecord({ smallHappyId: id });
  };

  const categories: SmallHappyCategory[] = ['relaxation', 'exercise', 'creative', 'social', 'growth', 'sensory', 'organize', 'nature'];
  const frequencies: Frequency[] = ['daily', 'weekly', 'once'];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-4">今日小确幸</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-text-secondary">
            已完成 {todayCompleted.length} / {state.smallHappies.filter((sh) => !sh.isArchived).length}
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            添加小事
          </Button>
        </div>
        {state.smallHappies.filter((sh) => !sh.isArchived).length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            还没有小确幸，点击添加按钮开始吧！
          </div>
        ) : (
          <SmallHappyList
            smallHappies={state.smallHappies.filter((sh) => !sh.isArchived)}
            completedIds={completedIds}
            onComplete={handleCompleteItem}
          />
        )}
      </Card>

      {recommendations.length > 0 && (
        <Card>
          <h3 className="font-medium text-text-primary mb-3">推荐小事</h3>
          <SmallHappyList
            smallHappies={recommendations}
            completedIds={completedIds}
            onComplete={handleCompleteItem}
          />
        </Card>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加小确幸"
      >
        <div className="space-y-4">
          <Input
            label="小事名称"
            placeholder="例如：喝一杯热茶"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">类别</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${newItem.category === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  `}
                  onClick={() => setNewItem({ ...newItem, category })}
                >
                  {CATEGORY_EMOJIS[category]} {CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">频率</label>
            <div className="flex gap-2">
              {frequencies.map((frequency) => (
                <button
                  key={frequency}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-medium
                    ${newItem.frequency === frequency
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  `}
                  onClick={() => setNewItem({ ...newItem, frequency })}
                >
                  {FREQUENCY_LABELS[frequency]}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleAddItem} className="w-full" size="lg">
            添加
          </Button>
        </div>
      </Modal>
    </div>
  );
};
