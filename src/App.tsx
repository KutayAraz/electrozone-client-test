import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./common/Layout/index";
import Error from "./pages/Error/index";
import ProductList from "./pages/Product-List";
import SignIn from "./pages/Sign-in";
import SignUp from "./pages/Sign-up";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProductList />,
        errorElement: <Error />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
