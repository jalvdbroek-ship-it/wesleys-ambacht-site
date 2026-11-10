/**
 * Interne links moeten het basispad van de deployment volgen.
 * Op GitHub Pages staat de site in /wesleys-ambacht-site, op het eigen
 * domein in /.
 *
 * Zonder deze prefix wijzen alle links naar https://domein.nl/contact/ in
 * plaats van https://domein.nl/wesleys-ambacht-site/contact/ — en dat geeft
 * een 404.
 */

const base = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** Zet het basispad vóór een intern pad. Externe links blijven ongemoeid. */
export const withBase = (path: string): string => {
  if (!path.startsWith('/')) return path;
  if (path.startsWith('//')) return path;
  return `${base}${path}`;
};

/** Interne links met een anker, bijvoorbeeld /contact/#offerte. */
export const withBaseAnchor = (path: string, anchor: string): string =>
  `${withBase(path)}#${anchor}`;

/**
 * Haalt het basispad weer weg uit het pad van de huidige pagina.
 * Zo kun je vergelijken met de paden uit de navigatie, die zonder
 * basispad zijn opgeschreven.
 */
export const withoutBase = (path: string): string => {
  if (base === '') return path;
  if (path === base) return '/';
  if (path.startsWith(`${base}/`)) return path.slice(base.length);
  return path;
};
