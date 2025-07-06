import { graphql, HttpResponse } from "msw";
import { movies } from "./data";

/**
 * Handlers without the GraphQL Schema definition.
 * This is an older version of the handlers that does not use the GraphQL schema.
 * It is kept for reference and compatibility with older code.
 *
 * Note: This approach is not recommended for new implementations.
 */
export const oldGraphqlHandlers = [
  graphql.query("ListReviews", async ({ query, variables }) => {
    const { movieId } = variables;

    const movie = movies.find((movie) => movie.id === movieId);

    const reviews = movie?.reviews || [];

    return HttpResponse.json({
      data: {
        reviews,
      },
    });
  }),
  graphql.mutation("AddReview", ({ variables }) => {
    const { author, reviewInput } = variables;
    const { movieId, ...review } = reviewInput;

    const movie = movies.find((movie) => movie.id === movieId);

    if (!movie) {
      return HttpResponse.json({
        errors: [
          {
            message: `Cannot find movie with ID "${movieId}"`,
          },
        ],
      });
    }

    const newReview = {
      ...review,
      id: Math.random().toString(16).slice(2),
      author,
    };

    movie.reviews.push(newReview);

    return HttpResponse.json({
      data: {
        review: newReview,
      },
    });
  }),
];
