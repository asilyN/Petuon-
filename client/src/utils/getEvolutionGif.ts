export const getEvolutionGif = (petType: string, evolutionRank: number, tempGif: string | null): string => {
    if (tempGif) {
      return tempGif;
    }
    if (evolutionRank === 1) {
      return `src/assets/pets/${petType}/evolution_1.png`;
    }
    return `src/assets/pets/${petType}/evolution_${evolutionRank}.gif`;
  };