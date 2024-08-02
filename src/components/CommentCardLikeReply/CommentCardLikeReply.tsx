'use client'

import { FC, useState } from 'react'
import convertNumbThousand from '@/utils/convertNumbThousand'
import twFocusClass from '@/utils/twFocusClass'

export interface CommentCardLikeReplyProps {
	className?: string
	onClickReply: () => void
	likeCount: number
	isLiked: boolean
}

const CommentCardLikeReply: FC<CommentCardLikeReplyProps> = ({
	className = '',
	likeCount,
	isLiked: likedProps,
	onClickReply = () => {},
}) => {
	const [isLiked, setIsLiked] = useState(likedProps)

	const renderActionBtns = () => {
		return (
			<>
				<button
					className={`flex h-8 min-w-[68px] items-center rounded-full px-3 text-xs leading-none ${twFocusClass()} ${
						isLiked
							? 'bg-rose-50 text-rose-600'
							: 'bg-neutral-100 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:text-rose-500'
					}`}
					onClick={() => setIsLiked(!isLiked)}
					title="Liked"
				>
					<svg
						className="me-1 h-5 w-5"
						fill={isLiked ? 'currentColor' : 'none'}
						viewBox="0 0 24 24"
					>
						<path
							fillRule="evenodd"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
							clipRule="evenodd"
						></path>
					</svg>

					<span
						className={`${
							isLiked
								? 'text-rose-600'
								: 'text-neutral-900 dark:text-neutral-200'
						}`}
					>
						{convertNumbThousand(likeCount)}
					</span>
				</button>
				<button
					className={`flex h-8 min-w-[68px] items-center rounded-full bg-neutral-100 px-3 text-neutral-600 hover:bg-teal-50 hover:text-teal-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:text-teal-500 ${twFocusClass()} `}
					title="Reply"
					onClick={onClickReply}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="me-2 h-[18px] w-[18px]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
						/>
					</svg>
					<span className="text-xs leading-none text-neutral-900 dark:text-neutral-200">
						Reply
					</span>
				</button>
			</>
		)
	}

	return (
		<div
			className={`nc-CommentCardLikeReply flex items-center space-x-2 rtl:space-x-reverse ${className}`}
			data-nc-id="CommentCardLikeReply"
		>
			{renderActionBtns()}
		</div>
	)
}

export default CommentCardLikeReply
