import Icon, { AvailableIcons } from "../../components/ui/Icon.tsx";

interface Props {
  badges: string[];
}

interface BadgeSpec {
  icon: AvailableIcons;
  label: string;
}

const BADGE_MAP: Record<string, BadgeSpec> = {
  "vegano": { icon: "vegano", label: "Vegano" },
  "multifuncional": { icon: "multifuncional", label: "Multifuncional" },
  "cruelty": { icon: "cruelty", label: "Cruelty Free" },
  "parabenos": { icon: "parabenos", label: "Livre De Parabenos" },
};

function getBadgeSpec(text: string): BadgeSpec | null {
  const normalizedText = text.toLowerCase();
  for (const [key, spec] of Object.entries(BADGE_MAP)) {
    if (normalizedText.includes(key)) {
      return spec;
    }
  }
  return null;
}

export default function ProductBadges({ badges }: Props) {
  if (!badges || badges.length === 0) return null;

  const specs = badges
    .map(getBadgeSpec)
    .filter((spec): spec is BadgeSpec => spec !== null);

  if (specs.length === 0) return null;

  // We add a specific margin top and bottom to match the design
  return (
    <div class="flex flex-wrap gap-[28px] mt-6 mb-6">
      {specs.map((spec) => (
        <div class="flex flex-col items-center gap-2" key={spec.label}>
          <Icon id={spec.icon} width={40} height={40} class="text-black" />
          <span class="text-[12px] text-[#4C4C4C] text-center leading-tight max-w-[70px]">
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
}
