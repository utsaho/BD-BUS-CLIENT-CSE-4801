import PageTitle from "../../../Components/PageTitle/PageTitle";
// import AvailableRoute from "../AvailableRoutes/AvailableRoute";
import Search from "../Search/Search";

const SearchBus = () => {
    return (
        <div>
            <PageTitle title={'Search'}></PageTitle>
            <Search></Search>
            {/* <AvailableRoute></AvailableRoute> */}
        </div>
    );
};

export default SearchBus;