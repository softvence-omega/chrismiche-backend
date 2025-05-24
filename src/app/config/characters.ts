export const CharacterList = [
    "Elk",
    "Elk Super",
    "Ninja",
    "Ninja Super",
    "Robo",
    "Robo Super",
    "Skate",
    "Skate Super",
  ] as const;
  
  export type TCharacter = (typeof CharacterList)[number];
  
  export const CharacterDescriptions: Record<TCharacter, string> = {
    Elk: "A wild and resilient survivor in the forest.",
    "Elk Super": "An upgraded Elk with supernatural strength.",
    Ninja: "A stealthy warrior with lightning-fast reflexes.",
    "Ninja Super": "A master assassin with enhanced skills.",
    Robo: "A standard robot character with balanced traits.",
    "Robo Super": "An advanced AI-powered robot with supreme abilities.",
    Skate: "A cool and agile skater who’s quick on their feet.",
    "Skate Super": "A turbo skater with extreme tricks and speed.",
  };
  