import { Divider } from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";

import PageHelmet from "@/components/seo/page-helmet";
import { setActiveTab } from "@/stores/slices/ui-slice";
import { store } from "@/stores/store";
import { checkHydration } from "@/utils/check-hydration";
import loaderFetch from "@/utils/loader-fetch";
import { loaderFetchProtected, UnauthorizedError } from "@/utils/loader-fetch-protected";

import { Product } from "./components/product";
import { ProductTabs } from "./components/product-tabs";

const SuggestedProducts = React.lazy(
  () => import("./components/suggested-products/suggested-products"),
);

export const ProductPage = () => {
  const { product, reviewsData, wishlisted, canCurrentUserReview }: any = useLoaderData();
  const dispatch = useDispatch();

  // This code is for being able to scroll to reviews outside of this component
  // const location = useLocation();

  // useEffect(() => {
  //   if (location.hash === "#rating") {
  //     const observer = new MutationObserver((mutations, obs) => {
  //       const reviewsSection = document.getElementById("rating");
  //       if (reviewsSection) {
  //         reviewsSection.scrollIntoView({ behavior: "smooth" });
  //         obs.disconnect(); // Stop observing once we have found the element
  //       }
  //     });

  //     observer.observe(document, {
  //       childList: true,
  //       subtree: true,
  //     });

  //     return () => observer.disconnect();
  //   }
  // }, [location.hash]);

  useEffect(() => {
    dispatch(setActiveTab(0));
  }, [dispatch, product.id]);

  const scrollToReviews = () => {
    dispatch(setActiveTab(1));
    setTimeout(() => {
      const reviewsSection = document.getElementById("reviews");
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <PageHelmet
        title={`${product.productName}`}
        description="Get in-depth information about products, read reviews, and compare features at Electrozone."
      />
      <div className="page-spacing">
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={Promise.all([product, wishlisted])}>
            <Product
              id={product.id}
              productName={product.productName}
              thumbnail={product.thumbnail}
              images={product.productImages}
              brand={product.brand}
              description={product.description}
              price={product.price}
              stock={product.stock}
              averageRating={product.averageRating}
              onRatingClick={scrollToReviews}
              subcategory={product.subcategory}
              category={product.category}
              isInitiallyWishlisted={wishlisted}
            />
          </Await>
          <ProductTabs
            productDescription={product.description}
            canCurrentUserReview={canCurrentUserReview}
            productId={product.id}
            reviews={reviewsData.reviews}
            ratingsDistribution={reviewsData.ratingsDistribution}
          />
        </Suspense>
        <Divider />
        <Suspense>
          <SuggestedProducts productId={product.id} />
        </Suspense>
      </div>
    </>
  );
};

async function loadProduct(productId: string) {
  const result = await loaderFetch(`${import.meta.env.VITE_API_URL}/product/${productId}`, "GET");
  return result.data;
}

async function checkWishlist({ request, productId }: any) {
  const isSignedIn = store.getState().user.isSignedIn;

  if (!isSignedIn) {
    return false;
  }

  return await loaderFetchProtected(
    `${import.meta.env.VITE_API_URL}/wishlist/${productId}/check`,
    "GET",
    request,
  );
}

async function loadReviews(productId: string) {
  const response = await loaderFetch(`${import.meta.env.VITE_API_URL}/review/${productId}`, "GET");

  return response.data;
}

async function canCurrentUserReview({ request, productId }: any) {
  await checkHydration(store);
  const isSignedIn = store.getState().user.isSignedIn;
  if (!isSignedIn) {
    return false;
  }
  try {
    const result = await loaderFetchProtected(
      `${import.meta.env.VITE_API_URL}/review/${productId}/eligibility`,
      "GET",
      request,
    );

    return result === true;
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    if (error instanceof Error && "status" in error && (error as any).status === 400) {
      return false;
    }
    throw error;
  }
}

async function isUserSignedIn() {
  return store.getState().user.isSignedIn;
}

export const loader = async ({ request, params }: any) => {
  try {
    const { productSlug } = params;
    const [productId] = productSlug.split("-p-");

    await checkHydration(store);

    const productPromise = loadProduct(productId);
    const reviewsPromise = loadReviews(productId);

    let wishlistedPromise = Promise.resolve(false);
    let canReviewPromise = Promise.resolve(false);

    if (await isUserSignedIn()) {
      wishlistedPromise = checkWishlist({ request, productId });
      canReviewPromise = canCurrentUserReview({ request, productId });
    }

    const [product, reviewsData, wishlisted, canReview] = await Promise.all([
      productPromise,
      reviewsPromise,
      wishlistedPromise,
      canReviewPromise,
    ]);

    return defer({
      product,
      wishlisted,
      reviewsData,
      canCurrentUserReview: canReview,
    });
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return redirect("/sign-in");
    }
    throw error;
  }
};
