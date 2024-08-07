import PostCardSaveAction from '@/components/PostCardSaveAction/PostCardSaveAction'
import NcImage from '@/components/NcImage/NcImage'
import NextPrev from '@/components/NextPrev/NextPrev'
import PostCardLikeAndComment from '@/components/PostCardLikeAndComment/PostCardLikeAndComment'
import { FC } from 'react'
import CardAuthor2 from '@/components/CardAuthor2/CardAuthor2'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostTypeFeaturedIcon from '@/components/PostTypeFeaturedIcon/PostTypeFeaturedIcon'
import Link from 'next/link'
import { CommonPostCardProps } from '../Card2/Card2'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'

export interface CardLarge1Props extends CommonPostCardProps {
	onClickNext?: () => void
	onClickPrev?: () => void
}

const CardLarge1: FC<CardLarge1Props> = ({
	className = '',
	post,
	onClickNext = () => {},
	onClickPrev = () => {},
}) => {
	const {
		title,
		date,
		categories,
		author,
		postFormats,
		featuredImage,
		ncPostMetaData,
		commentCount,
		uri,
		databaseId,
	} = getPostDataFromPostFragment(post)

	return (
		<div
			className={`nc-CardLarge1 nc-CardLarge1--hasAnimation relative flex flex-col-reverse justify-end md:flex-row ${className}`}
		>
			<div className="z-10 -mt-8 w-full px-3 sm:px-6 md:absolute md:start-0 md:top-1/2 md:mt-0 md:w-3/5 md:-translate-y-1/2 md:px-0 lg:w-1/2 xl:w-2/5">
				<div className="nc-CardLarge1__left space-y-3 rounded-3xl bg-white/40 p-4 shadow-lg backdrop-blur-lg backdrop-filter sm:space-y-5 sm:p-8 md:px-10 xl:py-14 dark:bg-neutral-900/40 dark:shadow-2xl">
					<CategoryBadgeList categories={categories.nodes || []} />

					<h2 className="nc-card-title text-base font-semibold sm:text-xl lg:text-2xl">
						<Link
							href={uri}
							className="line-clamp-2"
							title={title}
							dangerouslySetInnerHTML={{ __html: title }}
						></Link>
					</h2>

					<CardAuthor2 className="relative" author={author} date={date} />

					<div className="mt-auto flex items-center justify-between">
						<PostCardLikeAndComment
							className="relative"
							commentCount={commentCount || 0}
							linkToPost={uri || ''}
							likeCount={ncPostMetaData?.likesCount || 0}
							postDatabseId={databaseId || 0}
							viewCount={ncPostMetaData?.viewsCount || 0}
						/>

						<PostCardSaveAction
							readingTime={ncPostMetaData?.readingTime || 1}
							postDatabseId={databaseId || 0}
							bookmarkClass="h-8 w-8 bg-neutral-50/30 hover:bg-neutral-50/50 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50"
						/>
					</div>
				</div>
				<div className="p-4 sm:px-10 sm:pt-8">
					<NextPrev
						btnClassName="w-11 h-11 text-xl"
						onClickNext={onClickNext}
						onClickPrev={onClickPrev}
					/>
				</div>
			</div>
			<div className="w-full md:w-4/5 lg:w-2/3">
				<Link href={uri} className="nc-CardLarge1__right relative block">
					<NcImage
						containerClassName="aspect-w-16 aspect-h-12 sm:aspect-h-9 md:aspect-h-14 lg:aspect-h-10 2xl:aspect-h-9 relative"
						className="absolute inset-0 rounded-3xl object-cover"
						src={featuredImage?.sourceUrl || ''}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						priority
					/>
					{/* META TYPE */}
					<PostTypeFeaturedIcon
						postType={postFormats || ''}
						className="absolute right-6 top-6 h-8 w-8 md:h-10 md:w-10"
					/>
				</Link>
			</div>
		</div>
	)
}

export default CardLarge1
