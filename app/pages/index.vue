<template>
    <NavigationPanel />
    <h1 class="text-4xl">Hello World!</h1>
    {{ counter }}
    <button @click="counter++">Click</button>
</template>

<script setup>
const counter = useState('counter', () => 0);

useHead({
    title: 'Akari Game',
});
</script>

<style></style>