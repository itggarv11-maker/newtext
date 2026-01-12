
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Subject, ClassLevel } from '../types';

export type SearchStatus = 'idle' | 'searching' | 'success' | 'error';
export type SessionIntent = 'learn' | 'revise' | 'solve' | 'any';
export type PostSearchAction = {
    tool: string;
    navigate: (path: string) => void;
} | null;

interface ContentContextType {
  extractedText: string;
  setExtractedText: (text: string) => void;
  subject: Subject | null;
  setSubject: (subject: Subject | null) => void;
  classLevel: ClassLevel;
  setClassLevel: (level: ClassLevel) => void;
  sessionId: string | null;
  intent: SessionIntent;
  setIntent: (intent: SessionIntent) => void;
  
  searchStatus: SearchStatus;
  searchMessage: string;
  postSearchAction: PostSearchAction;
  setPostSearchAction: (action: PostSearchAction) => void;
  
  hasSessionStarted: boolean;
  
  startBackgroundSearch: (searchFn: () => Promise<string>) => void;
  startSessionWithContent: (text: string) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [subject, setSubject] = useState<Subject | null>(null);
  const [classLevel, setClassLevel] = useState<ClassLevel>('Class 10');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [intent, setIntent] = useState<SessionIntent>('any');

  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [searchMessage, setSearchMessage] = useState('');
  const [postSearchAction, setPostSearchAction] = useState<PostSearchAction>(null);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);

  const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const startBackgroundSearch = async (searchFn: () => Promise<string>) => {
      const newSid = generateSessionId();
      setSessionId(newSid);
      setHasSessionStarted(true);
      setSearchStatus('searching');
      setSearchMessage('Initiating Neural Search...');
      try {
          const text = await searchFn();
          setExtractedText(text);
          setSearchStatus('success');
          setSearchMessage('Knowledge base synced!');
          if (postSearchAction) postSearchAction.navigate(postSearchAction.tool);
          setTimeout(() => { setSearchStatus('idle'); setSearchMessage(''); setPostSearchAction(null); }, 5000);
      } catch (err) {
          setSearchStatus('error');
          setSearchMessage(err instanceof Error ? err.message : "Sync Failed.");
          setTimeout(() => { setSearchStatus('idle'); setSearchMessage(''); }, 8000);
      }
  };
  
  const startSessionWithContent = (text: string) => {
    setSessionId(generateSessionId());
    setExtractedText(text);
    setHasSessionStarted(true);
  };

  const resetContent = () => {
    setExtractedText('');
    setSubject(null);
    setClassLevel('Class 10');
    setIntent('any');
    setHasSessionStarted(false);
    setSessionId(null);
  };

  return (
    <ContentContext.Provider value={{ 
        extractedText, setExtractedText, subject, setSubject, classLevel, setClassLevel, 
        sessionId, intent, setIntent, searchStatus, searchMessage, postSearchAction, 
        setPostSearchAction, hasSessionStarted, startBackgroundSearch, startSessionWithContent, resetContent 
    }}>
      {children}
    </ContentContext.Provider>
  );
};
