import { FC } from 'react'
import NcBookmark, { NcBookmarkProps } from '../NcBookmark/NcBookmark'

export interface PostCardSaveActionProps
	extends Omit<NcBookmarkProps, 'containerClassName'> {
	className?: string
	bookmarkClass?: string
	readingTime?: number
	hidenReadingTime?: boolean
}

const PostCardSaveAction: FC<PostCardSaveActionProps> = ({
	className = '',
	bookmarkClass,
	hidenReadingTime = false,
	readingTime = 3,
	postDatabseId,
}) => {
	return (
		<div
			className={`nc-PostCardSaveAction flex items-center gap-x-2 text-xs text-neutral-700 dark:text-neutral-300 ${className}`}
		>
			{!hidenReadingTime && !!readingTime && (
				<>
					<span className="hidden text-right sm:block">
						<span className="line-clamp-1">{readingTime} 분</span>
					</span>
					<span className="line-clamp-1 block text-right sm:hidden">
						<span className="line-clamp-1">{readingTime}' read</span>
					</span>
				</>
			)}
			<NcBookmark
				postDatabseId={postDatabseId}
				containerClassName={bookmarkClass}
			/>
		</div>
	)
}

export default PostCardSaveAction
