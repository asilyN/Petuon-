async function getEvolutionGif(petType: string, petEvolutionRank: number): Promise<string> {
    try {
      // Dynamically import the GIF based on petType and petEvolutionRank
      const gifPath = await import(`../assets/pets/${petType}/${petEvolutionRank}.gif`);
      return gifPath.default; // Access the default export (the path to the image)
    } catch (error) {
      console.error("Error loading GIF:", error);
      return ''; // Return an empty string or a fallback GIF path if the import fails
    }
  }