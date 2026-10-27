import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { products } from '../lib/catalog';
import { computeTotals, resolveLines, type Totals } from '../lib/pricing';
import { load, save } from '../lib/storage';
import type { CartLine, Order, ResolvedLine } from '../lib/types';

const CART_KEY = 'demo-shop:cart';
const ORDERS_KEY = 'demo-shop:orders';
export const MAX_QTY = 10;

type Action =
  | { type: 'add'; handle: string; variantId: string; quantity: number }
  | { type: 'set'; variantId: string; quantity: number }
  | { type: 'remove'; variantId: string }
  | { type: 'clear' };

function cartReducer(state: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case 'add': {
      const existing = state.find((l) => l.variantId === a.variantId);
      if (existing) {
        return state.map((l) => (l === existing ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + a.quantity) } : l));
      }
      return [...state, { handle: a.handle, variantId: a.variantId, quantity: Math.min(MAX_QTY, a.quantity) }];
    }
    case 'set':
      if (a.quantity < 1) return state.filter((l) => l.variantId !== a.variantId);
      return state.map((l) => (l.variantId === a.variantId ? { ...l, quantity: Math.min(MAX_QTY, a.quantity) } : l));
    case 'remove':
      return state.filter((l) => l.variantId !== a.variantId);
    case 'clear':
      return [];
  }
}

interface ShopState {
  lines: ResolvedLine[];
  totals: Totals;
  addItems: (items: { handle: string; variantId: string; quantity?: number }[], openDrawer?: boolean) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (order: Order) => void;
}

const Ctx = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [rawLines, dispatch] = useReducer(cartReducer, undefined, () => load<CartLine[]>(CART_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>(ORDERS_KEY, []));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => save(CART_KEY, rawLines), [rawLines]);
  useEffect(() => save(ORDERS_KEY, orders), [orders]);

  const lines = useMemo(() => resolveLines(rawLines, products), [rawLines]);
  const totals = useMemo(() => computeTotals(lines), [lines]);

  const addItems = useCallback<ShopState['addItems']>((items, openDrawer = true) => {
    for (const i of items) dispatch({ type: 'add', handle: i.handle, variantId: i.variantId, quantity: i.quantity ?? 1 });
    if (openDrawer) setCartOpen(true);
  }, []);

  const value: ShopState = {
    lines,
    totals,
    addItems,
    setQuantity: (variantId, quantity) => dispatch({ type: 'set', variantId, quantity }),
    removeLine: (variantId) => dispatch({ type: 'remove', variantId }),
    clearCart: () => dispatch({ type: 'clear' }),
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    orders,
    placeOrder: (order) => setOrders((o) => [order, ...o]),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
