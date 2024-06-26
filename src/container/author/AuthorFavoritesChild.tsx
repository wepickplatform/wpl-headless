import { FaustPage } from "@faustwp/core";
import {
  NcgeneralSettingsFieldsFragmentFragment,
  NcmazFcPostFullFieldsFragment,
  PageAuthorFavoritesGetDataQuery,
} from "@/__generated__/graphql";
import React from "react";
import SectionSubscribe2 from "@/components/SectionSubscribe2/SectionSubscribe2";
import SectionTrendingTopic from "@/components/SectionTrendingTopic";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import updatePostFromUpdateQuery from "@/utils/updatePostFromUpdateQuery";
import { QUERY_GET_POSTS_BY_USER_REACTION } from "@/fragments/queries";
import { getUserDataFromUserCardFragment } from "@/utils/getUserDataFromUserCardFragment";
import PageLayout from "@/container/PageLayout";
import { getImageDataFromImageFragment } from "@/utils/getImageDataFromImageFragment";
import GridPostsArchive from "@/components/GridPostsArchive";
import errorHandling from "@/utils/errorHandling";
import { TCategoryCardFull } from "@/components/CardCategory1/CardCategory1";
import AuthorLayout from "@/container/AuthorPageLayout";
import Tab from "@/container/AuthorPageTab";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import GraphqlError from "@/components/GraphqlError";

const AuthorFavoritesChild: FaustPage<PageAuthorFavoritesGetDataQuery> = (
  props
) => {
  const { user } = props.data || {};
  const { name, ncUserMeta } = getUserDataFromUserCardFragment(user || {});
  const { viewer } = useSelector((state: RootState) => state.viewer);
  const router = useRouter();
  const routerQuerySlug = router.query.slug as string;

  const _top10Categories =
    (props.data?.categories?.nodes as TCategoryCardFull[]) || [];

  //
  const [refetchTimes, setRefetchTimes] = React.useState(0);

  const inUserAndReaction = routerQuerySlug + "/LIKE";
  const _onlyNeedCacheFirst = routerQuerySlug !== viewer?.slug;
  const { loading, data, refetch, error, fetchMore } = useQuery(
    QUERY_GET_POSTS_BY_USER_REACTION,
    {
      notifyOnNetworkStatusChange: true,
      skip: !routerQuerySlug,
      context: {
        fetchOptions: {
          method: process.env.NEXT_PUBLIC_SITE_API_METHOD || "GET",
        },
      },
      fetchPolicy: _onlyNeedCacheFirst ? "cache-first" : "cache-and-network",
      variables: {
        first: 20,
        inUserAndReaction,
      },
      onError: (error) => {
        if (refetchTimes > 3) {
          errorHandling(error);
          return;
        }
        setRefetchTimes(refetchTimes + 1);
        refetch();
      },
    }
  );
  //

  const handleClickShowMore = () => {
    if (loading) return;
    if (!data?.posts?.pageInfo?.hasNextPage) return;

    fetchMore({
      variables: {
        after: data?.posts?.pageInfo?.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return updatePostFromUpdateQuery(prev, fetchMoreResult);
      },
    });
  };

  // data for render
  let currentPosts =
    (data?.posts?.nodes as NcmazFcPostFullFieldsFragment[]) || [];
  let hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;

  return (
    <>
      <PageLayout
        headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
        footerMenuItems={props.data?.footerMenuItems?.nodes || []}
        pageFeaturedImageUrl={
          getImageDataFromImageFragment(ncUserMeta?.featuredImage?.node)
            ?.sourceUrl || null
        }
        pageTitle={name}
        generalSettings={
          props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
        }
      >
        <AuthorLayout user={user || {}}>
          <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
            <main>
              {/* TABS FILTER */}
              <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row sm:border-b border-neutral-200 dark:border-neutral-600">
                <Tab currentTab="favorites" />
                <div className="block mb-4 border-b w-full border-neutral-300 dark:border-neutral-500 sm:hidden"></div>
              </div>

              {!!error && (
                <div className="mt-8 lg:mt-12">
                  <GraphqlError
                    error={error}
                    refetch={refetch}
                    loading={loading}
                  />
                </div>
              )}

              <GridPostsArchive
                posts={currentPosts}
                loading={loading}
                showLoadmore={hasNextPage}
                onClickLoadmore={handleClickShowMore}
              />
            </main>

            {/* === SECTION 5 === */}
            <SectionTrendingTopic categories={_top10Categories} />

            {/* SUBCRIBES */}
            <SectionSubscribe2 />
          </div>
        </AuthorLayout>
      </PageLayout>
    </>
  );
};

export default AuthorFavoritesChild;
