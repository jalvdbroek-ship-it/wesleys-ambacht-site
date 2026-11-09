/**
 * Beweging op de site.
 *
 * Drie dingen, allemaal met een terugval:
 *
 *   1. De accentlijn boven een sectiekop groeit zodra die sectie
 *      in beeld komt. De lijn is een element op zichzelf, de tekst
 *      erboven blijft altijd staan.
 *   2. De kop wordt kleiner zodra je scrolt.
 *   3. De waterlijn en het drijvende beeld draaien met CSS.
 *
 * Met prefers-reduced-motion gebeurt er niets. Zonder JavaScript
 * blijft de lijn op zijn plek staan, want de verborgen toestand
 * hangt aan de .js-klasse.
 */

const zonderBeweging = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- De accentlijn --- */
const accentlijnen = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (accentlijnen.length > 0) {
  if (zonderBeweging || !('IntersectionObserver' in window)) {
    for (const lijn of accentlijnen) lijn.classList.add('is-zichtbaar');
  } else {
    const waarnemer = new IntersectionObserver(
      (items) => {
        for (const item of items) {
          if (!item.isIntersecting) continue;
          (item.target as HTMLElement).classList.add('is-zichtbaar');
          waarnemer.unobserve(item.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 }
    );

    for (const lijn of accentlijnen) waarnemer.observe(lijn);

    // Vangnet: ook als de waarnemer niets ziet, komt de lijn te staan.
    window.setTimeout(() => {
      for (const lijn of accentlijnen) lijn.classList.add('is-zichtbaar');
    }, 4000);
  }
}

/* --- De kop condenseert --- */
const kop = document.querySelector<HTMLElement>('.kop');

if (kop && !zonderBeweging) {
  let laatste = 0;
  let aangevraagd = false;

  const bijwerken = () => {
    aangevraagd = false;
    laatste = window.scrollY;
    kop.classList.toggle('is-compact', laatste > 60);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (aangevraagd) return;
      aangevraagd = true;
      window.requestAnimationFrame(bijwerken);
    },
    { passive: true }
  );

  bijwerken();
}
