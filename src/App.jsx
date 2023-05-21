import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./screens/home/Home";
import Details from "./screens/details/Details";
import SearchResult from "./screens/searchResult/SearchResult";
import Explore from "./screens/explore/Explore";
import PageNotFound from "./screens/404/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./redux/homeSlice";
import { Routes, Route } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  // console.log(url);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      // console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = []
    let endPoints = ["tv","movie"]
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises);
    // console.log(data);
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });
    // console.log(allGenres)
    dispatch(getGenres(allGenres));
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
