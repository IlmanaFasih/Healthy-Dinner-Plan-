import React, { useState, useMemo } from 'react';
import { ShoppingItem } from '../types';
import { Plus, Check, ShoppingBag, Trash2, Printer, CheckSquare, Square, RefreshCcw } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, quantity: string, category: string) => void;
  onRemoveItem: (id: string) => void;
  onClearChecked: () => void;
  onRegenerateFromPlan: () => void;
}

export default function ShoppingList({
  items,
  onToggleItem,
  onAddItem,
  onRemoveItem,
  onClearChecked,
  onRegenerateFromPlan,
}: ShoppingListProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1 unit');
  const [newItemCategory, setNewItemCategory] = useState('Other');

  // Categorize items
  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {
      'Fresh Produce': [],
      'Proteins & Seafood': [],
      'Dairy & Eggs': [],
      'Grains, Seeds & Pantry': [],
      'Baking, Oils & Seasonings': [],
      'Other / Custom': [],
    };

    items.forEach((item) => {
      let cat = item.category || 'Other / Custom';
      
      // Map to standard clean categories if generated via prompt
      const lowerCat = cat.toLowerCase();
      if (lowerCat.includes('produce') || lowerCat.includes('veg') || lowerCat.includes('fruit') || lowerCat.includes('greens')) {
        cat = 'Fresh Produce';
      } else if (lowerCat.includes('protein') || lowerCat.includes('meat') || lowerCat.includes('chicken') || lowerCat.includes('fish') || lowerCat.includes('seafood') || lowerCat.includes('tofu') || lowerCat.includes('tempeh')) {
        cat = 'Proteins & Seafood';
      } else if (lowerCat.includes('dairy') || lowerCat.includes('cheese') || lowerCat.includes('yogurt') || lowerCat.includes('egg') || lowerCat.includes('butter')) {
        cat = 'Dairy & Eggs';
      } else if (lowerCat.includes('grain') || lowerCat.includes('pantry') || lowerCat.includes('rice') || lowerCat.includes('quinoa') || lowerCat.includes('pasta') || lowerCat.includes('bean') || lowerCat.includes('lentil') || lowerCat.includes('pita') || lowerCat.includes('tortilla')) {
        cat = 'Grains, Seeds & Pantry';
      } else if (lowerCat.includes('oil') || lowerCat.includes('season') || lowerCat.includes('salt') || lowerCat.includes('sauce') || lowerCat.includes('herb') || lowerCat.includes('pesto') || lowerCat.includes('garlic')) {
        cat = 'Baking, Oils & Seasonings';
      } else {
        cat = 'Other / Custom';
      }

      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(item);
    });

    // Remove empty categories
    return Object.fromEntries(Object.entries(groups).filter(([_, items]) => items.length > 0)) as Record<string, ShoppingItem[]>;
  }, [items]);

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemQty.trim(), newItemCategory);
    setNewItemName('');
    setNewItemQty('1 unit');
  };

  const handlePrint = () => {
    window.print();
  };

  const totals = useMemo(() => {
    const total = items.length;
    const bought = items.filter((i) => i.checked).length;
    return { total, bought, pending: total - bought };
  }, [items]);

  return (
    <div id="shopping-list-root" className="space-y-6">
      {/* List Progress & Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Groceries to Buy in Advance</h3>
            <p className="text-xs text-slate-500 font-mono">
              {totals.bought} / {totals.total} items completed ({totals.total > 0 ? Math.round((totals.bought / totals.total) * 100) : 0}%)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            id="regenerate-list-btn"
            onClick={onRegenerateFromPlan}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition cursor-pointer"
            title="Reload all ingredients automatically from active dinner cards"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Reload Plan Ingredients
          </button>
          
          <button
            id="print-list-btn"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print List
          </button>

          <button
            id="clear-checked-btn"
            disabled={totals.bought === 0}
            onClick={onClearChecked}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Completed
          </button>
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleAddItemSubmit} id="add-grocery-form" className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-none">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick-Add Custom Custom Ingredient</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            type="text"
            id="grocery-name-input"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="e.g. Extra virgin olive oil, Paper napkins..."
            className="sm:col-span-2 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
          <input
            type="text"
            id="grocery-qty-input"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            placeholder="Quantity, e.g. 500ml"
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
          <select
            id="grocery-category-select"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Proteins & Seafood">Proteins & Seafood</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Grains, Seeds & Pantry">Grains & Pantry</option>
            <option value="Baking, Oils & Seasonings">Oils & Spices</option>
            <option value="Other / Custom">Other</option>
          </select>
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            id="add-grocery-btn"
            disabled={!newItemName.trim()}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Basket
          </button>
        </div>
      </form>

      {/* Grouped Checked list */}
      {items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50/45 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-slate-600 font-semibold text-sm">Your shopping basket is empty</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Once you generate an AI dinner plan or specify your custom dinners, ingredients will populate here a week in advance.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).map(([category, catItems]) => (
            <div key={category} className="space-y-2 bg-white p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5">
                {category} ({catItems.length})
              </h4>
              <div className="divide-y divide-slate-50">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    id={`grocery-row-${item.id}`}
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/50 rounded-lg cursor-pointer transition select-none group"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-400" />
                      )}
                      <div>
                        <span className={`text-xs font-medium text-slate-700 ${item.checked ? 'line-through text-slate-400' : ''}`}>
                          {item.name}
                        </span>
                        {item.mealName && (
                          <span className="block text-[8px] text-slate-400 leading-none mt-0.5">
                            For: {item.mealName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100/70 px-1.5 py-0.5 rounded">
                        {item.quantity}
                      </span>
                      <button
                        id={`delete-grocery-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item.id);
                        }}
                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
