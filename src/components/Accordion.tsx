import { useId, useState, type ReactNode } from 'react';
import { IconChevron, IconPlus, IconMinus } from './Icons';

export function Accordion({ title, children, icon = 'plus', defaultOpen = false }: { title: ReactNode; children: ReactNode; icon?: 'plus' | 'chevron'; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={`accordion ${open ? 'open' : ''}`}>
      <button className="accordion-head" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        {icon === 'plus' ? open ? <IconMinus size={18} /> : <IconPlus size={18} /> : <IconChevron size={18} dir={open ? 'up' : 'down'} />}
      </button>
      <div id={id} className="accordion-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
