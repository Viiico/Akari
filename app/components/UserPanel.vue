<template>
    <div id="signedInformation" class="flex justify-center">
        <NuxtImg id="userImg" preload format="webp" src="/lightbulb.png" alt="Lightbulb icon" />
        <div class="dropdown-container">
            <button @click="toggleSignDropdown">
                <span v-if="userLoggedIn">You are logged in as {{ username }}</span>
                <span v-else>You are not signed in</span>
            </button>

            <div v-if="dropdownOpen" class="dropdown-menu">
                <!-- Not Signed In State -->
                <div v-if="!userLoggedIn" class="dropdown-content">
                    <form class="flex flex-col gap-2 items-center" @submit.prevent="submitSignForm">
                        <div class="flex gap-2 items-center justify-center drop">
                            <label for="username">Username: </label>
                            <input v-model="form.username" type="text" name="username" id="username"
                                class="dropdown-input" @input="clearError">
                        </div>
                        <div class="flex gap-2 items-center justify-center">
                            <label for="password">Password: </label>
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
const dropdownOpen = ref(false);
const error = ref(null);

const form = reactive({
    username: '',
    password: '',

    reset() {
        Object.assign(this, {
            username: '',
            password: '',
            email: '',
            rememberMe: false
        });
    }
});

const toggleSignDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
}

const signIn = () => {
    if (username.value.trim()) {
        userLoggedIn.value = true;
        dropdownOpen.value = false;
    }
};

const signOut = () => {
    userLoggedIn.value = false;
    username.value = "";
    dropdownOpen.value = false;
};

const closeOnClickOutside = (event) => {
    const dropdownElement = document.querySelector('#signedInformation');
    if (dropdownElement && !dropdownElement.contains(event.target)) {
        dropdownOpen.value = false;
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
    dropdownOpen.value = false;
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

#signedInformation>button {
    display: flex;
    justify-items: center;
    align-items: center;
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
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 200px;
    margin-top: 5px;
}

.dropdown-content {
    padding: 16px;
}

.dropdown-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.dropdown-input:focus {
    outline: none;
    border-color: #007bff;
}

.sign-in-btn {
    width: 100%;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.sign-in-btn:hover {
    background-color: #0056b3;
}

.sign-out-btn,
.register-btn {
    width: 100%;
    padding: 8px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.sign-out-btn:hover,
.register-btn:hover {
    background-color: #c82333;
}

#signInError {
    color: red;
    font-weight: 700;
    font-size: 0.7rem;
}
</style>