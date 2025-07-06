import { delay, http, HttpResponse, passthrough } from "msw";
import { movies } from "./data";
import { graphqlHandlers } from "./graphqlHandlers";

const serverHandlers = [
  http.get("https://api.example.com/movies/featured", async () => {
    await delay(3000);
    console.log("Mocking API response");

    return HttpResponse.json(movies);
  }),
  http.get("https://api.example.com/movies/:slug", (request) => {
    const { slug } = request.params;

    console.log("Mocking API response for movie with slug:", slug);

    const movie = movies.find((movie) => movie.slug === slug);

    if (!movie) {
      return HttpResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return HttpResponse.json(movie);
  }),
  http.post("https://auth.provider.com/validate", async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      id: "2b225b31-904a-443b-a898-a280fa8e0356",
      email,
      firstName: "John",
      lastName: "Castro",
      avatarUrl: "https://i.pravatar.cc/100?img=12",
    });
  }),
];

const clientHandlers = [
  http.get("/api/recommendations", async ({ request }) => {
    const url = new URL(request.url);

    const movieIdForErrorResponse = movies[9].id;
    const movieForNetworkErrorResponse = movies[0].id;
    const movieIdForPassThroughResponse = movies[1].id;
    const movieId = url.searchParams.get("movieId");

    // // await delay(3000);
    // await delay("real");

    if (!movieId) {
      return HttpResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    if (movieId === movieIdForPassThroughResponse) {
      return passthrough();
    }

    if (movieForNetworkErrorResponse === movieId) {
      return HttpResponse.error();
    }

    if (movieIdForErrorResponse === movieId) {
      return HttpResponse.json(null, { status: 500 });
    }

    const recommendations = movies.filter((movie) => movie.id !== movieId);

    return HttpResponse.json(recommendations);
  }),
];

export const handlers = [
  ...serverHandlers,
  ...clientHandlers,
  ...graphqlHandlers,
];
