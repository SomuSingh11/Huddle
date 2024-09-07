"use client";

import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
// import "@uploadthing/react/styles.css"; ---> This line is added in global.css as it was hiding the Navigation Bar

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType != "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload" className="rounded-full" />
        <button>
          <X
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url); // When the file upload is successful, update the "value" with url using the onChange callback
      }}
      onUploadError={(error: Error) => {
        //alert(`Error! ${error.message}`)
        console.log(error.message);
      }}
    />
  );
};
