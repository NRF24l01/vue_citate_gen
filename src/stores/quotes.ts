// stores/itemStore.ts
import { defineStore } from 'pinia';

interface Item {
  text: string | number;
  author: string;
}

export const useQuotesStore = defineStore('quotes', {
  state: () => ({
    items: [] as Item[],
  }),
  actions: {
    loadQuotes() {
      const savedItems = localStorage.getItem('quotes');
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
    },
    
    addQuotes(newItem: Item) {
      this.items.push(newItem); 
      this.saveQuotes();
    },
    
    saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(this.items));
    },

    getQuotesJson() {
      return this.items;
    }
  }
});
