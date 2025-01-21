"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Pagination, Card, Button, Spinner, CardBody, CardFooter,} from "@nextui-org/react";


const fetchMovies = async () => {
  const url = "https://imdb236.p.rapidapi.com/imdb/most-popular-movies";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b23d0a1421msh4b046b0fffcc343p1cab12jsnca4fb57c49d9",
      "x-rapidapi-host": "imdb236.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result)
    return result; 
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

function MoviePage() {
  const [movies, setMovies] =useState<any>([]);
  const [currentMovies,setCurrentMovies]=useState<any>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const moviesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedMovies = await fetchMovies();
      setMovies(fetchedMovies);
      const startIndex = (currentPage- 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      setCurrentMovies(fetchedMovies.slice(startIndex, endIndex));
      setMovies(fetchedMovies);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage- 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    setCurrentMovies(movies.slice(startIndex, endIndex));

   }, [currentPage]);
  const handlePageChange=(page:any)=>{
    setCurrentPage(page)
    const startIndex = (page- 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    setCurrentMovies(movies.slice(startIndex, endIndex));

  }

  return (
    <div className={styles.main}>
      <div className="mt-16 flex flex-col items-center gap-5">
        {loading ? (
          <Spinner color="default" />
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {currentMovies.map((movie:any, index:any) => (
              <div
                key={index}
                style={{
                  flex: "1 1 calc(25% - 16px)",
                  maxWidth: "calc(25% - 16px)",
                }}
              >
                <Card isHoverable isPressable>
                  <CardBody>
                    <Image
                      src={movie.primaryImage}
                      objectFit="cover"
                      width={100}
                      height={200}
                      alt={movie.title}
                    />
                    <h4>{movie.title}</h4>
                    <p>{movie.description}</p>
                    <p>Rating: {movie.averageRating || "N/A"}</p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      as="a"
                      href={movie.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on IMDb
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
        {!loading && (
          <Pagination
            showControls
            initialPage={1}
            total={Math.ceil(movies.length / moviesPerPage)}
            page={currentPage}
            onChange={(page) => handlePageChange(page)}
          />
        )}
      </div>
    </div>
  );
}

export default MoviePage;
