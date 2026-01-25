export default defineNuxtRouteMiddleware((to, from) => {
    const userLoggedIn = useState('userLoggedIn', () => false);
    const userLoginDropdownOpen = useState("userLoginDropdownOpen", () => false);

    if(!userLoggedIn.value && to.path === '/Leaderboards') {
        if(process.client){
            alert('To see the game statistics, log in!' + from.fullPath);
            userLoginDropdownOpen.value = true;
        }
        
        return navigateTo(from.fullPath == '/Leaderboards' ? '/' : from.fullPath);
    }
})