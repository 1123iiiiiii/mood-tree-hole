import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SmallHappy, SmallHappyRecord } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { smallHappinessPresets } from '@/data/psychology';

interface SmallHappyState {
  smallHappies: SmallHappy[];
  records: SmallHappyRecord[];
  isSubmitting: boolean;
}

type SmallHappyAction =
  | { type: 'ADD_SMALL_HAPPY'; payload: SmallHappy }
  | { type: 'UPDATE_SMALL_HAPPY'; payload: SmallHappy }
  | { type: 'DELETE_SMALL_HAPPY'; payload: string }
  | { type: 'ARCHIVE_SMALL_HAPPY'; payload: string }
  | { type: 'SUBMIT_RECORD'; payload: SmallHappyRecord }
  | { type: 'LOAD_DATA'; payload: { smallHappies: SmallHappy[]; records: SmallHappyRecord[] } };

const initialState: SmallHappyState = {
  smallHappies: [],
  records: [],
  isSubmitting: false,
};

function smallHappyReducer(state: SmallHappyState, action: SmallHappyAction): SmallHappyState {
  switch (action.type) {
    case 'ADD_SMALL_HAPPY':
      return {
        ...state,
        smallHappies: [action.payload, ...state.smallHappies],
      };
    case 'UPDATE_SMALL_HAPPY':
      return {
        ...state,
        smallHappies: state.smallHappies.map((sh) =>
          sh.id === action.payload.id ? action.payload : sh
        ),
      };
    case 'DELETE_SMALL_HAPPY':
      return {
        ...state,
        smallHappies: state.smallHappies.filter((sh) => sh.id !== action.payload),
      };
    case 'ARCHIVE_SMALL_HAPPY':
      return {
        ...state,
        smallHappies: state.smallHappies.map((sh) =>
          sh.id === action.payload ? { ...sh, isArchived: true } : sh
        ),
      };
    case 'SUBMIT_RECORD':
      return {
        ...state,
        records: [action.payload, ...state.records],
      };
    case 'LOAD_DATA':
      return {
        ...state,
        smallHappies: action.payload.smallHappies,
        records: action.payload.records,
      };
    default:
      return state;
  }
}

interface SmallHappyContextType {
  state: SmallHappyState;
  addSmallHappy: (smallHappy: Omit<SmallHappy, 'id' | 'createdAt' | 'isArchived'>) => void;
  updateSmallHappy: (smallHappy: SmallHappy) => void;
  deleteSmallHappy: (id: string) => void;
  archiveSmallHappy: (id: string) => void;
  submitRecord: (record: Omit<SmallHappyRecord, 'id' | 'completedAt'>) => void;
  getTodayCompleted: () => SmallHappyRecord[];
  getRecommendations: (limit?: number) => SmallHappy[];
}

const SmallHappyContext = createContext<SmallHappyContextType | undefined>(undefined);

interface SmallHappyProviderProps {
  children: ReactNode;
}

export const SmallHappyProvider: React.FC<SmallHappyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(smallHappyReducer, initialState);

  useEffect(() => {
    const smallHappies = storage.get<SmallHappy[]>(STORAGE_KEYS.SMALL_HAPPIES, []);
    const records = storage.get<SmallHappyRecord[]>(STORAGE_KEYS.SMALL_HAPPY_RECORDS, []);

    if (smallHappies.length === 0) {
      const presets = smallHappinessPresets.map((preset) => ({
        ...preset,
        id: storage.generateId(),
        createdAt: new Date().toISOString(),
        isArchived: false,
        isCustom: false,
      }));
      storage.set(STORAGE_KEYS.SMALL_HAPPIES, presets);
      dispatch({ type: 'LOAD_DATA', payload: { smallHappies: presets, records } });
    } else {
      dispatch({ type: 'LOAD_DATA', payload: { smallHappies, records } });
    }
  }, []);

  const addSmallHappy = (smallHappy: Omit<SmallHappy, 'id' | 'createdAt' | 'isArchived'>) => {
    const newSmallHappy: SmallHappy = {
      ...smallHappy,
      id: storage.generateId(),
      createdAt: new Date().toISOString(),
      isArchived: false,
    };
    dispatch({ type: 'ADD_SMALL_HAPPY', payload: newSmallHappy });
    const updatedSmallHappies = [newSmallHappy, ...state.smallHappies];
    storage.set(STORAGE_KEYS.SMALL_HAPPIES, updatedSmallHappies);
  };

  const updateSmallHappy = (smallHappy: SmallHappy) => {
    dispatch({ type: 'UPDATE_SMALL_HAPPY', payload: smallHappy });
    const updatedSmallHappies = state.smallHappies.map((sh) =>
      sh.id === smallHappy.id ? smallHappy : sh
    );
    storage.set(STORAGE_KEYS.SMALL_HAPPIES, updatedSmallHappies);
  };

  const deleteSmallHappy = (id: string) => {
    dispatch({ type: 'DELETE_SMALL_HAPPY', payload: id });
    const updatedSmallHappies = state.smallHappies.filter((sh) => sh.id !== id);
    storage.set(STORAGE_KEYS.SMALL_HAPPIES, updatedSmallHappies);
  };

  const archiveSmallHappy = (id: string) => {
    dispatch({ type: 'ARCHIVE_SMALL_HAPPY', payload: id });
    const updatedSmallHappies = state.smallHappies.map((sh) =>
      sh.id === id ? { ...sh, isArchived: true } : sh
    );
    storage.set(STORAGE_KEYS.SMALL_HAPPIES, updatedSmallHappies);
  };

  const submitRecord = (record: Omit<SmallHappyRecord, 'id' | 'completedAt'>) => {
    const newRecord: SmallHappyRecord = {
      ...record,
      id: storage.generateId(),
      completedAt: new Date().toISOString(),
    };
    dispatch({ type: 'SUBMIT_RECORD', payload: newRecord });
    const updatedRecords = [newRecord, ...state.records];
    storage.set(STORAGE_KEYS.SMALL_HAPPY_RECORDS, updatedRecords);
  };

  const getTodayCompleted = (): SmallHappyRecord[] => {
    const today = new Date().toISOString().split('T')[0];
    return state.records.filter((record) =>
      record.completedAt.startsWith(today)
    );
  };

  const getRecommendations = (limit = 5): SmallHappy[] => {
    const activeSmallHappies = state.smallHappies.filter((sh) => !sh.isArchived);
    const todayCompleted = getTodayCompleted().map((r) => r.smallHappyId);
    const recommended = activeSmallHappies
      .filter((sh) => !todayCompleted.includes(sh.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    return recommended;
  };

  const value: SmallHappyContextType = {
    state,
    addSmallHappy,
    updateSmallHappy,
    deleteSmallHappy,
    archiveSmallHappy,
    submitRecord,
    getTodayCompleted,
    getRecommendations,
  };

  return (
    <SmallHappyContext.Provider value={value}>
      {children}
    </SmallHappyContext.Provider>
  );
};

export const useSmallHappy = (): SmallHappyContextType => {
  const context = useContext(SmallHappyContext);
  if (!context) {
    throw new Error('useSmallHappy must be used within a SmallHappyProvider');
  }
  return context;
};
