// It's recommended to store your API key in an environment variable
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

const careerQueries = ['Game Developer', '3D Animator', 'Content Creator', 'Data Scientist', 'UI UX Designer', 'Software Engineer', 'Digital Marketer', 'Architect'];

// Fallback data in case the API fails or key is missing
const fallbackData = careerQueries.map(name => ({
  name,
  img: `https://placehold.co/200x200/e0f2fe/0c4a6e?text=${name.split(' ').join('+')}`
}));

export const fetchCareerImages = async () => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
    console.warn("Pexels API Key not found or is a placeholder. Using fallback images.");
    return fallbackData;
  }

  try {
    // Fetching more generic, high-quality portraits
    const response = await fetch(`https://api.pexels.com/v1/search?query=professional+portrait&per_page=${careerQueries.length}&orientation=square`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
    const data = await response.json();

    if (data.photos.length < careerQueries.length) {
      console.warn("Not enough photos returned from Pexels. Using fallback data.");
      return fallbackData;
    }

    return data.photos.map((photo: any, index: number) => ({
      name: careerQueries[index],
      img: photo.src.medium,
    }));
  } catch (error) {
    console.error("Failed to fetch images from Pexels:", error);
    return fallbackData;
  }
};
