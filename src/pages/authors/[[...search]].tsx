import { GetStaticPropsContext } from 'next';
import { FaustPage, getNextStaticProps } from '@faustwp/core';
import { gql } from '@apollo/client';
import { GET_USERS_FIRST_COMMON } from '@/contains/contants';
import React from 'react';
import ButtonPrimary from '@/components/Button/ButtonPrimary';
import Empty from '@/components/Empty';
import { useRouter } from 'next/router';
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox';
import { useLazyQuery } from '@apollo/client';
import PageLayout from '@/container/PageLayout';
import errorHandling from '@/utils/errorHandling';
import getTrans from '@/utils/getTrans';
import { UsersIcon } from '@heroicons/react/24/outline';

const Page: FaustPage = (props) => {
  const router = useRouter();
  const initUsers = props.data?.users?.edges.map(edge => edge.node) || [];
  const initPageInfo = props.data?.users?.pageInfo;
  const search = router.query.search?.[0] || '';
  const T = getTrans();

  const [getUsersBySearch, getUsersBySearchResult] = useLazyQuery(
    gql(` 
      query queryGetUsersBySearchOnSearchPage(
        $first: Int
        $search: String
        $after: String
      ) {
        users(first: $first, after: $after, where: { search: $search }) {
          edges {
            node {
              id
              firstName
              lastName
              roles {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `),
    {
      notifyOnNetworkStatusChange: true,
      context: {
        fetchOptions: {
          method: process.env.NEXT_PUBLIC_SITE_API_METHOD || 'GET',
        },
      },
      variables: {
        search,
        first: GET_USERS_FIRST_COMMON,
      },
      onError: (error) => {
        errorHandling(error);
      },
    },
  );

  const handleClickShowMore = () => {
    if (!getUsersBySearchResult.called) {
      return getUsersBySearch({
        variables: {
          search,
          after: initPageInfo?.endCursor,
        },
      });
    }

    getUsersBySearchResult.fetchMore({
      variables: {
        search,
        after: getUsersBySearchResult.data?.users?.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.users?.edges) {
          return prev;
        }

        return {
          ...prev,
          users: {
            ...prev.users,
            edges: [
              ...(prev.users?.edges || []),
              ...(fetchMoreResult.users?.edges || []),
            ],
            pageInfo: fetchMoreResult.users?.pageInfo,
          },
        };
      },
    });
  };

  // 클라이언트 측에서 roles가 'MARKETER'인 사용자만 필터링
  let currentUsers = initUsers.filter(user =>
    user.roles.edges.some(roleEdge => roleEdge.node.name === 'MARKETER')
  );

  let hasNextPage = initPageInfo?.hasNextPage;
  let loading = false;

  if (getUsersBySearchResult.called) {
    currentUsers = [
      ...currentUsers,
      ...(getUsersBySearchResult.data?.users?.edges.map(edge => edge.node) || []).filter(user =>
        user.roles.edges.some(roleEdge => roleEdge.node.name === 'MARKETER')
      ),
    ];

    hasNextPage =
      getUsersBySearchResult.loading ||
      getUsersBySearchResult.data?.users?.pageInfo.hasNextPage ||
      false;
    loading = getUsersBySearchResult.loading;
  }

  return (
    <PageLayout
      headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
      footerMenuItems={props.data?.footerMenuItems?.nodes || []}
      pageFeaturedImageUrl={null}
      pageTitle={T['Authors']}
      generalSettings={props.data?.generalSettings}
    >
      <div className="nc-PageExploreAuthors">
        <div className="container space-y-16 py-10 sm:space-y-20 lg:space-y-28 lg:pb-28 lg:pt-20">
          <div className="space-y-14">
            <header>
              <h1 className="block text-2xl font-semibold capitalize sm:text-3xl lg:text-4xl">
                커뮤니티
              </h1>
            </header>

            <main>
              {/* LOOP ITEMS */}
              {!currentUsers.length && !loading ? (
                <Empty />
              ) : (
                <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:mt-12 lg:grid-cols-3 xl:grid-cols-5">
                  {currentUsers.map((user) => (
                    <CardAuthorBox
                      key={user.id}
                      author={user}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {hasNextPage ? (
                <div className="mt-12 flex justify-center lg:mt-14">
                  <ButtonPrimary
                    disabled={loading || !currentUsers?.length}
                    loading={loading}
                    onClick={handleClickShowMore}
                  >
                    {T['Show me more']}
                  </ButtonPrimary>
                </div>
              ) : null}
            </main>
          </div>

          {/* SUBCRIBES */}
        </div>
      </div>
    </PageLayout>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export function getStaticProps(ctx: GetStaticPropsContext) {
  return getNextStaticProps(ctx, {
    Page,
    revalidate: 900,
  });
}

Page.variables = ({ params }) => {
  return {
    search: params?.search?.[0] || '',
    first: GET_USERS_FIRST_COMMON,
    headerLocation: PRIMARY_LOCATION,
    footerLocation: FOOTER_LOCATION,
  };
};

Page.query = gql(`
  query AuthorsPageQueryGetUsersBySearch ( $first: Int,  $search: String = "", $after: String, $headerLocation: MenuLocationEnum!, $footerLocation: MenuLocationEnum! )  {
    users(first: $first, after: $after, where: {search: $search}) {
        edges {
          node {
             id
             firstName
             lastName
             roles {
               edges {
                 node {
                   id
                   name
                 }
               }
             }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
    }
   # common query for all page 
   generalSettings {
      title
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        id
        label
      }
    }
    footerMenuItems: menuItems(where: { location:  $footerLocation  }, first: 50) {
      nodes {
        id
        label
      }
    }
  }
`);

export default Page;
