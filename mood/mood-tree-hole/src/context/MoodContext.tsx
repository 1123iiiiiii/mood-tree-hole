import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MoodRecord, MoodType, Tag } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { moodInterpretations, affirmations, recommendedActivities } from '@/data/psychology';

interface MoodState {
  records: MoodRecord[];
  currentDraft: {
    event: string;
    mood: MoodType | null;
    intensity: number;
    tags: Tag[];
  };
  isSubmitting: boolean;
}

type MoodAction =
  | { type: 'SET_DRAFT'; payload: Partial<MoodState['currentDraft']> }
  | { type: 'RESET_DRAFT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: MoodRecord }
  | { type: 'LOAD_RECORDS'; payload: MoodRecord[] }
  | { type: 'DELETE_RECORD'; payload: string };

const initialState: MoodState = {
  records: [],
  currentDraft: {
    event: '',
    mood: null,
    intensity: 5,
    tags: [],
  },
  isSubmitting: false,
};

function moodReducer(state: MoodState, action: MoodAction): MoodState {
  switch (action.type) {
    case 'SET_DRAFT':
      return {
        ...state,
        currentDraft: { ...state.currentDraft, ...action.payload },
      };
    case 'RESET_DRAFT':
      return {
        ...state,
        currentDraft: initialState.currentDraft,
      };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        records: [action.payload, ...state.records],
        currentDraft: initialState.currentDraft,
        isSubmitting: false,
      };
    case 'LOAD_RECORDS':
      return {
        ...state,
        records: action.payload,
      };
    case 'DELETE_RECORD':
      return {
        ...state,
        records: state.records.filter((record) => record.id !== action.payload),
      };
    default:
      return state;
  }
}

interface MoodContextType {
  state: MoodState;
  setDraft: (draft: Partial<MoodState['currentDraft']>) => void;
  resetDraft: () => void;
  submitRecord: () => void;
  deleteRecord: (id: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  useEffect(() => {
    const records = storage.get<MoodRecord[]>(STORAGE_KEYS.MOOD_RECORDS, []);
    dispatch({ type: 'LOAD_RECORDS', payload: records });
  }, []);

  const setDraft = (draft: Partial<MoodState['currentDraft']>) => {
    dispatch({ type: 'SET_DRAFT', payload: draft });
  };

  const resetDraft = () => {
    dispatch({ type: 'RESET_DRAFT' });
  };

  const submitRecord = () => {
    if (!state.currentDraft.mood) return;

    dispatch({ type: 'SUBMIT_START' });

    const newRecord: MoodRecord = {
      id: storage.generateId(),
      event: state.currentDraft.event,
      mood: state.currentDraft.mood,
      intensity: state.currentDraft.intensity,
      tags: state.currentDraft.tags,
      createdAt: new Date().toISOString(),
      analysis: {
        psychologyTip: moodInterpretations[state.currentDraft.mood],
        affirmations: affirmations[state.currentDraft.mood],
        recommendedActivities: recommendedActivities[state.currentDraft.mood],
      },
    };

    dispatch({ type: 'SUBMIT_SUCCESS', payload: newRecord });

    const updatedRecords = [newRecord, ...state.records];
    storage.set(STORAGE_KEYS.MOOD_RECORDS, updatedRecords);
  };

  const deleteRecord = (id: string) => {
    dispatch({ type: 'DELETE_RECORD', payload: id });
    const updatedRecords = state.records.filter((record) => record.id !== id);
    storage.set(STORAGE_KEYS.MOOD_RECORDS, updatedRecords);
  };

  const value: MoodContextType = {
    state,
    setDraft,
    resetDraft,
    submitRecord,
    deleteRecord,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMood = (): MoodContextType => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
