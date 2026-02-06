export type PricingTier = {
  maxCount: number;
  price: number;
  label: string;
};

export const PRICING_TIERS: PricingTier[] = [
  { maxCount: 3, price: 4000, label: "Pack hasta 3 procesos" },
  { maxCount: 5, price: 6000, label: "Pack hasta 5 procesos" },
  { maxCount: 10, price: 10000, label: "Pack hasta 10 procesos" },
  { maxCount: 15, price: 13000, label: "Pack hasta 15 procesos" },
];

export interface PriceResult {
  price: number;
  packName: string;
  isCustom: boolean;
}

export const calculatePrice = (count: number): PriceResult | null => {
  if (count === 0) return null;

  for (const tier of PRICING_TIERS) {
    if (count <= tier.maxCount) {
      return {
        price: tier.price,
        packName: tier.label,
        isCustom: false,
      };
    }
  }

  // Si supera el máximo definido (15 actualmente), es precio a medida
  return {
    price: 0,
    packName: "Presupuesto personalizado",
    isCustom: true,
  };
};

export const getNextPackInfo = (count: number): { remaining: number; nextPackSize: number; progress: number } | null => {
  // Si ya superamos o igualamos el último tramo, no hay "siguiente pack"
  const lastTier = PRICING_TIERS[PRICING_TIERS.length - 1];
  if (count >= lastTier.maxCount) return null;

  // Encontrar el siguiente tramo
  const targetTier = PRICING_TIERS.find(t => count < t.maxCount);

  if (!targetTier) return null;

  const nextPackSize = targetTier.maxCount;

  // Encontrar el tramo anterior para calcular progreso
  const tierIndex = PRICING_TIERS.indexOf(targetTier);
  const previousPackSize = tierIndex > 0 ? PRICING_TIERS[tierIndex - 1].maxCount : 0;

  const remaining = nextPackSize - count;
  const progress = ((count - previousPackSize) / (nextPackSize - previousPackSize)) * 100;

  return { remaining, nextPackSize, progress };
};
