import { GetStaticPropsContext } from 'next'
import { FaustPage, getNextStaticProps } from '@faustwp/core'
import { gql } from '@/__generated__'
import { GET_USERS_FIRST_COMMON } from '@/contains/contants'
import React from 'react'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import Empty from '@/components/Empty'
import { useRouter } from 'next/router'
import CardAuthorBox from '@/components/CardAuthorBox/CardAuthorBox'
import { getUserDataFromUserCardFragment } from '@/utils/getUserDataFromUserCardFragment'
import { useLazyQuery } from '@apollo/client'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '@/contains/menu'
import PageLayout from '@/container/PageLayout'
import errorHandling from '@/utils/errorHandling'
import getTrans from '@/utils/getTrans'
import { UsersIcon } from '@heroicons/react/24/outline'
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AuthorsPageQueryGetUsersBySearchQuery, AuthorsPageQueryGetUsersBySearchQueryVariables, MenuLocationEnum } from '@/__generated__/graphql';

// gql 결과를 TypedDocumentNode로 캐스팅
const GET_USERS_BY_SEARCH_QUERY = gql(`
    query queryGetUsersBySearchOnSearchPage(
        $first: Int
        $search: String
        $after: String
    ) {
        users(first: $first, after: $after, where: { search: $search }) {
            nodes {
                id
                roles {
                    nodes {
                        name
                    }
                }
                ...NcmazFcUserFullFields
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`) as unknown as TypedDocumentNode<AuthorsPageQueryGetUsersBySearchQuery, AuthorsPageQueryGetUsersBySearchQueryVariables>;

const Page: FaustPage<AuthorsPageQueryGetUsersBySearchQuery> = (props) => {
    const router = useRouter();
    const initUsers = props.data?.users?.nodes;
    const initPageInfo = props.data?.users?.pageInfo;
    const search = router.query.search?.[0] || '';
    const T = getTrans();

    const [getUsersBySearch, getUsersBySearchResult] = useLazyQuery(GET_USERS_BY_SEARCH_QUERY, {
        notifyOnNetworkStatusChange: true,
        context: {
            fetchOptions: {
                method: process.env.NEXT_PUBLIC_SITE_API_METHOD || 'GET',
            },
        },
        variables: {
            search,
            first: GET_USERS_FIRST_COMMON,
            headerLocation: MenuLocationEnum.Primary,
            footerLocation: MenuLocationEnum.Footer,
        },
        onError: (error) => {
            errorHandling(error);
        },
    });

    const handleClickShowMore = () => {
        if (getUsersBySearchResult.data?.users?.pageInfo?.hasNextPage) {
            getUsersBySearch({
                variables: {
                    after: getUsersBySearchResult.data?.users?.pageInfo?.endCursor,
                    search,
                    first: GET_USERS_FIRST_COMMON,
                    headerLocation: MenuLocationEnum.Primary,
                    footerLocation: MenuLocationEnum.Footer,
                },
            });
        }
    };

    // 클라이언트 측에서 필터링
    const users = getUsersBySearchResult.data?.users?.nodes || initUsers || [];
    const marketers = users.filter(user =>
        user.roles.nodes.some(role => role.name === 'MARKETER')
    );

    return (
        <PageLayout>
            {marketers.length ? (
                marketers.map((user, index) => (
                    <CardAuthorBox
                        key={user.id || index}
                        user={getUserDataFromUserCardFragment(user)}
                    />
                ))
            ) : (
                <Empty icon={UsersIcon} text={T('No authors found')} />
            )}
            {getUsersBySearchResult.data?.users?.pageInfo?.hasNextPage && (
                <ButtonPrimary onClick={handleClickShowMore}>
                    {T('Show more')}
                </ButtonPrimary>
            )}
        </PageLayout>
    );
};

export default Page;


