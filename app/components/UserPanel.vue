<template>
    <div id="signedInformation" class="flex justify-center">
        <NuxtImg id="userImg" preload format="webp" src="/lightbulb.png" alt="Lightbulb icon" />
        <div class="dropdown-container">
            <button @click="toggleSignDropdown" class="user-toggle-btn">
                <span v-if="userLoggedIn">You are logged in as {{ username }}</span>
                <span v-else>You are not signed in</span>
            </button>

            <div v-if="userLoginDropdownOpen" class="dropdown-menu">
                <!-- Not Signed In State -->
                <div v-if="!userLoggedIn" class="dropdown-content">
                    <form class="flex flex-col gap-2 items-center" @submit.prevent="submitSignForm">
                        <div class="flex gap-2 items-center justify-center drop">
                            <label for="username" class="dropdown-label">Username: </label>
                            <input v-model="form.username" type="text" name="username" id="username"
                                class="dropdown-input" @input="clearError">
                        </div>
                        <div class="flex gap-2 items-center justify-center">
                            <label for="password" class="dropdown-label">Password: </label>
                            <input v-model="form.password" type="password" name="password" id="password"
                                class="dropdown-input" @input="clearError">
                        </div>
                        <button @click="signIn" type="submit" class="px-6! sign-in-btn">Sign in</button>
                        <div id="signInError" class="flex items-center justify-center" v-if="error">
                            {{ error }}
                        </div>
                        <NuxtLink to="Register" class="register-btn flex justify-center">Register</NuxtLink>
                    </form>
                </div>

                <!-- Signed In State -->
                <div v-else class="dropdown-content">
                    <button @click="signOut" class="sign-out-btn">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    document.addEventListener('click', closeOnClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', closeOnClickOutside);
});

const userLoggedIn = useState("userLoggedIn", () => false);
const username = useState("username", () => "");
const userLoginDropdownOpen = useState("userLoginDropdownOpen", () => false);
const error = ref(null);

const form = reactive({
    username: '',
    password: '',

    reset() {
        Object.assign(this, {
            username: '',
            password: ''
        });
    }
});

const toggleSignDropdown = () => {
    userLoginDropdownOpen.value = !userLoginDropdownOpen.value;
}

const signIn = () => {
    if (username.value.trim()) {
        userLoggedIn.value = true;
        userLoginDropdownOpen.value = false;
    }
};

const signOut = () => {
    userLoggedIn.value = false;
    username.value = "";
    userLoginDropdownOpen.value = false;
};

const closeOnClickOutside = (event) => {
    const dropdownElement = document.querySelector('#signedInformation');
    if (dropdownElement && !dropdownElement.contains(event.target)) {
        userLoginDropdownOpen.value = false;
    }
};

async function submitSignForm() {
    error.value = null;

    if (!form.username || !form.password) {
        error.value = "You must provide a username and password";
        return;
    }

    const result = await $fetch.raw('/api/auth/login', {
        method: 'POST',
        body: {
            username: form.username,
            password: form.password
        },
        async onResponseError({ response }) {
            error.value = (response._data).message;
            return;
        }
    });

    if (!result.ok) {
        error.value = result.statusText;
        return;
    }

    // Successfull signin
    userLoggedIn.value = true;
    userLoginDropdownOpen.value = false;
    username.value = form.username;
    form.reset();

}

function clearError() {
    error.value = null;
}

</script>

<style scoped>
#signedInformation {
    height: 100%;
    align-items: center;
    position: relative;
}

.user-toggle-btn {
    display: flex;
    justify-items: center;
    align-items: center;
    background-color: transparent;
    color: #bbb;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.user-toggle-btn:hover {
    color: white;
    background-color: #3a3a3a;
}

#userImg {
    max-height: fit-content;
    height: 2vw;
    border-radius: 50%;
    margin-right: 1vw;
}

.dropdown-container {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    min-width: 240px;
    margin-top: 8px;
}

.dropdown-content {
    padding: 1.25rem;
}

.dropdown-label {
    color: #e2e8f0;
    font-size: 0.95rem;
    min-width: 80px;
}

.dropdown-input {
    width: 100%;
    padding: 8px 12px;
    background-color: #363636;
    border: 1px solid #555;
    border-radius: 6px;
    margin-bottom: 10px;
    box-sizing: border-box;
    color: white;
    transition: border-color 0.2s ease;
}

.dropdown-input:focus {
    outline: none;
    border-color: #4299e1;
}

.sign-in-btn {
    width: 100%;
    padding: 10px 16px;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
    margin-top: 8px;
}

.sign-in-btn:hover {
    background-color: #3182ce;
}

.sign-out-btn,
.register-btn {
    width: 100%;
    padding: 10px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sign-out-btn:hover,
.register-btn:hover {
    background-color: #c82333;
}

.register-btn {
    margin-top: 8px;
    background-color: #28a745;
}

.register-btn:hover {
    background-color: #218838;
}

#signInError {
    color: #f56565;
    font-weight: 600;
    font-size: 0.8rem;
    text-align: center;
    margin: 8px 0;
    padding: 6px 10px;
    background-color: rgba(245, 101, 101, 0.1);
    border-radius: 4px;
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    #userImg {
        height: 24px;
        margin-right: 8px;
    }
    
    .dropdown-menu {
        min-width: 220px;
        right: -10px;
    }
    
    .user-toggle-btn {
        font-size: 0.9rem;
        padding: 6px 10px;
    }
    
    .dropdown-content {
        padding: 1rem;
    }
    
    .dropdown-label {
        font-size: 0.9rem;
        min-width: 70px;
    }
    
    .dropdown-input {
        padding: 6px 10px;
        font-size: 0.9rem;
    }
    
    .sign-in-btn,
    .sign-out-btn,
    .register-btn {
        padding: 8px 12px;
        font-size: 0.9rem;
    }
}
</style>