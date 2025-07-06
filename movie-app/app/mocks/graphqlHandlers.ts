import { graphql, HttpResponse } from "msw";
import { graphql as executeGraphQL } from "graphql";
import { movies } from "./data";
import { graphSchema as schema } from "./graphSchemas";

const customService = graphql.link("https://api.example.com/review-service");

export const graphqlHandlers = [
  customService.query("ListReviews", async ({ query, variables }) => {
    return HttpResponse.json({
      data: {
        serviceReviews: [
          {
            id: "45e41b3e-a99e-4257-a588-d692210d3c49",
            message: "This is a review from the custom service",
          },
        ],
      },
    });
  }),
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
