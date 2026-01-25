<template>
  <nav id="navigationPanel" class="flex justify-between items-center p-4 bg-neutral-200 navigationPanel">
    <div class="flex leftNav gap-2">
      <NuxtLink to="/" :class="{ 'active': currentRoute === '/' || currentRoute === '/Game' }" class="nav-link">
        Play Game
      </NuxtLink>
      <NuxtLink to="/BoardCreator" :class="{ 'active': currentRoute === '/BoardCreator' }" class="nav-link">
        Board Creator
      </NuxtLink>
      <NuxtLink to="/Leaderboards" :class="{ 'active': currentRoute === '/Leaderboards' }" class="nav-link">
        Leaderboards
      </NuxtLink>
      <NuxtLink to="/HowToPlay" :class="{ 'active': currentRoute === '/HowToPlay' }" class="nav-link">
        How to play
      </NuxtLink>
    </div>
    <div class="flex justify-center rightNav">
      <UserPanel></UserPanel>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()

const currentRoute = computed(() => {
  return route.path
})

</script>

<style scoped>
.navigationPanel {
  color: black;
  height: 6vh;
  background-color: #2a2a2a;
  border-bottom: 0px solid #444;
}

.leftNav {
  width: 80vw;
}

.leftNav:first-child {
  margin-left: 2.5vw;
}

.leftNav>* {
  width: 17.5vw;
}

.rightNav {
  width: 20vw;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #bbb;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: center;
}

.nav-link:hover {
  color: white;
  background-color: #3a3a3a;
}

.nav-link.active {
  color: white;
  background-color: #4299e1;
  font-weight: 600;
}

.nav-link.active:hover {
  background-color: #3182ce;
}

.nav-link.active::after {
  content: '';
  position: fixed;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background-color: #4299e1;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .navigationPanel {
    padding: 4px 8px;
    height: auto;
    min-height: 6vh;
  }

  .leftNav {
    width: 70vw;
    flex-wrap: wrap;
    gap: 4px;
  }

  .leftNav>* {
    width: auto;
    flex: 1;
    min-width: 80px;
    font-size: 0.9rem;
    padding: 6px 8px;
  }

  .rightNav {
    width: 30vw;
  }

  .nav-link.active::after {
    width: 50%;
    bottom: -4px;
  }
}
</style>