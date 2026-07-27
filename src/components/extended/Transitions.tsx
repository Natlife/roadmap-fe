import { forwardRef, type ReactNode, type Ref } from 'react';
import { Fade, Grow, type PopperProps } from '@mui/material';

interface TransitionsProps {
  children: ReactNode;
  type?: 'grow' | 'fade';
  position?: PopperProps['placement'];
  in?: boolean;
}

const Transitions = forwardRef(({ children, type = 'grow', in: open, ...rest }: TransitionsProps, ref: Ref<unknown>) => {
  if (type === 'fade') {
    return (
      <Fade ref={ref as Ref<HTMLElement>} in={open} timeout={{ appear: 0, enter: 150, exit: 150 }} {...rest}>
        <div>{children}</div>
      </Fade>
    );
  }
  return (
    <Grow ref={ref as Ref<HTMLElement>} in={open} timeout={{ appear: 0, enter: 150, exit: 150 }} {...rest}>
      <div>{children}</div>
    </Grow>
  );
});

Transitions.displayName = 'Transitions';
export default Transitions;
