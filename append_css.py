import codecs

new_css = """
/* ============================================
   FEATURE SHOWCASE (Explora la app)
   ============================================ */
.bg-cyan-textured {
  position: relative;
  background-color: #174249;
}
.bg-cyan-textured::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.15;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}
.bg-cyan-textured > * {
  position: relative;
  z-index: 2;
}

.feature-showcase-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
  align-items: center;
  margin-top: var(--space-2xl);
}

@media (max-width: 900px) {
  .feature-showcase-grid {
    grid-template-columns: 1fr;
  }
}

.feature-tabs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.feature-tab-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 6px solid transparent;
  color: var(--gray-800);
}

.feature-tab-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(5px);
}

.feature-tab-card.active {
  background: #ffffff;
  border-left-color: var(--green-500);
  transform: scale(1.03) translateX(10px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.3);
}

.feature-tab-number {
  font-family: var(--font-handwritten);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--green-800);
  display: block;
  margin-bottom: var(--space-xs);
}

.feature-tab-desc {
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  color: inherit;
}

.feature-phone-wrapper {
  margin: 0 auto;
  max-width: 380px;
  width: 100%;
}
"""

with open('d:/Antigravity/Git/FoodCare/assets/styles/styles.css', 'a', encoding='utf-8') as f:
    f.write(new_css)
