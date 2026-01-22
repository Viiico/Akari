><template>
    <NavigationPanel />
    <div class="register-page p-4">
        <form class="flex flex-col gap-2 items-center" @submit.prevent="submitForm">
            <div class="flex gap-2 items-center justify-center">
                <label for="username">Username: </label>
                <input v-model="form.username" type="text" name="username" id="username">
            </div>
            <div class="flex gap-2 items-center justify-center">
                <label for="password">Password: </label>
                <input v-model="form.password" type="password" name="password" id="password">
            </div>
            <button type="submit" class="px-6!">Submit</button>
            <div class="flex items-center justify-center" v-if="error">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const error = ref<string | null>(null);
const userLoggedIn = useState("userLoggedIn", () => false);
const username = useState("username", () => "");

async function submitForm() {
    error.value = null;

    if (!form.username || !form.password) {
        error.value = "You must provide a username and password";
        return;
    }

    const result = await $fetch.raw('/api/auth/register', {
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

    userLoggedIn.value = true;
    username.value = form.username;
    await navigateTo('/');
    form.reset();

    // error.value = "User successfully created";
}

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
})

</script>

<style scoped>
@import "tailwindcss";

input,
button {
    @apply bg-neutral-700 border-neutral-500 p-2 rounded-full;
}
</style>