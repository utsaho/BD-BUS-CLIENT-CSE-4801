import { Helmet } from "react-helmet-async";

const PageTitle = ({title}) => {
    return (
        <Helmet>
            <title>BB | {title}</title>
        </Helmet>
    );
};

export default PageTitle;