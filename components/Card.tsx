/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Models } from "node-appwrite";
import React, { Dispatch, SetStateAction } from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

// Define the shape of the state
type PreviewState = {
  visible: boolean;
  index: number;
};

const Card = ({
  file,
  currentUser,
  selected,
  selectedFiles,
  setSelectedFiles,
  setPreviewVisible,
  index,
}: {
  file: Models.Document;
  currentUser: Models.Document;
  selected: boolean;
  selectedFiles: any[];
  setSelectedFiles: Dispatch<SetStateAction<any[]>>;
  setPreviewVisible: Dispatch<SetStateAction<PreviewState>>;
  index: number;
}) => {
  const isSelected = selectedFiles.some(
    (selectedFile) => selectedFile.$id === file.$id
  );

  const handleCheckboxChange = () => {
    if (isSelected) {
      // Remove fileId from selectedFiles
      setSelectedFiles((prevSelectedFiles: any[]) =>
        prevSelectedFiles.filter(
          (selectedFile) => selectedFile.$id !== file.$id
        )
      );
    } else {
      // Add fileId to selectedFiles
      setSelectedFiles((prevSelectedFiles: any) => [
        ...prevSelectedFiles,
        file,
      ]);
    }
  };

  const handlePreviewForOthers = () => {
    window.open(file.url, "_blank");
  };

  return (
    <div
      className={`file-card ${
        selected && isSelected ? "border-brand border-2" : ""
      }`}
      onClick={() => {
        if (!isSelected && !selected) {
          if (file.type === "image") {
            setPreviewVisible({ visible: true, index});
          } else {
            handlePreviewForOthers();
          }
        } else {
          handleCheckboxChange();
        }
      }}
    >
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          {!selected ? (
            <ActionDropdown file={file} currentUser={currentUser} />
          ) : (
            <div style={{ width: 34, height: 34 }}></div>
          )}
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-size-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          {currentUser.$id === file.owner.$id
            ? "You"
            : `By: ${file.owner.fullName}`}
        </p>
      </div>
      {selected && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
      )}
    </div>
  );
};

export default Card;
