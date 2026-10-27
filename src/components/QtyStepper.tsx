import { IconMinus, IconPlus } from './Icons';
import { MAX_QTY } from '../state/ShopContext';

export function QtyStepper({ value, onChange, min = 1, label }: { value: number; onChange: (v: number) => void; min?: number; label: string }) {
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(value - 1)} disabled={value <= min}>
        <IconMinus size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY}>
        <IconPlus size={16} />
      </button>
    </div>
  );
}
