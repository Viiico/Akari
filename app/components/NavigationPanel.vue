<template>
  <nav class="flex justify-between items-center p-4 bg-neutral-200 navigationPanel">
    <div class="flex leftNav gap-2">
      <NuxtLink to="/">Play Game</NuxtLink>
      <NuxtLink to="/BoardCreator">Board Creator</NuxtLink>
      <NuxtLink to="/Leaderboards">Leaderboards</NuxtLink>
      <NuxtLink to="/HowToPlay">How to play</NuxtLink>
    </div>
    <div class="flex justify-center rightNav">
      <UserPanel></UserPanel>
    </div>
  </nav>
</template>
<style scoped>
  .navigationPanel {
    color: black;
    height: 6vh;
  }

  .leftNav {
    width: 80vw;
  }

  .leftNav:first-child {
    margin-left: 2.5vw;
  }

  .leftNav > * {
    width: 17.5vw;
  }

  .rightNav {
    width: 20vw;
  }

</style>