import { ref, type Ref } from 'vue';
import { isAuthenticated } from '@/utils/jwt';

// Create a reactive auth state that can be imported by components
const isLoggedIn: Ref<boolean> = ref(isAuthenticated());

// Function to update the auth state
function updateAuthState(): void {
  isLoggedIn.value = isAuthenticated();
}

export { isLoggedIn, updateAuthState };
