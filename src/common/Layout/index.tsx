import { LoaderFunction, Outlet, useLocation, useNavigation } from "react-router-dom";
import Footer from "./Footer/index";
import NavStrip from "./NavStrip";
import Header from "./Header";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/setup/store";
import { CheckoutIntent } from "@/setup/slices/models";
import { setUserIntent, updateCartItemCount } from "@/setup/slices/user-slice";
import { clearbuyNowCart } from "@/setup/slices/buyNowCart-slice";
import { clearLocalcart } from "@/setup/slices/localCart-slice";
import UserLocation from "./UserLocation";
import { Alert, Slide, useMediaQuery } from "@mui/material";
import { hideAlert } from "@/setup/slices/alert-slice";
import { checkHydration } from "@/utils/check-hydration";
import loaderFetch from "@/utils/loader-fetch";
import LoadingIndicator from "../LoadingBar";
import { useScrollDirection } from "../Hooks/use-scrollDirection";
import { debounce } from "@/utils/debounce";
import { SearchControls } from "./SearchControls";

const Layout = () => {
  const dispatch = useDispatch<any>();
  const alertState = useSelector((state: RootState) => state.alert);
  const scrollDirection = useScrollDirection();
  const divRef = useRef<any>(null);
  const [divHeight, setDivHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const path = location.pathname;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const notifications = useSelector((state: RootState) => state.alert.notifications);

  // Check if the path starts with '/category' and has more segments following it
  const pathSegments = location.pathname.split('/').filter(Boolean); // Split path and remove empty segments

  // Determine if you should show the nav strip
  const showHeaderExtras = !(pathSegments[0] === 'category' && pathSegments.length >= 3) && !path.startsWith('/search');

  useEffect(() => {
    // Handler to call on scroll
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Debounced version of the scroll handler
    const debouncedHandleScroll = debounce(handleScroll, 1000);

    window.addEventListener('scroll', debouncedHandleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, []);

  useEffect(() => {
    if (divRef.current) {
      setDivHeight(divRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div ref={divRef} className={`bg-theme-blue sticky z-20 ${(scrollDirection === "down" && isMobile) ? "-top-48" : "top-0"} h-[${divHeight}px] transition-all duration-200`}>
        <Header />
        {(showHeaderExtras || !isMobile) && <NavStrip />}
        {showHeaderExtras && <UserLocation />}
        {isMobile && <SearchControls />}
      </div>
      <LoadingIndicator />
      <div className="fixed right-0 top-2 sm:top-28 z-[100]">
        {notifications.map((alert) => (
          <Slide
            key={alert.id}
            direction="left"
            in={true}
            mountOnEnter
            unmountOnExit
          >
            <Alert
              severity={alert.type}
              onClose={() => dispatch(hideAlert(alert.id))}
              className="mb-2"
              style={{ borderRadius: 0 }}
            >
              {alert.message}
            </Alert>
          </Slide>
        ))}
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

const mergeCartsAndSetIntent = async () => {
  const state = store.getState();
  let productsToOrder;

  const userIntent = state.user.userIntent;
  const buyNowCart = state.buyNowCart

  if (!state.user.isSignedIn) return;

  if (userIntent === CheckoutIntent.Instant) {
    productsToOrder = [buyNowCart];
  } else if (userIntent === CheckoutIntent.Local) {
    const localCartItems = state.localCart.items;
    productsToOrder = localCartItems.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  }

  const result = await loaderFetch(`${import.meta.env.VITE_API_URL}/carts/merge-carts`,
    "PATCH",
    productsToOrder,
    true)
  if (result?.data) {
    store.dispatch(setUserIntent(CheckoutIntent.Normal));
    store.dispatch(clearbuyNowCart());
    store.dispatch(clearLocalcart());
    store.dispatch(updateCartItemCount({ cartItemCount: result.data.totalQuantity }))
  }
}

export const loader: LoaderFunction = async ({ request }: any) => {
  const url = new URL(request.url);
  const currentPath = url.pathname;
  await checkHydration(store)
  const userIntent = store.getState().user.userIntent;

  if (currentPath !== "/checkout" &&
    currentPath !== "/sign-in" &&
    (userIntent == CheckoutIntent.Instant ||
      userIntent === CheckoutIntent.Local)) {
    mergeCartsAndSetIntent()
  }
  return null;
}


// const headerRef = useRef<HTMLDivElement>(null);
// const [isScrolled, setIsScrolled] = useState<boolean>(false);

// useEffect(() => {
//   const handleScroll = () => {
//     if (headerRef.current) {
//       const headerHeight = headerRef.current.offsetHeight;
//       const offset = window.scrollY;
//       setIsScrolled(offset > headerHeight);
//     }
//   };

//   window.addEventListener("scroll", handleScroll);

//   return () => {
//     window.removeEventListener("scroll", handleScroll);
//   };
// }, []);
