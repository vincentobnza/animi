const searchQuery = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        description
        episodes
        averageScore
      }
    }
  `;
