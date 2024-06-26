import { Tab } from "@headlessui/react";
import toast from "react-hot-toast";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonThird from "@/components/Button/ButtonThird";
import Input from "@/components/Input/Input";
import Label from "@/components/Label/Label";
import NcModal from "@/components/NcModal/NcModal";
import React, { FC, useEffect, useState } from "react";
import { EditorItemImageAttrs } from "./MenuBar";
import getTrans from "@/utils/getTrans";
import CircleLoading from "@/components/Loading/CircleLoading";
import Alert from "../Alert";
import { IS_CHISNGHIAX_DEMO_SITE } from "@/contains/site-settings";

interface MenuItemImageProps {
  onClickApply: ({ url, alt, title }: EditorItemImageAttrs) => void;
  onDelete: () => void;
  open?: boolean;
  hanldeClose?: () => void;
  isLoading?: boolean;
  defaultImage?: EditorItemImageAttrs;
  enableUpload?: boolean;
}

const ModalUploadImage: FC<MenuItemImageProps> = ({
  onClickApply,
  onDelete,
  open = false,
  hanldeClose,
  isLoading,
  defaultImage,
  enableUpload = true,
}) => {
  const T = getTrans();

  let [catImages] = useState(["Upload", "Insert from URL"]);

  const [urlState, setUrlState] = useState(defaultImage?.url || "");
  const [altState, setAltState] = useState(defaultImage?.alt || "");
  let [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    setUrlState(defaultImage?.url || "");
    setAltState(defaultImage?.alt || "");
  }, [open]);

  //
  function closeModal() {
    hanldeClose && hanldeClose();
  }

  const handleApply = () => {
    onClickApply({ url: urlState, alt: altState });
  };

  const renderContent = () => {
    return (
      <div>
        <div className="relative flex flex-col px-5 py-6 space-y-5">
          {renderTabsAddImages()}
        </div>
      </div>
    );
  };

  const renderInsertFromUrl = () => {
    return (
      <>
        <form
          className="block space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleApply();
          }}
        >
          <div>
            <Label>{T.pageSubmission["Image URL"]}</Label>
            <Input
              className="mt-1"
              rounded="rounded-xl"
              type={"url"}
              placeholder={T.pageSubmission["Paste or type URL"]}
              onChange={(e) => setUrlState(e.target.value)}
              defaultValue={urlState}
              name="url"
            />
          </div>
          <div>
            <Label>{T.pageSubmission["Alt text (alternative text)"]}</Label>
            <Input
              className="mt-1"
              rounded="rounded-xl"
              type={"text"}
              onChange={(e) => setAltState(e.target.value)}
              defaultValue={altState}
              name="alt"
            />
          </div>
        </form>
      </>
    );
  };

  const renderInsertFromUpload = () => {
    if (!enableUpload)
      return (
        <div className="py-5">
          <Alert type="info">
            {
              T.pageSubmission[
                "Sorry this feature is not available yet. Please use the URL option."
              ]
            }
          </Alert>
        </div>
      );

    const getAccessToken = async () => {
      const response = await fetch("/api/faust/auth/token", {
        method: "GET",
      });
      const data = await response.json();
      const accessToken = data.accessToken;
      return accessToken;
    };

    const handleFileSelect = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (IS_CHISNGHIAX_DEMO_SITE) {
        return toast.error("This is a demo site. Uploading file is disabled.");
      }

      try {
        setFileLoading(true);
        const file = event?.target?.files?.[0];
        if (!file) {
          setFileLoading(false);
          return toast.error("No file selected");
        }

        if (file.size > 1024 * 1024 * 10) {
          setFileLoading(false);
          return toast.error("File size must be less than 10MB");
        }

        const accessToken = await getAccessToken();

        if (!accessToken) {
          setFileLoading(false);
          return toast.error("Error in getting access token!");
        }

        setUrlState(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append("file", file);

        // remove "/" in the end of NEXT_PUBLIC_WORDPRESS_URL if any
        const wordPressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(
          /\/$/,
          ""
        );
        const uploadFile = await fetch(`${wordPressUrl}/wp-json/wp/v2/media`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });
        const uploadFileRes = await uploadFile.json();
        setFileLoading(false);
        const sourceUrl = uploadFileRes.source_url;

        if (!sourceUrl) {
          setUrlState(defaultImage?.url || "");
          toast.error(
            typeof uploadFileRes.message === "string"
              ? uploadFileRes.message
              : "Error in Uploading File!"
          );
        } else {
          toast.success("File Uploaded");
          setUrlState(sourceUrl);
        }
      } catch (err) {
        console.log("File Upload error___", err);
        setFileLoading(false);
        setUrlState(defaultImage?.url || "");
        return toast.error("Error in Uploading File");
      }
    };

    let LOADING = fileLoading;

    return (
      <div className="min-h-[140px]">
        <div className="w-full max-w-40 mx-auto">
          {!!urlState ? (
            <div className="relative aspect-w-4 aspect-h-3 border-2 border-primary-100 rounded-2xl overflow-hidden z-0">
              <img
                src={urlState}
                sizes="400px"
                alt={altState}
                className="absolute inset-0 object-contain"
              />
            </div>
          ) : (
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          )}
        </div>

        <div className="flex justify-center text-sm text-neutral-600 dark:text-neutral-300 mt-3">
          <label
            htmlFor="file-upload"
            className="flex-shrink-0 cursor-pointer rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            {LOADING ? (
              <CircleLoading
                className=" text-blue-600 p-2 block"
                childClassName="w-5 h-5"
              />
            ) : (
              <span>
                {!urlState ? T.pageSubmission["Upload a file"] : T.Replace}
              </span>
            )}
            <input
              id="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileSelect}
              accept="image/*"
            />
          </label>
        </div>
        <p className="flex justify-center text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          PNG, JPG, GIF, WEBP, SVG ...
        </p>

        {urlState && (
          <div className="mt-6">
            <Label>Alt text (alternative text)</Label>
            <Input
              className="mt-1"
              rounded="rounded-xl"
              type={"text"}
              onChange={(e) => setAltState(e.target.value)}
              defaultValue={altState}
              name="alt"
            />
          </div>
        )}
      </div>
    );
  };

  const renderTabsAddImages = () => {
    return (
      <div>
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-primary-900/10 dark:bg-primary-100/10 rounded-xl">
            {catImages.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 
                  ring-offset-blue-400 ring-white/60 dark:ring-black/0 ${
                    selected
                      ? "bg-white dark:bg-neutral-900/80 text-primary-700 dark:text-primary-100 shadow"
                      : " hover:bg-white/30 dark:hover:bg-black/[0.15] text-neutral-600 dark:text-primary-200 "
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {catImages.map((posts, idx) => {
              return (
                <Tab.Panel
                  key={idx}
                  className={`bg-neutral-50 dark:bg-black/10 rounded-xl p-4 space-y-5 focus:outline-none 
                  focus:ring-0`}
                >
                  {!idx ? renderInsertFromUpload() : renderInsertFromUrl()}
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  };

  return (
    <>
      <NcModal
        contentPaddingClass=""
        isOpenProp={open}
        onCloseModal={closeModal}
        contentExtraClass="max-w-screen-md"
        renderContent={renderContent}
        renderTrigger={() => null}
        modalTitle="Add Image"
        renderFooter={(closeModal) => {
          return (
            <div className="flex items-center justify-between">
              <ButtonThird onClick={closeModal}>{T.Cancel}</ButtonThird>
              <div className="flex gap-2">
                {!!urlState && (
                  <ButtonThird
                    loading={isLoading}
                    onClick={() => {
                      setUrlState("");
                      setAltState("");
                      onDelete();
                    }}
                    className="text-red-500"
                  >
                    {T["Remove"]}
                  </ButtonThird>
                )}
                <ButtonPrimary
                  loading={isLoading}
                  onClick={() => {
                    urlState ? handleApply() : closeModal();
                  }}
                >
                  {T.Apply}
                </ButtonPrimary>
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

export default ModalUploadImage;
