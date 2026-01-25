export default defineNuxtRouteMiddleware((to, from) => {
    const userLoggedIn = useState('userLoggedIn', () => false);

    if(!userLoggedIn.value && to.path === '/Leaderboards') {
        if(process.client){
            alert('To see the game statistics, log in!' + from.fullPath);
        }
        
        return navigateTo(from.fullPath == '/Leaderboards' ? '/' : from.fullPath);
    }
})