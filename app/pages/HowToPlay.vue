<template>
  <NavigationPanel />
  <main class="how-to-play-page">
    <div class="container">
      <div class="content-grid">
        <section class="section">
          <h2 class="section-title">Game Objective</h2>
          <p class="paragraph">
            Light Up is played on a rectangular grid containing black and white cells.
          </p>
          <p class="paragraph">
            The goal is to place light bulbs on the board so that all white cells are illuminated.
          </p>
        </section>

        <section class="section">
          <h2 class="section-title">Illumination Rules</h2>
          <p class="paragraph">
            A white cell is illuminated if it's in the same row or column as a light bulb, 
            and there are no black cells blocking the path between them.
          </p>
          <p class="paragraph">
            Light bulbs cannot illuminate each other. No two bulbs can be in the same row or column 
            without a black cell between them.
          </p>
        </section>

        <section class="section">
          <h2 class="section-title">Black Cell Numbers</h2>
          <p class="paragraph">
            Some black cells contain numbers. These numbers indicate exactly how many light bulbs 
            must be placed in adjacent cells (horizontally or vertically) to that black cell.
          </p>
        </section>

        <section class="section">
          <h2 class="section-title">Controls</h2>
          <div class="controls-list">
            <div class="control-item">
              <span class="control-action">Left Click</span>
              <span class="control-description">Place a light bulb on empty white cell</span>
            </div>
            <div class="control-item">
              <span class="control-action">Right Click</span>
              <span class="control-description">Mark cell with auxiliary "X" mark</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title">Game Completion</h2>
          <p class="paragraph">
            The puzzle is solved when all white cells are illuminated according to the rules, 
            all numbered black cells have the correct number of adjacent bulbs, and no bulbs 
            illuminate each other.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.how-to-play-page {
  min-height: calc(110vh - 60px);
  max-height: 130vh;
  background-color: #1F1F1F;
  color: white;
  padding: 1rem 1rem 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;

}

.container {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.section {
  background-color: #2a2a2a;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #e2e8f0;
}

.paragraph {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  color: #cbd5e0;
  flex-grow: 1;
}

.controls-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-item {
  display: flex;
  align-items: center;
  background-color: #363636;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #4299e1;
}

.control-action {
  font-weight: 600;
  color: #90cdf4;
  min-width: 100px;
  font-size: 0.95rem;
}

.control-description {
  color: #e2e8f0;
  flex: 1;
  font-size: 0.95rem;
}

.section:nth-child(3),
.section:nth-child(4),
.section:nth-child(5) {
  grid-column: span 2;
}

@media (max-width: 1024px) {
  .container {
    width: 98%;
  }
  
  .content-grid {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .how-to-play-page {
    padding: 1rem 0.5rem 1.5rem 0.5rem;
  }
  
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section:nth-child(3),
  .section:nth-child(4),
  .section:nth-child(5) {
    grid-column: span 1;
  }
  
  .section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .paragraph {
    font-size: 0.95rem;
  }
  
  .control-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0.75rem;
  }
  
  .control-action {
    min-width: auto;
    font-size: 0.9rem;
  }
  
  .control-description {
    font-size: 0.9rem;
  }
}

@media (min-height: 900px) and (min-width: 1024px) {
  .how-to-play-page {
    padding: 2rem 1rem 3rem 1rem;
  }
  
  .content-grid {
    gap: 2rem;
  }
  
  .section {
    padding: 1.5rem;
  }
}
</style>