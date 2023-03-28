import React, { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './AlertStyles.scss';

interface ToolsContextValues {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  isRendered: boolean;
  setIsRendered: Dispatch<SetStateAction<boolean>>;
  alertText: string;
  setAlertText: Dispatch<SetStateAction<string>>;
}

const ToolsContext = createContext<ToolsContextValues | undefined>(undefined);

interface ToolsProviderProps {
  children: React.ReactNode;
}

export const ToolsProvider: React.FC<ToolsProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [alertText, setAlertText] = useState('');

  return (
    <ToolsContext.Provider
      value={{
        isVisible,
        setIsVisible,
        isRendered,
        setIsRendered,
        alertText,
        setAlertText
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(ToolsContext);

  if (context === undefined)
    throw new Error('useAlert must be called within a ToolsProvider');

  const {
    isVisible,
    setIsVisible,
    isRendered,
    setIsRendered,
    alertText,
    setAlertText
  } = context;

  const timers = useRef<NodeJS.Timeout[]>([]);

  const renderAlert = (text: string) => {
    if (timers.current.length) {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    }

    setAlertText(text);

    const t1 = setTimeout(() => {
      setIsVisible(true);
    }, 0);
    timers.current.push(t1);
    setIsRendered(true);

    const t2 = setTimeout(() => {
      const t3 = setTimeout(() => {
        setIsRendered(false);
      }, 250);
      timers.current.push(t3);
      setIsVisible(false);
    }, 3000);
    timers.current.push(t2);
  };

  return {
    renderAlert,
    isVisible,
    isRendered,
    alertText
  };
};

const Alert = () => {
  const { isVisible, isRendered, alertText } = useAlert();

  const portalElement = document.getElementById('portal');

  const ele = (
    <div className='Alert__Container'>
      {isRendered && alertText && (
        <div className={`Alert__Border ${isVisible ? 'open' : ''}`}>
          <div className={`Alert__Content ${isVisible ? 'open' : ''}`}>{alertText}</div>
        </div>
      )}
    </div>
  );

  return portalElement && isRendered ? ReactDOM.createPortal(ele, portalElement) : null;
};

export default Alert;
