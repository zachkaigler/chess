import { useState, CSSProperties, useRef, useCallback, useMemo } from "react";

interface UseCssTransitionArgs {
  transitionDurationMs: number;
  transitionInClassName?: string;
  transitionOutClassName?: string;
  additionalClassNames?: string[];
}

interface UseCssTransitionReturnValues {
  cn: string;
  styles: CSSProperties;
  showComponent(): void;
  hideComponent(): void;
  componentRendered: boolean;
}

export const useCssTransition = ({
  transitionDurationMs,
  transitionInClassName,
  transitionOutClassName,
  additionalClassNames,
}: UseCssTransitionArgs): UseCssTransitionReturnValues => {
  const baseClassName = additionalClassNames ? additionalClassNames.join(' ') : '';

  const [cn, setCn] = useState(baseClassName);
  const [componentRendered, setComponentRendered] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const showComponent = useCallback(async () => {
    if (timers.current.length) {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    }
    setCn(baseClassName + ' ' + transitionInClassName);
    setComponentRendered(true);
  }, [baseClassName, transitionInClassName, timers.current]);

  const hideComponent = useCallback(() => {
    if (timers.current.length) {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    }
    const timer = setTimeout(() => {
      setComponentRendered(false);
    }, transitionDurationMs);
    timers.current.push(timer);
    setCn(baseClassName + ' ' + transitionOutClassName);
  }, [baseClassName, transitionOutClassName, transitionDurationMs, timers.current]);

  const styles = useMemo(() => ({
    transition: `all ${transitionDurationMs}ms ease`,
  }), [transitionDurationMs]);

  return {
    componentRendered,
    showComponent,
    hideComponent,
    cn,
    styles,
  };
};