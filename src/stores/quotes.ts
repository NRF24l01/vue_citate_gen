// stores/itemStore.ts
import { defineStore } from 'pinia';

interface Item {
  text: string | number;
}

export const useItemStore = defineStore('items', {
  state: () => ({
    items: [] as Item[],
  }),
  actions: {
    loadItems() {
      const savedItems = localStorage.getItem('items');
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
    },
    
    addItem(newItem: Item) {
      this.items.push(newItem); 
      this.saveItems();
    },
    
    saveItems() {
      localStorage.setItem('items', JSON.stringify(this.items));
    },

    getItemsJson(): string {
      return JSON.stringify(this.items);
    }
  }
});
