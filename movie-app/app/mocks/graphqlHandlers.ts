import { graphql, HttpResponse } from "msw";
import { graphql as executeGraphQL } from "graphql";
import { movies } from "./data";
import { graphSchema as schema } from "./graphSchemas";

export const graphqlHandlers = [
  graphql.operation(async ({ query, variables }) => {
    const { data, errors } = await executeGraphQL({
      schema,
      source: query,
      variableValues: variables,
      rootValue: {
        reviews(args: any) {
          const movie = movies.find((movie) => {
            return movie.id === args.movieId;
          });

          return movie?.reviews || [];
        },
        addReview(args: any) {
          const { author, reviewInput } = args;
          const { movieId, ...review } = reviewInput;

          const movie = movies.find((movie) => {
            return movie.id === movieId;
          });

          if (!movie) {
            throw new Error(`Cannot find a movie by ID "${movieId}"`);
          }

          const newReview = {
            ...review,
            id: Math.random().toString(16).slice(2),
            author,
          };

          movie.reviews.push(newReview);

          return newReview;
        },
      },
    });

    // Check after why the data are returnin as errors
    // @ts-ignore - GraphQL errors type mismatch with MSW expectations
    return HttpResponse.json({ data: data || errors });
  }),
];
