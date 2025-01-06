/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/Card";
import Sort from "@/components/Sort";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  getFiles,
  getTotalSpaceUsed,
} from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import {
  constructDownloadUrl,
  convertFileSize,
  getFileTypesParams,
} from "@/lib/utils";
import { Models } from "node-appwrite";
import Loader from "@/components/Loader";
import { actionsDropdownItems } from "@/constants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import PreviewCarousel from "@/components/PreviewCarousel";

type TotalSpaceKeys = "image" | "document" | "video" | "audio" | "other";

const Page = ({
  searchParams,
  params,
}: {
  searchParams: Promise<any>;
  params: Promise<any>;
}) => {
  const [files, setFiles] = useState<Models.Document[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [totalSpace, setTotalSpace] = useState<TotalSpaceProps>({
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: 0,
  });
  const [isSelected, setIsSelected] = useState(false);
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Models.Document[]>([]);
  const key = type.replace("s", "") as TotalSpaceKeys;
  const path = usePathname();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { toast } = useToast();
  const [previewVisible, setPreviewVisible] = useState({
    visible: false,
    index: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const resolvedSearchParams = await searchParams;

        const typeValue = (resolvedParams?.type as string) || "";
        setType(typeValue);

        const searchText = (resolvedSearchParams?.query as string) || "";
        const sort = (resolvedSearchParams?.sort as string) || "";

        const types = getFileTypesParams(typeValue) as FileType[];

        const [filesResponse, userResponse, spaceResponse] = await Promise.all([
          getFiles({ types, searchText, sort }),
          getCurrentUser(),
          getTotalSpaceUsed(),
        ]);

        setFiles(filesResponse.documents || []);
        setCurrentUser(userResponse);
        setTotalSpace(spaceResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, searchParams]);

  const handleDeleteAction = async () => {
    setSubmitLoading(true);
    try {
      // Wait for all deleteFile calls to finish
      await Promise.all(
        selectedFiles.map((file) => {
          return deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path,
          }); // Assuming deleteFile requires file.$id
        })
      );
      // Optionally, update the state to reflect deleted files
      setSelectedFiles([]);
      setIsSelected(false);
      setSubmitLoading(false);
      // e.g., remove the deleted files from selectedFiles or update the UI
    } catch (error) {
      console.error("Error deleting files:", error);
      // Handle the error, e.g., display a notification or alert
    }

    return toast({
      description: (
        <p className="body-2 text-white">Files deleted successfully.</p>
      ),
      className: "success-toast",
    });
  };

  const handleDownloadAction = () => {
    selectedFiles.forEach((file, index) => {
      // Create a temporary anchor element for each file
      const link = document.createElement("a");

      // Construct the download URL for the file
      const downloadUrl = constructDownloadUrl(file.bucketFileId);

      // Set the download URL to the anchor element
      link.href = downloadUrl;

      // Optionally set the filename for the downloaded file
      link.download = file.name;

      // Append the link to the document body
      document.body.appendChild(link);

      // Use a setTimeout to add a small delay before triggering each download
      setTimeout(() => {
        // Trigger a click on the link to start the download
        link.click();

        // Remove the link after the click
        document.body.removeChild(link);
      }, index * 500); // Delay each download by 500ms to avoid being blocked

      setSelectedFiles([]);
      setIsSelected(false);
    });

    return toast({
      description: (
        <p className="body-2 text-white">Files downloaded successfully.</p>
      ),
      className: "success-toast",
    });
  };

  if (loading) {
    return (
      <div className="flex-center h-[100%]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <section className="w-full">
          <h1 className="h1 capitalize">{type || "Files"}</h1>

          <div className="total-size-section">
            <p className="body-1">
              Total:{" "}
              <span className="h5">
                {type === "media"
                  ? convertFileSize(
                      totalSpace.video?.size + totalSpace.audio?.size
                    )
                  : convertFileSize(totalSpace[key]?.size || 0)}
              </span>
            </p>
          </div>
          <div className="flex mt-4 flex-col justify-between sm:flex-row sm:items-center">
            <div className="flex gap-3 items-center">
              {selectedFiles.length > 0 &&
                actionsDropdownItems
                  .filter(
                    ({ value }) =>
                      value !== "details" &&
                      value !== "rename" &&
                      value !== "share"
                  )
                  .map(({ label, icon, value }) =>
                    value !== "download" ? (
                      <Button
                        key={value}
                        onClick={handleDeleteAction}
                        disabled={submitLoading}
                        className="flex gap-2 items-center justify-center bg-white text-dark-100 hover:bg-gray-200"
                      >
                        <Image src={icon} alt={label} width={30} height={50} />
                        <p className="subtitle-2">
                          {submitLoading ? "Deleting..." : label}
                        </p>
                      </Button>
                    ) : (
                      <Button
                        key={value}
                        onClick={handleDownloadAction}
                        className="flex gap-2 items-center justify-center bg-white text-dark-100 hover:bg-gray-200"
                      >
                        <Image src={icon} alt={label} width={30} height={50} />
                        <p className="subtitle-2">{label}</p>
                      </Button>
                    )
                  )}
            </div>
            {files.length > 0 && (
              <div className="flex gap-3 items-center">
                <div className="sort-container">
                  <p className="body-1 hidden sm:block text-light-200">
                    Sort by:
                  </p>
                  <Sort />
                </div>
                <Button
                  className="primary-btn h-10"
                  onClick={() => {
                    setIsSelected((prev) => !prev);
                    setSelectedFiles([]);
                  }}
                >
                  {isSelected
                    ? `Deselect (${selectedFiles.length}) ✖`
                    : "Select ✔"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/** Render files */}
        {files.length > 0 ? (
          <section className="file-list">
            {files.map((file: Models.Document, index) => (
              <Card
                key={file.$id}
                file={file}
                currentUser={currentUser}
                selected={isSelected}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setPreviewVisible={setPreviewVisible}
                index={index}
              />
            ))}
          </section>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </div>
      {previewVisible.visible && (
        <PreviewCarousel
          setPreviewVisible={setPreviewVisible}
          startIndex={previewVisible.index}
        >
          {files.map((file, index) => (
            <div key={index}>
              {file.type === "image" && (
                <>
                <div className="absolute top-3 bottom-0">
                  <p className="h2 text-light-200">{file.name}</p>
                </div>
                  <Image
                    key={index}
                    src={file.url}
                    alt={file.name}
                    width={700}
                    height={800}
                    className="h-[800px] w-[700px]"
                  />
                </>
              )}
            </div>
          ))}
        </PreviewCarousel>
      )}
    </>
  );
};

export default Page;
