const topAnime = `
    query {
      Page(page: 1, perPage: 10) {
        media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          bannerImage
          description
          episodes
          averageScore
          seasonYear
          format
          duration
          genres
          status
        }
      }
    }
  `;
