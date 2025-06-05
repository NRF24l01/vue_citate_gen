import { ref, type Ref } from 'vue';
import { isAuthenticated, isModerator } from '@/utils/jwt';

// Create a reactive auth state that can be imported by components
const isLoggedIn: Ref<boolean> = ref(isAuthenticated());
const isModeratorLoggedIn: Ref<boolean> = ref(isModerator());

// Function to update the auth state
function updateAuthState(): void {
  isLoggedIn.value = isAuthenticated();
  isModeratorLoggedIn.value = isModerator();
}

export { isLoggedIn, updateAuthState, isModeratorLoggedIn };
