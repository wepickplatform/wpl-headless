import { FC } from 'react'
import NcImage from '@/components/NcImage/NcImage'
import ButtonSecondary from '@/components/Button/ButtonSecondary'
import Card5 from '@/components/Card5/Card5'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { SectionMagazine1Props } from './SectionMagazine1'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'

export interface SectionHero3Props extends SectionMagazine1Props {}

const SectionHero3: FC<SectionHero3Props> = ({ posts, className = '' }) => {
	const renderMain = () => {
		const { featuredImage, title, excerpt, uri } = getPostDataFromPostFragment(
			posts[0],
		)
		return (
			<div className="aspect-h-8 aspect-w-8 sm:aspect-w-10 lg:aspect-w-16">
				<NcImage
					alt={featuredImage?.altText || title}
					containerClassName="absolute inset-0 rounded-[40px] overflow-hidden z-0"
					src={featuredImage?.sourceUrl || ''}
					fill
					sizes="(max-width: 1024px) 100vw, 1280px"
					enableDefaultPlaceholder
					priority
				/>
				<span className="absolute inset-0 rounded-[40px] bg-black bg-opacity-50"></span>
				<div className="absolute inset-0 p-5 md:p-14 xl:p-20 2xl:p-28">
					<div className="max-w-2xl">
						<h2 className="text-xl font-semibold text-white sm:text-3xl lg:text-4xl">
							<span className="line-clamp-2">{title}</span>
						</h2>
						<span className="mt-3 block text-sm text-neutral-300 sm:mt-5 sm:text-base">
							<span
								className="line-clamp-2"
								dangerouslySetInnerHTML={{ __html: excerpt }}
							></span>
						</span>
						<div className="mt-5 sm:mt-8">
							<ButtonSecondary href={uri}>
								<span>자세히보기</span>
								<ArrowRightIcon className="ms-3 h-5 w-5 rtl:rotate-180" />
							</ButtonSecondary>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const renderSubPosts = () => {
		const subPosts = posts.filter((_, i) => i >= 1 && i < 4)
		return (
			<div className="mt-6 grid transform gap-4 sm:grid-cols-2 md:-mt-20 md:grid-cols-3 lg:gap-8 lg:px-14 xl:px-20 2xl:px-28">
				{subPosts.map(post => (
					<Card5
						className="rounded-3xl bg-white shadow-2xl dark:bg-neutral-800"
						// @ts-ignore
						key={post.databaseId}
						post={post}
					/>
				))}
			</div>
		)
	}

	return (
		<div className={`nc-SectionHero3 ${className}`}>
			{posts.length && renderMain()}
			{posts.length > 1 && renderSubPosts()}
		</div>
	)
}

export default SectionHero3
