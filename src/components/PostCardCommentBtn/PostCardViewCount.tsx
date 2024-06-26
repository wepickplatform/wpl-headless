import Link from "next/link";
import React, { FC } from "react";
import { EyeIcon } from "../Icons/Icons";

export interface PostCardViewCountProps {
  className?: string;
  sizeClassName?: string;
  viewCount?: number;
}

const PostCardViewCount: FC<PostCardViewCountProps> = ({
  className = "",
  sizeClassName = "w-9 h-9",
  viewCount = 1,
}) => {
  const renderContent = () => {
    return (
      <>
        <div
          className={`flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-50 transition-colors duration-75 dark:bg-neutral-800 group-hover/PostCardViewCount:bg-indigo-50 dark:group-hover/PostCardViewCount:bg-indigo-100 ${sizeClassName}`}
        >
          <EyeIcon className="w-5 h-5" />
        </div>

        <span className="ms-2 text-start flex-shrink-0 min-w-[1.125rem] text-neutral-900 dark:text-neutral-200 transition-colors duration-100">
          {viewCount}
        </span>
      </>
    );
  };

  const classess = `nc-PostCardViewCount group/PostCardViewCount relative flex items-center text-neutral-600 transition-colors dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-500 ${className} text-xs`;

  return (
    <div className={classess} title="Views">
      {renderContent()}
    </div>
  );
};

export default PostCardViewCount;
