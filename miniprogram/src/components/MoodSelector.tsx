export default function MoodSelector({ moods, selectedMood, onSelect }) {
  return (
    <View className="mood-selector">
      {moods.map(mood => (
        <View
          key={mood.value}
          className={`mood-item ${selectedMood === mood.value ? 'selected' : ''}`}
          onClick={() => onSelect(mood.value)}
        >
          <Text className="mood-emoji">{mood.emoji}</Text>
          <Text className="mood-label">{mood.label}</Text>
        </View>
      ))}
    </View>
  );
}
