import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const {
    data: movies,
    loading: loading,
    error: error,
    refetch: lodaMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutID = setTimeout(async () => {
      if (searchQuery.trim()) {
        await lodaMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0 "
        resizeMode="cover"
      ></Image>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="px-5">
              <SearchBar
                placeHolder="Search Movies..."
                value={searchQuery}
                onChangeText={(text: string) => setsearchQuery(text)}
                editable={true}
              />
            </View>
            {loading && <ActivityIndicator size="large" color={"#0000ff"} />}
            {error && (
              <Text className="text-red-500 text-center mt-5">
                Error: {error.message}
              </Text>
            )}
            {!loading &&
              !error &&
              searchQuery.trim() &&
              (movies?.length ?? 0) > 0 && (
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  Search Result for{" "}
                  <Text className="text-darkAccent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Please enter a search term"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
