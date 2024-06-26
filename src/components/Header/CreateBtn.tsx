import { PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Link from "next/link";
import { useLoginModal } from "@/hooks/useLoginModal";

import { NC_SITE_SETTINGS } from "@/contains/site-settings";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getTrans from "@/utils/getTrans";

interface Props {
  className?: string;
}

const CreateBtn: FC<Props> = ({ className = "hidden md:block " }) => {
  const { isReady, isAuthenticated } = useSelector(
    (state: RootState) => state.viewer.authorizedUser
  );
  const { openLoginModal } = useLoginModal();
  const T = getTrans();

  if (NC_SITE_SETTINGS["submissions-settings"].enable === false) {
    return null;
  }

  return (
    <div className={`LangDropdown ${className}`}>
      <Link
        href="/submission"
        className={`
             group h-10 sm:h-12 px-3 py-1.5 inline-flex items-center justify-center rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-80 hover:opacity-100`}
        onClick={(e) => {
          if (!isAuthenticated) {
            e.preventDefault();
            if (!isReady) {
              toast.error(T["Please wait a moment, data is being prepared."]);
              return;
            }
            openLoginModal();
          }
        }}
      >
        <PlusIcon className="w-5 h-5 -ms-1" />
        <span className="ms-2">{T.Create}</span>
      </Link>
    </div>
  );
};
export default CreateBtn;
